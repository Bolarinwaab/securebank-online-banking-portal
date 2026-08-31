# 6. Storage Characteristics

| Service | Data | SQL/NoSQL | Consistency | Approx. scale | Access |
|---|---|---|---|---|---|
| Accounts | balances/account state | SQL | Strong | GB → TB | Read/Write |
| Transactions | financial transactions | SQL | Strong | TB+ | Read/Write |
| Customer | customer profiles | SQL | Strong | GB → TB | Read/Write |
| Notifications | delivery records | NoSQL/SQL | Eventual for delivery status | GB | Read/Write |
| Analytics | reporting datasets | Analytical | Eventual/batch | TB → PB | Read-heavy |
| Documents | statements/export files | Object | Eventual | GB → TB | Read/Write |

Financial balances and transaction records require strong consistency. Analytical and notification workloads can tolerate eventual consistency where business requirements permit.
