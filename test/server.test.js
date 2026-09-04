const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../server');

let server;
let baseUrl;

test.before(async () => {
  server = createServer();
  await new Promise(resolve => server.listen(0, resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
});

test('health endpoint reports service health', async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok', service: 'securebank-api' });
});

test('accounts endpoint returns demo accounts', async () => {
  const response = await fetch(`${baseUrl}/api/v1/accounts`);
  assert.equal(response.status, 200);
  const accounts = await response.json();
  assert.equal(accounts.length, 2);
  assert.equal(accounts[0].id, 'CHK-10001');
});

test('balance endpoint returns account balance', async () => {
  const response = await fetch(`${baseUrl}/api/v1/accounts/CHK-10001/balance`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { accountId: 'CHK-10001', balance: 12450.75, currency: 'USD' });
});

test('unknown account returns 404', async () => {
  const response = await fetch(`${baseUrl}/api/v1/accounts/UNKNOWN/balance`);
  assert.equal(response.status, 404);
});

test('transactions endpoint returns transaction history', async () => {
  const response = await fetch(`${baseUrl}/api/v1/accounts/CHK-10001/transactions`);
  assert.equal(response.status, 200);
  const transactions = await response.json();
  assert.equal(transactions.length, 4);
  assert.equal(transactions[0].type, 'Credit');
});
