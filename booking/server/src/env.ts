import 'dotenv/config';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var ${name}`);
  return v;
}

export const ENV = {
  PORT: Number(process.env.PORT || 4001),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5174',

  // Pricing
  PRICE_MULTIPLIER: Number(process.env.PRICE_MULTIPLIER || 2),
  DEPOSIT_PERCENT: Number(process.env.DEPOSIT_PERCENT || 0.3),

  // Auth
  ADMIN_EMAIL: required('ADMIN_EMAIL'),
  ADMIN_PASSWORD_HASH: required('ADMIN_PASSWORD_HASH'),
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Email (Nodemailer SMTP)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM || 'no-reply@beautifybyangel.com',
  OWNER_EMAIL: process.env.OWNER_EMAIL || 'cynthiamumo02@gmail.com',

  // SMS (Twilio optional)
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUMBER: process.env.TWILIO_FROM_NUMBER,

  // M-Pesa (Daraja)
  MPESA_ENV: process.env.MPESA_ENV || 'sandbox', // 'sandbox' or 'production'
  MPESA_CONSUMER_KEY: required('MPESA_CONSUMER_KEY'),
  MPESA_CONSUMER_SECRET: required('MPESA_CONSUMER_SECRET'),
  MPESA_SHORT_CODE: required('MPESA_SHORT_CODE'),
  MPESA_PASSKEY: required('MPESA_PASSKEY'),
  MPESA_CALLBACK_URL: required('MPESA_CALLBACK_URL') // public https URL
};