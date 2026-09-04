const test = require('node:test');
const assert = require('node:assert/strict');
const { createBank } = require('./banking');

test('intra-bank transfer debits source and credits destination', () => {
  const bank = createBank();
  const result = bank.transfer({ fromAccountId: '010000001', toAccountId: '010000002', amount: 50000, channel: 'intra', otp: '123456' });
  assert.equal(result.status, 'COMPLETED');
  assert.equal(result.fee, 0);
  assert.equal(bank.getAccount('010000001').availableBalance, 450000);
  assert.equal(bank.getAccount('010000002').availableBalance, 150000);
});

test('inter-bank transfer applies a transparent fee and records reference', () => {
  const bank = createBank();
  const result = bank.transfer({ fromAccountId: '010000001', toBankCode: '058', toAccountNumber: '1234567890', toAccountName: 'Ada Example', amount: 100000, channel: 'inter', otp: '123456' });
  assert.equal(result.status, 'COMPLETED');
  assert.equal(result.fee, 100);
  assert.match(result.reference, /^SBK\d+$/);
  assert.equal(bank.getAccount('010000001').availableBalance, 399900);
});

test('transfer requires valid OTP', () => {
  const bank = createBank();
  assert.throws(() => bank.transfer({ fromAccountId: '010000001', toAccountId: '010000002', amount: 1000, channel: 'intra', otp: '000000' }), /Invalid OTP/);
});

test('transfer rejects insufficient funds and leaves balance unchanged', () => {
  const bank = createBank();
  assert.throws(() => bank.transfer({ fromAccountId: '010000001', toAccountId: '010000002', amount: 600000, channel: 'intra', otp: '123456' }), /Insufficient funds/);
  assert.equal(bank.getAccount('010000001').availableBalance, 500000);
});

test('daily transfer limit is enforced', () => {
  const bank = createBank();
  assert.throws(() => bank.transfer({ fromAccountId: '010000001', toAccountId: '010000002', amount: 2000001, channel: 'inter', otp: '123456' }), /Daily transfer limit/);
});

test('failed inter-bank transfer can be reversed', () => {
  const bank = createBank();
  const result = bank.transfer({ fromAccountId: '010000001', toBankCode: '058', toAccountNumber: '1234567890', toAccountName: 'Ada Example', amount: 50000, channel: 'inter', otp: '123456', simulateFailure: true });
  assert.equal(result.status, 'REVERSED');
  assert.equal(bank.getAccount('010000001').availableBalance, 500000);
  assert.equal(bank.getTransactions()[0].status, 'REVERSED');
});
