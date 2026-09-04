# Financial Transaction Consistency Pattern

A production banking platform must treat a transfer as a financial transaction, not a simple HTTP update.

## Atomic internal transfer

1. Authenticate the customer.
2. Authorize ownership of the source account.
3. Validate beneficiary and transaction limits.
4. Read the idempotency key and request hash.
5. Start a database transaction.
6. Lock source and destination account rows in deterministic order.
7. Re-check available balance under the lock.
8. Create the transfer record with a unique reference.
9. Write a debit ledger entry.
10. Write a credit ledger entry.
11. Update both account balances and increment their versions.
12. Persist the audit event.
13. Store the idempotent response.
14. Commit.
15. Publish a post-commit `TransferCommitted` event for notifications/analytics.

If any step before commit fails, the database transaction rolls back. No partial debit is allowed.

## External transfer

For an inter-bank transaction, the internal ledger should not assume the external rail succeeded merely because the HTTP request returned. The payment adapter should use a durable transaction state machine:

`AUTHORIZED → PROCESSING → COMPLETED`

or

`AUTHORIZED → PROCESSING → FAILED → REVERSED`

Timeouts are not automatically treated as success or failure. A reconciliation process queries the external rail and resolves the final state using the transaction reference.

## Idempotency

The client sends `Idempotency-Key`. The server hashes the canonical request. Reusing the same key with the same request returns the original result. Reusing it with a different request is rejected. This protects against browser retries, mobile-network retries and load-balancer retries.

## Observability

Every transfer carries:

- correlation ID
- customer ID
- transfer reference
- idempotency key hash
- source account identifier (masked in logs)
- outcome
- latency
- downstream adapter status

Never log passwords, OTP values, full authentication tokens, card PAN/CVV or other sensitive secrets.
