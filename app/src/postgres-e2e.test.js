const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { Pool } = require('pg');
const { createPostgresBank } = require('./postgres-repository');

const databaseUrl = process.env.DATABASE_URL;

test('PostgreSQL runtime preserves balances and is idempotent', { skip: !databaseUrl }, async () => {
  const pool = new Pool({ connectionString: databaseUrl });
  const bank = createPostgresBank({ connectionString: databaseUrl });
  const suffix = crypto.randomBytes(5).toString('hex');
  let customerId;
  let accountA;
  let accountB;

  try {
    const customer = await pool.query(
      `INSERT INTO customers (customer_no, first_name, last_name, email, phone)
       VALUES ($1,'Integration','Test',$2,$3) RETURNING id`,
      [`IT${Date.now()}${suffix}`, `integration-${suffix}@example.invalid`, `081${suffix.slice(0,8)}`]
    );
    customerId = customer.rows[0].id;

    const accountNoA = `91${Date.now().toString().slice(-8)}`;
    const accountNoB = `92${Date.now().toString().slice(-8)}`;
    const accounts = await pool.query(
      `INSERT INTO accounts (customer_id, account_no, account_type, available_balance, ledger_balance)
       VALUES ($1,$2,'CURRENT',1000,1000),($1,$3,'SAVINGS',500,500)
       RETURNING id, account_no, available_balance`,
      [customerId, accountNoA, accountNoB]
    );
    const byNumber = new Map(accounts.rows.map(row => [row.account_no, row.id]));
    accountA = byNumber.get(accountNoA);
    accountB = byNumber.get(accountNoB);

    const before = await bank.getAccounts(customerId);
    const beforeTotal = before.reduce((sum, account) => sum + account.availableBalance, 0);

    const request = {
      customerId,
      fromAccountId: accountA,
      toAccountId: accountB,
      amount: 125,
      channel: 'intra',
      otp: '123456',
      idempotencyKey: `integration-${suffix}`,
      correlationId: `corr-${suffix}`
    };

    const first = await bank.transfer(request);
    const retry = await bank.transfer(request);
    assert.equal(first.status, 'COMPLETED');
    assert.equal(retry.reference, first.reference);

    const after = await bank.getAccounts(customerId);
    const afterTotal = after.reduce((sum, account) => sum + account.availableBalance, 0);
    assert.equal(afterTotal, beforeTotal);
    assert.equal(after.find(a => a.id === accountA).availableBalance, 875);
    assert.equal(after.find(a => a.id === accountB).availableBalance, 625);

    const control = await pool.query(
      `SELECT balanced FROM transfer_ledger_control WHERE reference=$1`,
      [first.reference]
    );
    assert.equal(control.rows[0].balanced, true);
  } finally {
    if (customerId) {
      await pool.query('DELETE FROM idempotency_keys WHERE customer_id=$1', [customerId]);
      await pool.query('DELETE FROM audit_logs WHERE actor_user_id IN (SELECT id FROM users WHERE customer_id=$1) OR resource_id IN (SELECT reference FROM transfers WHERE customer_id=$1)', [customerId]);
      await pool.query('DELETE FROM ledger_entries WHERE account_id IN (SELECT id FROM accounts WHERE customer_id=$1)', [customerId]);
      await pool.query('DELETE FROM transfers WHERE customer_id=$1', [customerId]);
      await pool.query('DELETE FROM beneficiaries WHERE customer_id=$1', [customerId]);
      await pool.query('DELETE FROM accounts WHERE customer_id=$1', [customerId]);
      await pool.query('DELETE FROM users WHERE customer_id=$1', [customerId]);
      await pool.query('DELETE FROM customers WHERE id=$1', [customerId]);
    }
    await bank.close();
    await pool.end();
  }
});
