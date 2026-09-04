# SecureBank — Nigerian Digital Banking Sandbox

This is a functional portfolio sandbox, not a live bank. It uses synthetic customers, synthetic account numbers and simulated banking rails.

## Run

```bash
npm test
npm run check
npm start
```

Open `http://localhost:8080`.

## Demo sign-in

- Username: `amina.demo`
- Password: `PORTFOLIO_ONLY` (or set `SECUREBANK_DEMO_PASSWORD` to a different local value)
- Transfer authorization code: `123456`

These values are intentionally non-production and must never be reused for real banking.

## Implemented workflows

- Session-based demo authentication
- Customer profile and MFA status
- NGN savings/current accounts
- Available and ledger balances
- Transaction history
- Beneficiary/name-enquiry simulation
- Intra-bank transfer: debit + credit + reference + audit event
- Inter-bank transfer: validation + fee + reference + audit event
- Transfer daily limit and insufficient-funds controls
- Failure/reversal simulation
- Bill-payment simulation
- Notifications and operational summary endpoints
- Responsive customer dashboard

## API

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/auth/login` | Start demo session |
| POST | `/api/v1/auth/logout` | End session |
| GET | `/api/v1/profile` | Customer profile |
| GET | `/api/v1/accounts` | Accounts and balances |
| GET | `/api/v1/transactions` | Transaction history |
| GET | `/api/v1/beneficiaries` | Saved beneficiaries |
| POST | `/api/v1/transfer/name-enquiry` | Synthetic beneficiary verification |
| POST | `/api/v1/transfers` | Execute simulated transfer |
| POST | `/api/v1/bill-payments` | Execute simulated bill payment |
| GET | `/api/v1/limits` | Daily transfer limits |
| GET | `/api/v1/notifications` | Customer notifications |
| GET | `/api/v1/admin/summary` | Operations summary |
| GET | `/api/v1/admin/audit` | Audit events |

## Banking reference

The customer journey is informed by publicly documented Access Bank online-banking capabilities such as account views, transaction history, beneficiaries, statements, transfers, scheduled payments, bill payments and token-based authorization. This repository is independently implemented and is not an Access Bank product.
