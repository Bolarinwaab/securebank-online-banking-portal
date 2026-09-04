# Realistic Nigerian Banking Platform

## Objective
Upgrade SecureBank from a static demo into a functional synthetic-data Nigerian digital-banking sandbox informed by publicly documented Access Bank customer journeys, without connecting to Access Bank systems or using confidential data.

## Scope
1. Authentication and demo MFA/OTP.
2. Customer profile, accounts and balances in NGN.
3. Beneficiary creation and account-name validation simulation.
4. Intra-bank and inter-bank transfer workflows with limits, fees, OTP authorization, debit/credit, references and audit events.
5. Bill payments, notifications and transaction history.
6. Operations/admin view for transactions and audit events.
7. Automated Node tests and CI validation.
8. Documentation clearly labels all data and integrations as synthetic/sandbox.

## Implementation sequence
- Write failing domain tests for transfer, fee, limit, OTP and reversal behavior.
- Implement the domain service with deterministic synthetic data.
- Replace the demo API with modular banking routes and session handling.
- Replace the dashboard with a responsive Nigerian banking experience.
- Add seed data, package lock, API documentation and operational notes.
- Update CI to run tests and syntax checks.
- Verify repository files and merge through a pull request.

## Safety boundary
The application must never request, store or process real customer credentials, card PINs, OTPs, account numbers belonging to real customers, or Access Bank internal interfaces. All customer/account data is fictional.
