import { Router } from 'express';
import { prisma } from '../prisma.js';
import { initiateStkPush } from '../lib/mpesa.js';
import { ENV } from '../env.js';
import { sendMail } from '../lib/mailer.js';
import { sendSMS } from '../lib/sms.js';

export const paymentsRouter = Router();

paymentsRouter.post('/mpesa', async (req, res) => {
  const { bookingId, phone, amount } = req.body as { bookingId: string, phone: string, amount: number };
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { service: true } });
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const mpesaRes = await initiateStkPush({ amount, phone, accountRef: `BBA-${booking.id.slice(0, 6)}`, transactionDesc: `Beautify by Angel — ${booking.service?.name ?? 'Service'}` });

  await prisma.payment.upsert({ where: { bookingId }, create: { bookingId, method: 'mpesa', status: 'PENDING', amountKsh: amount, phone }, update: { method: 'mpesa', status: 'PENDING', amountKsh: amount, phone } });

  res.json({ ok: true, mpesa: mpesaRes });
});

paymentsRouter.post('/mpesa/callback', async (req, res) => {
  try {
    const body = req.body;
    const resultCode = body?.Body?.stkCallback?.ResultCode;
    const metadata = body?.Body?.stkCallback?.CallbackMetadata?.Item || [];
    const receipt = metadata.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
    const amount = metadata.find((i: any) => i.Name === 'Amount')?.Value;
    const phone = metadata.find((i: any) => i.Name === 'PhoneNumber')?.Value;

    const payment = await prisma.payment.findFirst({ where: { phone: String(phone), status: 'PENDING', amountKsh: Math.round(Number(amount) || 0) }, orderBy: { createdAt: 'desc' } });
    if (!payment) { res.json({ ResultCode: 0, ResultDesc: 'Received' }); return; }

    const booking = await prisma.booking.findUnique({ where: { id: payment.bookingId }, include: { service: true } });

    if (resultCode === 0) {
      await prisma.payment.update({ where: { bookingId: payment.bookingId }, data: { status: 'SUCCESS', receipt: String(receipt), rawCallback: body } });
      await prisma.booking.update({ where: { id: payment.bookingId }, data: { status: 'CONFIRMED', paidKsh: payment.amountKsh } });

      if (booking) {
        const when = new Date(booking.date).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });
        const html = `<p>Hi ${booking.name},</p><p>Your payment of KSh ${payment.amountKsh.toLocaleString()} was received (M-Pesa receipt ${receipt}).</p><p>Your ${booking.service?.name} on <strong>${when}</strong> is confirmed.</p><p>Beauty Woven in Every Detail.</p>`;
        await sendMail(booking.email, `Payment received — Booking Confirmed`, html);
        await sendMail(ENV.OWNER_EMAIL, `Payment received — ${booking.service?.name}`, `<p>${booking.name} paid KSh ${payment.amountKsh.toLocaleString()} for ${booking.service?.name} (${when}).</p><p>Receipt: ${receipt}</p>`);
        await sendSMS(booking.phone, `Beautify by Angel: Payment received (KSh ${payment.amountKsh}). Booking confirmed. Receipt ${receipt}.`);
      }
    } else {
      await prisma.payment.update({ where: { bookingId: payment.bookingId }, data: { status: 'FAILED', rawCallback: body } });
      if (booking) await sendMail(booking.email, `Payment failed`, `<p>We could not complete your payment. Please try again.</p>`);
    }

    res.json({ ResultCode: 0, ResultDesc: 'Received' });
  } catch (e) {
    console.error(e);
    res.json({ ResultCode: 0, ResultDesc: 'Received' });
  }
});