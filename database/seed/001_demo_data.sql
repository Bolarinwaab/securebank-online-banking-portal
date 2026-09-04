-- Synthetic portfolio data. Account numbers and identities are fictional.
INSERT INTO customers (customer_no, first_name, last_name, email, phone)
VALUES ('SB000001','Alex','Morgan','alex.morgan@example.invalid','08000000001');

INSERT INTO users (customer_id, username, password_hash, role)
SELECT id, 'alex.morgan', '$2b$12$PORTFOLIO_ONLY_REPLACE_WITH_REAL_HASH', 'CUSTOMER'
FROM customers WHERE customer_no='SB000001';

INSERT INTO accounts (customer_id, account_no, account_type, available_balance, ledger_balance)
SELECT id, '1000000001', 'CURRENT', 1250000.00, 1250000.00 FROM customers WHERE customer_no='SB000001';
INSERT INTO accounts (customer_id, account_no, account_type, available_balance, ledger_balance)
SELECT id, '1000000002', 'SAVINGS', 2875000.00, 2875000.00 FROM customers WHERE customer_no='SB000001';

INSERT INTO beneficiaries (customer_id, bank_code, bank_name, account_no, account_name)
SELECT id, '044', 'SecureBank Demo Bank', '1000000002', 'Alex Morgan Savings' FROM customers WHERE customer_no='SB000001';
