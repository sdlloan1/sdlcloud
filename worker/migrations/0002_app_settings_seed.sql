-- Default settings row so the app has pricing, UPI and legal copy on first boot.
INSERT INTO app_settings (
  id, created_date, updated_date,
  admin_upi_id, admin_upi_name, referral_percentage, savings_percentage, interest_rate,
  portal_charge_percentage, processing_fee_percentage, partner_profit_percentage,
  partner_overdue_profit_percentage, overdue_daily_rate, kyc_daily_limit,
  lender_name, lender_email, lender_address, shareable_domain,
  loan_email_enabled, closure_email_enabled, reminder_email_enabled, reminder_website_url,
  terms_conditions, agreement_template, agreement_style, privacy_policy, about_us, payment_apps
) VALUES (
  'app-settings', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
  '9310601973@ibl', 'SDL Shubh Dhan Lakshmi', 1, 1, 2,
  8, 9, 10,
  0.5, 1, 3,
  'Subrato Das', 'shubhdhanlakshmifund@gmail.com',
  'Indian Doorstep, Gali no. 7, Block M, Near sector 59 metro station, Mamura, Sector 59, Gautam Buddha Nagar, Noida, Uttar Pradesh - 201301',
  'shubhdhanlakshmi.com',
  1, 1, 1, 'https://shubhdhanlakshmi.in',
  '', '', '', '', '', ''
) ON CONFLICT (id) DO NOTHING;
