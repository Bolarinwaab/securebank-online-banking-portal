const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createBank, DEMO_OTP } = require('./src/banking');
const { createPostgresBank } = require('./src/postgres-repository');

const persistence = (process.env.PERSISTENCE || 'memory').toLowerCase();
const bank = persistence === 'postgres' ? createPostgresBank() : createBank();
const sessions = new Map();
const DEMO_USER = process.env.SECUREBANK_DEMO_USER || 'alex.morgan';
const DEMO_PASSWORD = process.env.SECUREBANK_DEMO_PASSWORD || 'PORTFOLIO_ONLY';
const PORT = Number(process.env.PORT || 8080);

function json(res, status, body) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY'
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 20000) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

function auth(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  return sessions.get(token);
}

function safeError(res, error) {
  const message = error && error.message ? error.message : 'Request failed';
  const status = /Authentication required|Invalid demo credentials/i.test(message) ? 401 : /not found/i.test(message) ? 404 : 400;
  return json(res, status, { error: message });
}

function verifyScryptPassword(password, encoded) {
  if (!encoded || !encoded.startsWith('scrypt$')) return false;
  const [, salt, expectedHex] = encoded.split('$');
  if (!salt || !expectedHex) return false;
  const actual = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  return expected.length === actual.length && crypto.timingSafeEqual(actual, expected);
}

async function customerProfile(session) {
  if (persistence !== 'postgres') {
    return { id: session.customerId, name: 'Demo Customer', email: 'demo@example.invalid', phone: '+2348000000000', bvnStatus: 'SYNTHETIC', mfaEnabled: true };
  }
  const customer = await bank.getCustomer(session.customerId);
  if (!customer) throw new Error('Customer not found');
  return {
    id: customer.id,
    customerNo: customer.customer_no,
    name: `${customer.first_name} ${customer.last_name}`,
    email: customer.email,
    phone: customer.phone,
    status: customer.status,
    bvnStatus: 'SYNTHETIC',
    mfaEnabled: customer.mfa_enabled
  };
}

