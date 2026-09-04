# Acceptance Criteria

- Dashboard loads successfully from the demo server.
- Health endpoint returns HTTP 200 with service status.
- Account endpoint returns only synthetic portfolio accounts.
- Balance endpoint returns correct demo account data and 404 for unknown accounts.
- Transaction endpoint returns history for a known account and 404 for an unknown account.
- No production credentials or real customer information exist in source control.
- CI runs tests, syntax checks, dependency audit, image build and container health smoke test.
- Architecture diagrams cover application, network, data, security and DR.
- Terraform validates without requiring production resource creation.
- PM artifacts cover scope, WBS, roadmap, stakeholders, RAID, risks, communications, change and quality.
