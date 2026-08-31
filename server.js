const http = require('http');
const url = require('url');

const accounts = [
  { id: 'CHK-10001', name: 'Everyday Checking', type: 'Checking', balance: 12450.75 },
  { id: 'SAV-20001', name: 'Growth Savings', type: 'Savings', balance: 28750.2 }
];

const transactions = [
  { id: 'TX-104', date: '2026-08-29', description: 'Salary Credit', type: 'Credit', amount: 5200.0 },
  { id: 'TX-103', date: '2026-08-28', description: 'Utility Payment', type: 'Debit', amount: -185.45 },
  { id: 'TX-102', date: '2026-08-27', description: 'Online Transfer', type: 'Debit', amount: -450.0 },
  { id: 'TX-101', date: '2026-08-25', description: 'Grocery Store', type: 'Debit', amount: -126.8 }
];

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (req.method === 'OPTIONS') return send(res, 204, {});

  if (parsed.pathname === '/health') return send(res, 200, { status: 'ok', service: 'securebank-api' });
  if (parsed.pathname === '/api/v1/accounts' && req.method === 'GET') return send(res, 200, accounts);
  if (parsed.pathname.match(/^\/api\/v1\/accounts\/[^/]+\/balance$/) && req.method === 'GET') {
    const id = parsed.pathname.split('/')[4];
    const account = accounts.find(a => a.id === id);
    return account ? send(res, 200, { accountId: id, balance: account.balance, currency: 'USD' }) : send(res, 404, { error: 'Account not found' });
  }
  if (parsed.pathname.match(/^\/api\/v1\/accounts\/[^/]+\/transactions$/) && req.method === 'GET') {
    return send(res, 200, transactions);
  }
  send(res, 404, { error: 'Route not found' });
});

server.listen(8080, () => console.log('SecureBank demo API running on http://localhost:8080'));
