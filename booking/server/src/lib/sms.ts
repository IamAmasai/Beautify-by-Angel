import { ENV } from '../env.js';

let client: any = null;
if (ENV.TWILIO_ACCOUNT_SID && ENV.TWILIO_AUTH_TOKEN) {
  // Note: Twilio not installed to keep dependencies minimal
  // In production, install: npm install twilio
  // client = require('twilio')(ENV.TWILIO_ACCOUNT_SID, ENV.TWILIO_AUTH_TOKEN);
}

export async function sendSMS(to: string, body: string) {
  if (!client || !ENV.TWILIO_FROM_NUMBER) {
    console.log('[SMS] (dev) to:', to, 'body:', body);
    return;
  }
  // await client.messages.create({ from: ENV.TWILIO_FROM_NUMBER, to, body });
}