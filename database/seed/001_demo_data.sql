-- Synthetic portfolio data. Account numbers and identities are fictional.
-- Demo password is PORTFOLIO_ONLY. This credential is for local sandbox use only.
INSERT INTO customers (customer_no, first_name, last_name, email, phone)
VALUES ('SB000001','Alex','Morgan','alex.morgan@example.invalid','08000000001')
ON CONFLICT (customer_no) DO NOTHING;

INSERT INTO users (customer_id, username, password_hash, role)
SELECT id, 'alex.morgan', 'scrypt$securebank-demo-salt$87372e4227023eb9f2ed84e28897bfc834caeebac067fa2d964998114b655942bbd12cc344a279be81fa99d97149604ebeef9d0a57c80a161d1164dc34a22f63', 'CUSTOMER'
FROM customers WHERE customer_no='SB000001'
ON CONFLICT (username) DO NOTHING;

INSERT INTO accounts (customer_id, account_no, account_type, available_balance, ledger_balance)
SELECT id, '1000000001', 'CURRENT', 1250000.00, 1250000.00 FROM customers WHERE customer_no='SB000001'
ON CONFLICT (account_no) DO NOTHING;
INSERT INTO accounts (customer_id, account_no, account_type, available_balance, ledger_balance)
SELECT id, '1000000002', 'SAVINGS', 2875000.00, 2875000.00 FROM customers WHERE customer_no='SB000001'
ON CONFLICT (account_no) DO NOTHING;

INSERT INTO beneficiaries (customer_id, bank_code, bank_name, account_no, account_name)
SELECT id, '044', 'SecureBank Demo Bank', '1000000002', 'Alex Morgan Savings' FROM customers WHERE customer_no='SB000001'
ON CONFLICT (customer_id, bank_code, account_no) DO NOTHING;
