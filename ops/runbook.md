# Operations Runbook

## Health check

```bash
curl -fsS http://localhost:8080/health
```

Expected: HTTP 200 and `status=ok`.

## Local startup

```bash
npm install
npm test
npm start
```

## First-response checklist

1. Confirm incident scope and customer impact.
2. Check health, error rate, latency and recent deployment.
3. Inspect application logs and trace correlation.
4. Validate dependencies and data-service health.
5. Roll back the latest release if it is the verified cause.
6. Escalate to the service owner/security lead when impact warrants it.
7. Record timeline, evidence and recovery actions.

Never use production credentials in local troubleshooting or commit logs containing sensitive information.
