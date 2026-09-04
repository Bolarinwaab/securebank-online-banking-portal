const http = require('http');
const url = require('url');

const accounts = [
  { id: 'CHK-10001', name: 'Everyday Checking', type: 'Checking', balance: 12450.75 },
  { id: 'SAV-20001', name: 'Growth Savings', type: 'Savings', balance: 28750.2 }
];

const transactions = [
  { id: 'TX-104', accountId: 'CHK-10001', date: '2026-08-29', description: 'Salary Credit', type: 'Credit', amount: 5200.0 },
  { id: 'TX-103', accountId: 'CHK-10001', date: '2026-08-28', description: 'Utility Payment', type: 'Debit', amount: -185.45 },
  { id: 'TX-102', accountId: 'CHK-10001', date: '2026-08-27', description: 'Online Transfer', type: 'Debit', amount: -450.0 },
  { id: 'TX-101', accountId: 'CHK-10001', date: '2026-08-25', description: 'Grocery Store', type: 'Debit', amount: -126.8 }
];

function send(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function createServer() {
  return http.createServer((req, res) => {
    const parsed = url.parse(req.url, true);
    if (req.method === 'OPTIONS') return send(res, 204, {});

    if (parsed.pathname === '/health' && req.method === 'GET') {
      return send(res, 200, { status: 'ok', service: 'securebank-api' });
    }

    if (parsed.pathname === '/api/v1/accounts' && req.method === 'GET') {
      return send(res, 200, accounts);
    }

    const balanceMatch = parsed.pathname.match(/^\/api\/v1\/accounts\/([^/]+)\/balance$/);
    if (balanceMatch && req.method === 'GET') {
      const account = accounts.find(a => a.id === balanceMatch[1]);
      return account
        ? send(res, 200, { accountId: account.id, balance: account.balance, currency: 'USD' })
        : send(res, 404, { error: 'Account not found' });
    }

    const transactionMatch = parsed.pathname.match(/^\/api\/v1\/accounts\/([^/]+)\/transactions$/);
    if (transactionMatch && req.method === 'GET') {
      const account = accounts.find(a => a.id === transactionMatch[1]);
      return account
        ? send(res, 200, transactions.filter(t => t.accountId === account.id))
        : send(res, 404, { error: 'Account not found' });
    }

    send(res, 404, { error: 'Route not found' });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 8080);
  createServer().listen(port, () => console.log(`SecureBank demo API running on port ${port}`));
}

module.exports = { createServer, accounts, transactions };
