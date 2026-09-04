const test = require('node:test');
const assert = require('node:assert/strict');
const { server, bank } = require('../app/server');

let base;
let token;
let accounts;

test.before(async () => {
  await new Promise(r => server.listen(0, r));
  base = `http://127.0.0.1:${server.address().port}`;
  const login = await fetch(`${base}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: 'alex.morgan', password: 'PORTFOLIO_ONLY' })
  });
  assert.equal(login.status, 200);
  token = (await login.json()).token;
  accounts = bank.accounts;
});

test.after(async () => { await new Promise(r => server.close(r)); });

function authHeaders(extra = {}) {
  return { authorization: `Bearer ${token}`, ...extra };
}

test('health endpoint is available', async () => {
  const r = await fetch(`${base}/health`);
  assert.equal(r.status, 200);
  assert.equal((await r.json()).status, 'ok');
});

test('accounts endpoint returns synthetic accounts', async () => {
  const r = await fetch(`${base}/api/v1/accounts`, { headers: authHeaders() });
  const data = await r.json();
  assert.equal(r.status, 200);
  assert.equal(data.length, 2);
});

test('unknown account returns 404', async () => {
  const r = await fetch(`${base}/api/v1/accounts/NOPE/balance`, { headers: authHeaders() });
  assert.equal(r.status, 404);
});

test('invalid transfer is rejected', async () => {
  const r = await fetch(`${base}/api/v1/transfers`, {
    method: 'POST',
    headers: authHeaders({ 'content-type': 'application/json' }),
    body: JSON.stringify({ fromAccountId: accounts[0].id, toAccountId: accounts[1].id, amount: -5, channel: 'intra', otp: '123456', idempotencyKey: 'server-invalid' })
  });
  assert.equal(r.status, 400);
});

test('valid transfer requires idempotency and moves funds in memory mode', async () => {
  const sourceBefore = bank.getAccount(accounts[0].id).availableBalance;
  const destinationBefore = bank.getAccount(accounts[1].id).availableBalance;
  const r = await fetch(`${base}/api/v1/transfers`, {
    method: 'POST',
    headers: authHeaders({ 'content-type': 'application/json', 'idempotency-key': 'server-valid-1' }),
    body: JSON.stringify({ fromAccountId: accounts[0].id, toAccountId: accounts[1].id, amount: 100, channel: 'intra', otp: '123456', idempotencyKey: 'server-valid-1' })
  });
  const data = await r.json();
  assert.equal(r.status, 200);
  assert.equal(data.status, 'COMPLETED');
  assert.equal(bank.getAccount(accounts[0].id).availableBalance, sourceBefore - 100);
  assert.equal(bank.getAccount(accounts[1].id).availableBalance, destinationBefore + 100);
});
