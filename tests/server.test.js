const test = require('node:test');
const assert = require('node:assert/strict');
const { server } = require('../app/server');

let base;
test.before(async () => { await new Promise(r => server.listen(0, r)); base = `http://127.0.0.1:${server.address().port}`; });
test.after(async () => { await new Promise(r => server.close(r)); });

test('health endpoint is available', async () => { const r = await fetch(`${base}/health`); assert.equal(r.status, 200); assert.equal((await r.json()).status, 'ok'); });
test('accounts endpoint returns synthetic accounts', async () => { const r = await fetch(`${base}/api/v1/accounts`); const data = await r.json(); assert.equal(r.status, 200); assert.equal(data.length, 2); });
test('unknown account returns 404', async () => { const r = await fetch(`${base}/api/v1/accounts/NOPE/balance`); assert.equal(r.status, 404); });
test('invalid transfer is rejected', async () => { const r = await fetch(`${base}/api/v1/transfers`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({fromAccountId:'CHK-10001',toAccountId:'SAV-20001',amount:-5}) }); assert.equal(r.status, 400); });
test('valid transfer is simulated without moving funds', async () => { const r = await fetch(`${base}/api/v1/transfers`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({fromAccountId:'CHK-10001',toAccountId:'SAV-20001',amount:100}) }); const data = await r.json(); assert.equal(r.status, 202); assert.equal(data.status, 'SIMULATED'); });
