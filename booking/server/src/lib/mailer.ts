import nodemailer from 'nodemailer';
import { ENV } from '../env.js';

let transporter: nodemailer.Transporter | null = null;

if (ENV.SMTP_HOST && ENV.SMTP_PORT && ENV.SMTP_USER && ENV.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_PORT === 465,
    auth: { user: ENV.SMTP_USER, pass: ENV.SMTP_PASS }
  });
}

export async function sendMail(to: string, subject: string, html: string) {
  if (!transporter) {
    console.log('[MAIL] (dev) to:', to, 'subject:', subject);
    return;
  }
  await transporter.sendMail({ from: ENV.EMAIL_FROM, to, subject, html });
}