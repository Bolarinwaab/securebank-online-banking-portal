const test = require('node:test');
const assert = require('node:assert/strict');

const { createPostgresBank } = require('./postgres-repository');

const databaseUrl = process.env.DATABASE_URL;
const postgresAvailable = Boolean(databaseUrl);

test('postgres adapter exposes the banking repository contract', { skip: !postgresAvailable }, async () => {
  const bank = createPostgresBank({ connectionString: databaseUrl });
  assert.equal(typeof bank.getAccounts, 'function');
  assert.equal(typeof bank.getTransactions, 'function');
  assert.equal(typeof bank.transfer, 'function');
  assert.equal(typeof bank.billPayment, 'function');
  await bank.close();
});

test('postgres adapter rejects invalid transfer amounts before database mutation', { skip: !postgresAvailable }, async () => {
  const bank = createPostgresBank({ connectionString: databaseUrl });
  await assert.rejects(
    bank.transfer({
      customerId: '00000000-0000-0000-0000-000000000000',
      fromAccountId: '00000000-0000-0000-0000-000000000000',
      amount: 0,
      channel: 'intra',
      toAccountId: '00000000-0000-0000-0000-000000000000',
      otp: '123456',
      idempotencyKey: 'invalid-test'
    }),
    /Amount must be greater than zero/
  );
  await bank.close();
});
