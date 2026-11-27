-- The seeded settings row ships with empty legal copy, so the Terms & Conditions
-- screen showed "Loading terms..." forever. Fill the row when an admin has not
-- saved their own wording yet. Safe to re-run: it only touches blank values.
UPDATE app_settings
SET terms_conditions = 'By using the SDL (Shubh Dhan Lakshmi) platform, you agree to the following terms and conditions:

1. Loan Eligibility: You must be a salaried individual with a valid UPI ID and completed KYC verification.

2. Loan Amount: Loan amounts are determined based on your salary profile and repayment history, subject to admin approval.

3. Repayment: The full repayment amount (principal + charges) is due on your next salary date. Late payments incur a daily overdue charge.

4. Charges: Interest, portal charge, and processing fee are disclosed upfront before loan disbursement.

5. Savings: A percentage of your loan amount is credited back to your SDL wallet upon timely repayment.

6. Referrals: Referral earnings are credited only after the referred loan is repaid.

7. KYC: Providing accurate personal and identity information is mandatory. False information may result in loan rejection and account suspension.

8. Account Suspension: SDL reserves the right to suspend accounts for fraudulent activity, repeated defaults, or policy violations.'
WHERE terms_conditions IS NULL OR trim(terms_conditions) = '';
