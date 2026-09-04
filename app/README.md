# SecureBank Demo Application

Synthetic-data demonstration of a digital banking portal.

## Run

```bash
npm test
npm start
```

The service listens on port 8080 by default and exposes `/health`, `/api/v1/accounts`, `/api/v1/transactions`, `/api/v1/profile` and `POST /api/v1/transfers`.

Transfers are validation/simulation workflows only. No funds are moved and no external banking systems are contacted.
