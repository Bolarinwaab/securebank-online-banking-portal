const crypto = require('node:crypto');

const DEMO_OTP = '123456';
const DAILY_LIMIT = 2000000;

function reference() { return `SBK${Date.now()}${crypto.randomInt(100, 999)}`; }
function money(value) { return Math.round(Number(value) * 100) / 100; }

function createBank() {
  const accounts = [
    { id: '010000001', customerId: 'CUST-10001', name: 'Everyday Savings', type: 'Savings', currency: 'NGN', availableBalance: 500000, ledgerBalance: 500000 },
    { id: '010000002', customerId: 'CUST-10001', name: 'Current Account', type: 'Current', currency: 'NGN', availableBalance: 100000, ledgerBalance: 100000 }
  ];
  const beneficiaries = [
    { id: 'BEN-001', name: 'Ada Example', bankCode: '058', bankName: 'GTBank', accountNumber: '1234567890', verified: true }
  ];
  const transactions = [
    { id: 'TXN-10003', reference: 'SBK26090410003', accountId: '010000001', type: 'CREDIT', amount: 350000, description: 'Salary Credit', status: 'COMPLETED', date: '2026-09-01T09:00:00Z' },
    { id: 'TXN-10002', reference: 'SBK26090210002', accountId: '010000001', type: 'DEBIT', amount: 25000, description: 'Utility Payment', status: 'COMPLETED', date: '2026-09-02T13:20:00Z' }
  ];
  const audit = [];
  let dailyTransferred = 0;

  function getAccount(id) { return accounts.find(a => a.id === id); }
  function getTransactions(accountId) { return accountId ? transactions.filter(t => t.accountId === accountId) : [...transactions]; }
  function auditEvent(action, details) { audit.unshift({ id: `AUD-${Date.now()}-${crypto.randomInt(100,999)}`, action, details, timestamp: new Date().toISOString() }); }

  function transfer(input) {
    const amount = money(input.amount);
    if (input.otp !== DEMO_OTP) throw new Error('Invalid OTP');
    if (!Number.isFinite(amount) || amount <= 0) throw new Error('Amount must be greater than zero');
    if (dailyTransferred + amount > DAILY_LIMIT) throw new Error('Daily transfer limit exceeded');
    const source = getAccount(input.fromAccountId);
    if (!source) throw new Error('Source account not found');
    if (source.currency !== 'NGN') throw new Error('Unsupported currency');
    if (amount > source.availableBalance) throw new Error('Insufficient funds');
    if (input.channel === 'intra') {
      const destination = getAccount(input.toAccountId);
      if (!destination || destination.id === source.id) throw new Error('Valid destination account required');
      const ref = reference();
      source.availableBalance = money(source.availableBalance - amount);
      source.ledgerBalance = source.availableBalance;
      destination.availableBalance = money(destination.availableBalance + amount);
      destination.ledgerBalance = destination.availableBalance;
      transactions.unshift({ id: ref, reference: ref, accountId: source.id, type: 'DEBIT', amount, description: input.narration || `Transfer to ${destination.id}`, status: 'COMPLETED', date: new Date().toISOString() });
      transactions.unshift({ id: `${ref}-CR`, reference: ref, accountId: destination.id, type: 'CREDIT', amount, description: input.narration || `Transfer from ${source.id}`, status: 'COMPLETED', date: new Date().toISOString() });
      dailyTransferred += amount;
      auditEvent('TRANSFER_COMPLETED', { reference: ref, channel: 'intra', amount, from: source.id, to: destination.id });
      return { status: 'COMPLETED', reference: ref, amount, fee: 0, currency: 'NGN' };
    }
    if (input.channel !== 'inter') throw new Error('Unsupported transfer channel');
    if (!/^\d{10}$/.test(String(input.toAccountNumber || ''))) throw new Error('Beneficiary account number must be 10 digits');
    if (!input.toBankCode || !input.toAccountName) throw new Error('Beneficiary bank and account name are required');
    const fee = 100;
    if (amount + fee > source.availableBalance) throw new Error('Insufficient funds including transaction fee');
    const ref = reference();
    source.availableBalance = money(source.availableBalance - amount - fee);
    source.ledgerBalance = source.availableBalance;
    dailyTransferred += amount;
    const status = input.simulateFailure ? 'REVERSED' : 'COMPLETED';
    if (input.simulateFailure) {
      source.availableBalance = money(source.availableBalance + amount + fee);
      source.ledgerBalance = source.availableBalance;
      dailyTransferred -= amount;
    }
    transactions.unshift({ id: ref, reference: ref, accountId: source.id, type: 'DEBIT', amount: amount + fee, description: input.narration || `Transfer to ${input.toAccountName}`, status, date: new Date().toISOString(), fee });
    auditEvent(status === 'COMPLETED' ? 'TRANSFER_COMPLETED' : 'TRANSFER_REVERSED', { reference: ref, channel: 'inter', amount, fee, bankCode: input.toBankCode, beneficiary: input.toAccountNumber });
    return { status, reference: ref, amount, fee, currency: 'NGN' };
  }

  return { accounts, beneficiaries, audit, getAccount, getTransactions, transfer, getTransactionsAll: () => [...transactions], getAudit: () => [...audit], dailyLimit: DAILY_LIMIT };
}

module.exports = { createBank, DEMO_OTP, DAILY_LIMIT };
