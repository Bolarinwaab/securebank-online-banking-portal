const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const accounts = [
  { id: 'CHK-10001', name: 'Everyday Checking', type: 'Checking', balance: 12450.75, currency: 'USD' },
  { id: 'SAV-20001', name: 'Growth Savings', type: 'Savings', balance: 28750.20, currency: 'USD' }
];
const transactions = [
  { id: 'TX-104', date: '2026-08-29', description: 'Salary Credit', type: 'Credit', amount: 5200 },
  { id: 'TX-103', date: '2026-08-28', description: 'Utility Payment', type: 'Debit', amount: -185.45 },
  { id: 'TX-102', date: '2026-08-27', description: 'Online Transfer', type: 'Debit', amount: -450 },
  { id: 'TX-101', date: '2026-08-25', description: 'Grocery Store', type: 'Debit', amount: -126.80 }
];

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
  res.end(JSON.stringify(body));
}
function readBody(req) { return new Promise((resolve, reject) => { let raw = ''; req.on('data', c => { raw += c; if (raw.length > 10000) req.destroy(); }); req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error('Invalid JSON')); } }); }); }

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'OPTIONS') return json(res, 204, {});
  if (url.pathname === '/health') return json(res, 200, { status: 'ok', service: 'securebank-demo', demo: true });
  if (url.pathname === '/api/v1/accounts' && req.method === 'GET') return json(res, 200, accounts);
  if (url.pathname === '/api/v1/transactions' && req.method === 'GET') return json(res, 200, transactions);
  if (url.pathname === '/api/v1/profile' && req.method === 'GET') return json(res, 200, { name: 'Alex Morgan', email: 'alex.demo@example.invalid', mfaEnabled: true, demo: true });
  const balance = url.pathname.match(/^\/api\/v1\/accounts\/([^/]+)\/balance$/);
  if (balance && req.method === 'GET') { const a = accounts.find(x => x.id === balance[1]); return a ? json(res, 200, { accountId: a.id, balance: a.balance, currency: a.currency }) : json(res, 404, { error: 'Account not found' }); }
  if (url.pathname === '/api/v1/transfers' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const amount = Number(body.amount);
      const from = accounts.find(a => a.id === body.fromAccountId);
      if (!from || !body.toAccountId || body.toAccountId === body.fromAccountId) return json(res, 400, { error: 'Valid source and destination accounts are required' });
      if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) return json(res, 400, { error: 'Amount must be greater than 0 and no more than 100000' });
      if (amount > from.balance) return json(res, 409, { error: 'Insufficient demo balance' });
      return json(res, 202, { transferId: `DEMO-${Date.now()}`, status: 'SIMULATED', amount, fromAccountId: from.id, toAccountId: body.toAccountId, message: 'Demo transfer accepted; no funds moved.' });
    } catch { return json(res, 400, { error: 'Invalid JSON' }); }
  }
  if (url.pathname === '/' || url.pathname === '/index.html') { const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html')); res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(html); }
  return json(res, 404, { error: 'Route not found' });
});

if (require.main === module) server.listen(process.env.PORT || 8080, () => console.log('SecureBank demo running'));
module.exports = { server, accounts, transactions };
