import axios from 'axios';
import { ENV } from '../env.js';

async function getAccessToken() {
  const url = ENV.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  const res = await axios.get(url, { auth: { username: ENV.MPESA_CONSUMER_KEY, password: ENV.MPESA_CONSUMER_SECRET } });
  return res.data.access_token as string;
}

function timestamp() {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function password(shortCode: string, passkey: string, ts: string) {
  return Buffer.from(`${shortCode}${passkey}${ts}`).toString('base64');
}

export async function initiateStkPush(params: { amount: number; phone: string; accountRef: string; transactionDesc: string; }) {
  const accessToken = await getAccessToken();
  const ts = timestamp();
  const url = ENV.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

  const payload = {
    BusinessShortCode: ENV.MPESA_SHORT_CODE,
    Password: password(ENV.MPESA_SHORT_CODE, ENV.MPESA_PASSKEY, ts),
    Timestamp: ts,
    TransactionType: 'CustomerPayBillOnline',
    Amount: params.amount,
    PartyA: params.phone,
    PartyB: ENV.MPESA_SHORT_CODE,
    PhoneNumber: params.phone,
    CallBackURL: ENV.MPESA_CALLBACK_URL,
    AccountReference: params.accountRef,
    TransactionDesc: params.transactionDesc
  };

  const res = await axios.post(url, payload, { headers: { Authorization: `Bearer ${accessToken}` } });
  return res.data;
}