async function login(body) {
  if (persistence === 'postgres') {
    const user = await bank.getUser(body.username);
    if (!user || user.status !== 'ACTIVE' || user.customer_status !== 'ACTIVE' || !verifyScryptPassword(body.password || '', user.password_hash)) {
      throw new Error('Invalid demo credentials');
    }
    return { customerId: user.customer_id, userId: user.id, role: user.role };
  }
  if (body.username !== DEMO_USER || body.password !== DEMO_PASSWORD) throw new Error('Invalid demo credentials');
  return { customerId: 'CUST-10001', userId: null, role: 'CUSTOMER' };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (req.method === 'OPTIONS') return json(res, 204, {});
    if (url.pathname === '/health') {
      if (persistence === 'postgres') {
        const db = await bank.health();
        return json(res, 200, { status: 'ok', service: 'securebank-banking-sandbox', mode: 'postgres', database: db, timestamp: new Date().toISOString() });
      }
      return json(res, 200, { status: 'ok', service: 'securebank-banking-sandbox', mode: 'memory', timestamp: new Date().toISOString() });
    }

    if (url.pathname === '/api/v1/auth/login' && req.method === 'POST') {
      const body = await readBody(req);
      const identity = await login(body);
      const token = crypto.randomBytes(32).toString('hex');
      sessions.set(token, { ...identity, createdAt: Date.now() });
      return json(res, 200, { token, customer: await customerProfile(identity), requiresMfa: true, otpHint: 'Use the synthetic OTP documented in the demo README.' });
    }

    const session = auth(req);
    if (url.pathname.startsWith('/api/v1/') && !session && url.pathname !== '/api/v1/auth/login') return json(res, 401, { error: 'Authentication required' });

    if (url.pathname === '/api/v1/auth/logout' && req.method === 'POST') {
      const token = (req.headers.authorization || '').replace(/^Bearer\s+/, '');
      sessions.delete(token);
      return json(res, 200, { message: 'Signed out' });
    }
    if (url.pathname === '/api/v1/profile' && req.method === 'GET') return json(res, 200, await customerProfile(session));
    if (url.pathname === '/api/v1/accounts' && req.method === 'GET') return json(res, 200, await bank.getAccounts(session.customerId));

    const balance = url.pathname.match(/^\/api\/v1\/accounts\/([^/]+)\/balance$/);
    if (balance && req.method === 'GET') {
      const account = await bank.getAccount(balance[1], session.customerId);
      return account ? json(res, 200, { accountId: account.id, balance: account.availableBalance, ledgerBalance: account.ledgerBalance, currency: account.currency }) : json(res, 404, { error: 'Account not found' });
    }

    if (url.pathname === '/api/v1/transactions' && req.method === 'GET') return json(res, 200, await bank.getTransactions(session.customerId, url.searchParams.get('accountId')));
    if (url.pathname === '/api/v1/beneficiaries' && req.method === 'GET') return json(res, 200, await bank.getBeneficiaries(session.customerId));
    if (url.pathname === '/api/v1/notifications' && req.method === 'GET') return json(res, 200, [{ id: 'NTF-001', title: 'Security notice', message: `PostgreSQL persistence: ${persistence === 'postgres' ? 'enabled' : 'disabled'}. This is a synthetic banking sandbox.`, read: false, date: new Date().toISOString() }]);

    if (url.pathname === '/api/v1/limits' && req.method === 'GET') {
      const used = persistence === 'postgres' ? await bank.dailyTransferred(session.customerId) : 0;
      return json(res, 200, { currency: 'NGN', dailyTransferLimit: bank.dailyLimit, usedToday: used, remaining: Math.max(0, bank.dailyLimit - used) });
    }

    if (url.pathname === '/api/v1/transfers' && req.method === 'POST') {
      const body = await readBody(req);
      const result = await bank.transfer({ ...body, customerId: session.customerId, userId: session.userId, idempotencyKey: body.idempotencyKey || req.headers['idempotency-key'], correlationId: req.headers['x-correlation-id'] || crypto.randomUUID() });
      return json(res, 200, { ...result, message: result.status === 'REVERSED' ? 'Transfer failed and funds were reversed.' : 'Transfer completed successfully.' });
    }

    if (url.pathname === '/api/v1/transfer/name-enquiry' && req.method === 'POST') {
      const body = await readBody(req);
      if (!/^\d{10}$/.test(String(body.accountNumber || ''))) return json(res, 400, { error: 'Account number must be 10 digits' });
      return json(res, 200, { bankCode: body.bankCode || '044', accountNumber: body.accountNumber, accountName: body.accountNumber === '1000000002' ? 'Alex Morgan Savings' : 'Synthetic Beneficiary', verified: true });
    }

    if (url.pathname === '/api/v1/bill-payments' && req.method === 'POST') {
      const body = await readBody(req);
      const result = persistence === 'postgres'
        ? await bank.billPayment({ ...body, customerId: session.customerId, userId: session.userId })
        : (() => {
            const amount = Number(body.amount);
            const account = bank.getAccount(body.fromAccountId);
            if (!account) throw new Error('Source account not found');
            if (!Number.isFinite(amount) || amount <= 0) throw new Error('Amount must be greater than zero');
            if (amount > account.availableBalance) throw new Error('Insufficient funds');
            account.availableBalance -= amount;
            account.ledgerBalance = account.availableBalance;
            return { status: 'COMPLETED', reference: `BILL${Date.now()}`, amount, service: body.service || 'Utility', message: 'Bill payment completed in sandbox.' };
          })();
      return json(res, 200, result);
    }

    if (url.pathname === '/api/v1/admin/audit' && req.method === 'GET') return json(res, 200, await bank.getAudit(session.customerId));
    if (url.pathname === '/api/v1/admin/summary' && req.method === 'GET') {
      const accounts = await bank.getAccounts(session.customerId);
      const transactions = await bank.getTransactions(session.customerId);
      const audit = await bank.getAudit(session.customerId);
      return json(res, 200, { customers: 1, accounts: accounts.length, transactions: transactions.length, auditEvents: audit.length, environment: persistence === 'postgres' ? 'POSTGRES' : 'SANDBOX' });
    }

    if (url.pathname === '/' || url.pathname === '/index.html') {
      const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      return res.end(html);
    }
    return json(res, 404, { error: 'Route not found' });
  } catch (error) {
    return safeError(res, error);
  }
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`SecureBank running on port ${PORT} with ${persistence} persistence`));
  const shutdown = async () => { server.close(); if (bank.close) await bank.close(); process.exit(0); };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = { server, bank, sessions, DEMO_OTP };
