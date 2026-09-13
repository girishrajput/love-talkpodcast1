/**
 * Idempotent cleanup for mock/test-mode subscription data.
 *
 * While Razorpay was unconfigured, the membership checkout flow
 * (src/app/membership/page.tsx) fell back to a mock flow that always
 * generates a `razorpay_payment_id` shaped like `pay_test_<timestamp>_<random>`.
 * A real Razorpay payment id is never shaped like that, so it is an
 * unambiguous marker for rows this script is safe to remove. Repeated mock
 * "subscriptions" also each extended the affected membership's end_date by
 * +365 days, which is why some test accounts show absurd expiry years.
 *
 * This script only ever touches rows reachable from a `pay_test_%` payment,
 * so it never deletes a real payment/membership by mistake.
 *
 * Usage:
 *   node scripts/clean-test-payments.js                                   # dry run (default) - reports only, changes nothing
 *   node scripts/clean-test-payments.js --confirm                         # actually deletes
 *   node scripts/clean-test-payments.js --confirm --email=someone@x.com   # scope to one account
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load .env.local the same way scripts/repair-db.js does — plain `node`
// scripts don't get Next.js's own env loading, which only runs inside
// `next dev` / `next build`.
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

const args = process.argv.slice(2);
const CONFIRM = args.includes('--confirm') || args.includes('--yes');
const emailArg = args.find((a) => a.startsWith('--email='));
const scopedEmail = emailArg ? emailArg.split('=')[1].trim().toLowerCase() : null;

function fmtDate(d) {
  return d ? new Date(d).toISOString().slice(0, 10) : '—';
}

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lovetalkpodcast',
    waitForConnections: true,
    connectionLimit: 5,
  });

  try {
    console.log(`Scanning for mock/test-mode payment data${scopedEmail ? ` (scoped to ${scopedEmail})` : ''}...`);

    // MySQL LIKE treats "_" as a single-char wildcard, so escape the literal
    // underscores in "pay_test_" to avoid accidentally matching real ids.
    let sql = `
      SELECT p.id AS payment_id, p.user_id, p.membership_id, p.razorpay_payment_id,
             p.razorpay_order_id, p.razorpay_subscription_id, pr.email
      FROM payments p
      LEFT JOIN profiles pr ON pr.id = p.user_id
      WHERE p.razorpay_payment_id LIKE 'pay\\_test\\_%'
    `;
    const params = [];
    if (scopedEmail) {
      sql += ` AND pr.email = ?`;
      params.push(scopedEmail);
    }

    const [testPayments] = await pool.query(sql, params);

    if (testPayments.length === 0) {
      console.log('No mock/test payment records found. Nothing to clean.');
      return;
    }

    const membershipIds = [...new Set(testPayments.map((p) => p.membership_id).filter(Boolean))];
    const orderIds = [...new Set(
      testPayments.flatMap((p) => [p.razorpay_order_id, p.razorpay_subscription_id]).filter(Boolean)
    )];
    const paymentIds = testPayments.map((p) => p.payment_id);
    const userIds = [...new Set(testPayments.map((p) => p.user_id))];

    console.log(`\nFound ${testPayments.length} mock payment record(s) across ${userIds.length} account(s):`);
    for (const p of testPayments) {
      console.log(`  - ${p.email || p.user_id} | payment=${p.razorpay_payment_id} | order/sub=${p.razorpay_order_id}`);
    }

    let membershipsPreview = [];
    if (membershipIds.length > 0) {
      const [rows] = await pool.query(
        `SELECT id, user_id, plan_id, status, start_date, end_date FROM memberships WHERE id IN (${membershipIds.map(() => '?').join(',')})`,
        membershipIds
      );
      membershipsPreview = rows;
      console.log(`\nMembership rows created by these test payments (will be removed):`);
      for (const m of rows) {
        console.log(`  - ${m.id} | user=${m.user_id} | status=${m.status} | ${fmtDate(m.start_date)} -> ${fmtDate(m.end_date)}`);
      }
    }

    let orphanOrdersPreview = [];
    if (orderIds.length > 0) {
      const [rows] = await pool.query(
        `SELECT id, user_id, razorpay_order_id, status FROM membership_orders WHERE razorpay_order_id IN (${orderIds.map(() => '?').join(',')})`,
        orderIds
      );
      orphanOrdersPreview = rows;
    }

    if (!CONFIRM) {
      console.log(
        `\nDRY RUN - no changes made. Re-run with --confirm to delete the ${testPayments.length} payment(s), ` +
        `${membershipsPreview.length} membership(s), and ${orphanOrdersPreview.length} order(s) listed above.`
      );
      return;
    }

    console.log('\nCleaning up (--confirm passed)...');

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      if (paymentIds.length > 0) {
        await connection.query(
          `DELETE FROM payments WHERE id IN (${paymentIds.map(() => '?').join(',')})`,
          paymentIds
        );
      }
      if (membershipIds.length > 0) {
        await connection.query(
          `DELETE FROM memberships WHERE id IN (${membershipIds.map(() => '?').join(',')})`,
          membershipIds
        );
      }
      if (orderIds.length > 0) {
        await connection.query(
          `DELETE FROM membership_orders WHERE razorpay_order_id IN (${orderIds.map(() => '?').join(',')})`,
          orderIds
        );
      }

      await connection.commit();
      console.log(
        `Removed ${paymentIds.length} test payment(s), ${membershipIds.length} test membership(s), ${orderIds.length} test order(s).`
      );

      for (const uid of userIds) {
        const [remaining] = await connection.query(
          `SELECT COUNT(*) as c FROM memberships WHERE user_id = ? AND status = 'active'`,
          [uid]
        );
        if (remaining[0].c === 0) {
          console.log(`  -> user ${uid} now has no active membership (correctly reset to free tier).`);
        }
      }
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
