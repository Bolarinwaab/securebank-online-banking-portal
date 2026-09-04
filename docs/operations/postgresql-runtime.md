# PostgreSQL Runtime

SecureBank now supports a real PostgreSQL-backed runtime in addition to the original in-memory model.

## Modes

- `PERSISTENCE=memory` keeps the original synthetic in-memory implementation for fast demos.
- `PERSISTENCE=postgres` uses `app/src/postgres-repository.js` and PostgreSQL for persistent state.

## Local startup

```bash
docker compose up --build
```

The compose stack starts PostgreSQL, applies the schema and synthetic seed, then starts the API against PostgreSQL.

- API: `http://localhost:8080`
- Health: `http://localhost:8080/health`
- PostgreSQL: `localhost:5432`

## Demo login

The seed contains a fictional user `alex.morgan` with the synthetic password `PORTFOLIO_ONLY`. This credential is for the local portfolio sandbox only and must not be reused in production.

## Persistence controls

Transfers use a single PostgreSQL transaction. Source and destination accounts are locked with `SELECT ... FOR UPDATE`, balances and ledger entries are committed together, and failures roll back the complete transaction.

The transfer API also requires an idempotency key. The request hash is persisted so a retry can safely return the previously committed response rather than creating another financial movement.

## Production hardening still required

This implementation is a production-architecture portfolio runtime, not a live banking platform. A real deployment would still require managed secrets, enterprise identity/MFA, HSM-backed signing, payment-rail integration, KYC/AML controls, fraud monitoring, regulatory approval, penetration testing, operational segregation of duties, and formal reconciliation processes.
