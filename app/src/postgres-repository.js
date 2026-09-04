const crypto = require('node:crypto');
const { Pool } = require('pg');

const DEMO_OTP = '123456';
const DAILY_LIMIT = 2000000;
const INTERBANK_FEE = 100;

function money(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return NaN;
  return Math.round(n * 100) / 100;
}

function reference() {
  return `SBK${Date.now()}${crypto.randomInt(100000, 999999)}`;
}

function requestHash(input) {
  return crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex');
}

function mapAccount(row) {
  return {
    id: row.id,
    accountNo: row.account_no,
    customerId: row.customer_id,
    name: row.account_type === 'SAVINGS' ? 'Savings Account' : 'Current Account',
    type: row.account_type,
    currency: row.currency,
    status: row.status,
    availableBalance: Number(row.available_balance),
    ledgerBalance: Number(row.ledger_balance)
  };
}

function mapTransaction(row) {
  return {
    id: row.id,
    reference: row.transaction_ref,
    accountId: row.account_id,
    type: row.entry_type,
    amount: Number(row.amount),
    balanceAfter: Number(row.balance_after),
    currency: row.currency,
    status: row.status || 'COMPLETED',
    date: row.created_at
  };
}

function createPostgresBank(config = {}) {
  const pool = config.pool || new Pool({
    connectionString: config.connectionString || process.env.DATABASE_URL,
    max: Number(process.env.DB_POOL_MAX || 10),
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS || 30000),
    connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS || 5000),
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false' } : undefined
  });

  async function customerById(customerId, client = pool) {
    const result = await client.query(
      `SELECT c.id, c.customer_no, c.first_name, c.last_name, c.email, c.phone, c.status,
              u.id AS user_id, u.username, u.role, u.mfa_enabled
         FROM customers c JOIN users u ON u.customer_id = c.id
        WHERE c.id = $1 LIMIT 1`,
      [customerId]
    );
    return result.rows[0] || null;
  }

  async function getCustomer(customerId) {
    return customerById(customerId);
  }

  async function getUser(username) {
    const result = await pool.query(
      `SELECT u.id, u.customer_id, u.username, u.password_hash, u.role, u.mfa_enabled, u.status,
              c.customer_no, c.first_name, c.last_name, c.email, c.phone, c.status AS customer_status
         FROM users u JOIN customers c ON c.id = u.customer_id
        WHERE u.username = $1 LIMIT 1`,
      [username]
    );
    return result.rows[0] || null;
  }

  async function getAccounts(customerId) {
    const result = await pool.query(
      `SELECT id, account_no, customer_id, account_type, currency, status, available_balance, ledger_balance
         FROM accounts WHERE customer_id = $1 ORDER BY account_no`,
      [customerId]
    );
    return result.rows.map(mapAccount);
  }

  async function getAccount(accountId, customerId) {
    const result = await pool.query(
      `SELECT id, account_no, customer_id, account_type, currency, status, available_balance, ledger_balance
         FROM accounts WHERE id = $1 AND customer_id = $2 LIMIT 1`,
      [accountId, customerId]
    );
    return result.rows[0] ? mapAccount(result.rows[0]) : null;
  }

  async function getTransactions(customerId, accountId) {
    const params = [customerId];
    const filter = accountId ? 'AND a.id = $2' : '';
    if (accountId) params.push(accountId);
    const result = await pool.query(
      `SELECT l.id, l.transaction_ref, l.account_id, l.entry_type, l.amount, l.currency,
              l.balance_after, l.created_at, t.status
         FROM ledger_entries l
         JOIN accounts a ON a.id = l.account_id
         LEFT JOIN transfers t ON t.reference = l.transaction_ref
        WHERE a.customer_id = $1 ${filter}
        ORDER BY l.created_at DESC LIMIT 250`,
      params
    );
    return result.rows.map(mapTransaction);
  }

  async function getBeneficiaries(customerId) {
    const result = await pool.query(
      `SELECT id, bank_code, bank_name, account_no, account_name, status
         FROM beneficiaries WHERE customer_id = $1 ORDER BY created_at DESC`,
      [customerId]
    );
    return result.rows.map(row => ({ id: row.id, bankCode: row.bank_code, bankName: row.bank_name, accountNumber: row.account_no, name: row.account_name, verified: row.status === 'ACTIVE' }));
  }

  async function dailyTransferred(customerId) {
    const result = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS used
         FROM transfers
        WHERE customer_id = $1
          AND status = 'COMPLETED'
          AND created_at >= date_trunc('day', now())`,
      [customerId]
    );
    return Number(result.rows[0].used);
  }

  async function getAudit(customerId) {
    const result = await pool.query(
      `SELECT a.id, a.action, a.resource_type, a.resource_id, a.outcome, a.correlation_id, a.metadata, a.created_at
         FROM audit_logs a
         LEFT JOIN users u ON u.id = a.actor_user_id
        WHERE u.customer_id = $1 OR a.actor_user_id IS NULL
        ORDER BY a.created_at DESC LIMIT 250`,
      [customerId]
    );
    return result.rows.map(row => ({ id: row.id, action: row.action, details: row.metadata, outcome: row.outcome, resourceType: row.resource_type, resourceId: row.resource_id, correlationId: row.correlation_id, timestamp: row.created_at }));
  }

  async function writeAudit(client, { userId = null, action, resourceType, resourceId = null, outcome = 'SUCCESS', correlationId = null, metadata = {} }) {
    await client.query(
      `INSERT INTO audit_logs (actor_user_id, action, resource_type, resource_id, outcome, correlation_id, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb)`,
      [userId, action, resourceType, resourceId, outcome, correlationId, JSON.stringify(metadata)]
    );
  }

  async function transfer(input) {
    const amount = money(input.amount);
    if (input.otp !== DEMO_OTP) throw new Error('Invalid OTP');
    if (!Number.isFinite(amount) || amount <= 0) throw new Error('Amount must be greater than zero');
    if (!input.customerId || !input.fromAccountId) throw new Error('Customer and source account are required');
    if (!input.idempotencyKey) throw new Error('Idempotency-Key is required');
    if (!['intra', 'inter'].includes(input.channel)) throw new Error('Unsupported transfer channel');

    const client = await pool.connect();
    const hash = requestHash({ ...input, otp: undefined });
    try {
      await client.query('BEGIN');

      const existing = await client.query(
        `SELECT request_hash, response_status, response_body
           FROM idempotency_keys
          WHERE key = $1 AND customer_id = $2
          FOR UPDATE`,
        [input.idempotencyKey, input.customerId]
      );
      if (existing.rows[0]) {
        if (existing.rows[0].request_hash !== hash) throw new Error('Idempotency key was already used for a different request');
        if (existing.rows[0].response_body) {
          await client.query('COMMIT');
          return existing.rows[0].response_body;
        }
      } else {
        await client.query(
          `INSERT INTO idempotency_keys (key, customer_id, request_hash, expires_at)
           VALUES ($1,$2,$3,now()+interval '24 hours')`,
          [input.idempotencyKey, input.customerId, hash]
        );
      }

      const daily = await client.query(
        `SELECT COALESCE(SUM(amount),0) AS used FROM transfers
          WHERE customer_id=$1 AND status='COMPLETED' AND created_at >= date_trunc('day', now())`,
        [input.customerId]
      );
      if (Number(daily.rows[0].used) + amount > DAILY_LIMIT) throw new Error('Daily transfer limit exceeded');

      const sourceResult = await client.query(
        `SELECT * FROM accounts WHERE id=$1 AND customer_id=$2 AND status='ACTIVE' FOR UPDATE`,
        [input.fromAccountId, input.customerId]
      );
      const source = sourceResult.rows[0];
      if (!source) throw new Error('Source account not found');
      if (source.currency !== 'NGN') throw new Error('Unsupported currency');

      const fee = input.channel === 'inter' ? INTERBANK_FEE : 0;
      if (amount + fee > Number(source.available_balance)) throw new Error('Insufficient funds including transaction fee');

      let destination = null;
      if (input.channel === 'intra') {
        if (!input.toAccountId) throw new Error('Valid destination account required');
        const destResult = await client.query(
          `SELECT * FROM accounts WHERE id=$1 AND customer_id=$2 AND status='ACTIVE' FOR UPDATE`,
          [input.toAccountId, input.customerId]
        );
        destination = destResult.rows[0];
        if (!destination || destination.id === source.id) throw new Error('Valid destination account required');
        if (destination.currency !== source.currency) throw new Error('Currency mismatch');
      } else {
        if (!/^\d{10}$/.test(String(input.toAccountNumber || ''))) throw new Error('Beneficiary account number must be 10 digits');
        if (!input.toBankCode || !input.toAccountName) throw new Error('Beneficiary bank and account name are required');
      }

      const ref = reference();
      const sourceBalance = money(Number(source.available_balance) - amount - fee);
      await client.query(
        `UPDATE accounts SET available_balance=$1, ledger_balance=$1, version=version+1, updated_at=now() WHERE id=$2`,
        [sourceBalance, source.id]
      );
      await client.query(
        `INSERT INTO ledger_entries (transaction_ref, account_id, entry_type, amount, currency, balance_after)
         VALUES ($1,$2,'DEBIT',$3,$4,$5)`,
        [ref, source.id, amount + fee, source.currency, sourceBalance]
      );

      if (destination) {
        const destinationBalance = money(Number(destination.available_balance) + amount);
        await client.query(
          `UPDATE accounts SET available_balance=$1, ledger_balance=$1, version=version+1, updated_at=now() WHERE id=$2`,
          [destinationBalance, destination.id]
        );
        await client.query(
          `INSERT INTO ledger_entries (transaction_ref, account_id, entry_type, amount, currency, balance_after)
           VALUES ($1,$2,'CREDIT',$3,$4,$5)`,
          [ref, destination.id, amount, destination.currency, destinationBalance]
        );
      }

      const status = input.simulateFailure && input.channel === 'inter' ? 'REVERSED' : 'COMPLETED';
      if (status === 'REVERSED') {
        const reversedBalance = money(sourceBalance + amount + fee);
        await client.query(
          `UPDATE accounts SET available_balance=$1, ledger_balance=$1, version=version+1, updated_at=now() WHERE id=$2`,
          [reversedBalance, source.id]
        );
        await client.query(
          `INSERT INTO ledger_entries (transaction_ref, account_id, entry_type, amount, currency, balance_after)
           VALUES ($1,$2,'CREDIT',$3,$4,$5)`,
          [`${ref}-REV`, source.id, amount + fee, source.currency, reversedBalance]
        );
      }

      await client.query(
        `INSERT INTO transfers
          (reference, customer_id, source_account_id, destination_bank_code, destination_account_no,
           destination_account_name, amount, fee, currency, status, idempotency_key, failure_code, failure_reason, completed_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,CASE WHEN $10 IN ('COMPLETED','REVERSED') THEN now() END)`,
        [ref, input.customerId, source.id, input.channel === 'intra' ? '044' : input.toBankCode,
         destination ? destination.account_no : input.toAccountNumber,
         destination ? (destination.account_type === 'SAVINGS' ? 'Savings Account' : 'Current Account') : input.toAccountName,
         amount, fee, source.currency, status, input.idempotencyKey,
         status === 'REVERSED' ? 'SIMULATED_FAILURE' : null,
         status === 'REVERSED' ? 'External transfer failed; funds reversed' : null]
      );

      const response = { status, reference: ref, amount, fee, currency: source.currency };
      await client.query(
        `UPDATE idempotency_keys SET response_status=$1, response_body=$2::jsonb WHERE key=$3`,
        [200, JSON.stringify(response), input.idempotencyKey]
      );
      await writeAudit(client, {
        userId: input.userId || null,
        action: status === 'COMPLETED' ? 'TRANSFER_COMPLETED' : 'TRANSFER_REVERSED',
        resourceType: 'TRANSFER',
        resourceId: ref,
        correlationId: input.correlationId || null,
        metadata: { channel: input.channel, amount, fee, fromAccountId: source.id, destinationAccountNo: destination ? destination.account_no : input.toAccountNumber }
      });
      await client.query('COMMIT');
      return response;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async function billPayment(input) {
    const amount = money(input.amount);
    if (!Number.isFinite(amount) || amount <= 0) throw new Error('Amount must be greater than zero');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(`SELECT * FROM accounts WHERE id=$1 AND customer_id=$2 AND status='ACTIVE' FOR UPDATE`, [input.fromAccountId, input.customerId]);
      const account = result.rows[0];
      if (!account) throw new Error('Source account not found');
      if (amount > Number(account.available_balance)) throw new Error('Insufficient funds');
      const ref = `BILL${Date.now()}${crypto.randomInt(100,999)}`;
      const balance = money(Number(account.available_balance) - amount);
      await client.query(`UPDATE accounts SET available_balance=$1, ledger_balance=$1, version=version+1, updated_at=now() WHERE id=$2`, [balance, account.id]);
      await client.query(`INSERT INTO ledger_entries (transaction_ref, account_id, entry_type, amount, currency, balance_after) VALUES ($1,$2,'DEBIT',$3,$4,$5)`, [ref, account.id, amount, account.currency, balance]);
      await writeAudit(client, { userId: input.userId || null, action: 'BILL_PAYMENT_COMPLETED', resourceType: 'BILL_PAYMENT', resourceId: ref, metadata: { amount, service: input.service || 'Utility' } });
      await client.query('COMMIT');
      return { status: 'COMPLETED', reference: ref, amount, service: input.service || 'Utility', currency: account.currency, message: 'Bill payment completed in PostgreSQL sandbox.' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async function health() {
    const result = await pool.query('SELECT now() AS database_time');
    return { ok: true, databaseTime: result.rows[0].database_time };
  }

  return {
    getCustomer,
    getUser,
    getAccounts,
    getAccount,
    getTransactions,
    getBeneficiaries,
    getAudit,
    dailyTransferred,
    transfer,
    billPayment,
    health,
    dailyLimit: DAILY_LIMIT,
    close: () => pool.end(),
    pool
  };
}

module.exports = { createPostgresBank, DEMO_OTP, DAILY_LIMIT, INTERBANK_FEE };
