# Backup and Restore

## Production procedure

1. Define recovery points and retention by data classification.
2. Enable managed database backups and point-in-time recovery where supported.
3. Encrypt backups and restrict restore permissions.
4. Monitor backup success and age.
5. Perform scheduled restore tests into an isolated environment.
6. Validate row/document counts, transaction consistency and application smoke tests.
7. Record recovery duration against RTO and data loss against RPO.
8. Review findings and update the DR design.

The repository contains no production backup or customer data.
