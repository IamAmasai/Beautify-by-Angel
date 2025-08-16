import { Router } from 'express';
import { prisma } from '../prisma.js';
import { depositAmount, effectivePrice } from '../utils/pricing.js';
import { sendMail } from '../lib/mailer.js';
import { sendSMS } from '../lib/sms.js';
import { requireAdmin } from '../middleware/auth.js';
import { stringify } from 'csv-stringify/sync';
import { ENV } from '../env.js';

export const bookingsRouter = Router();

async function computeTotals(serviceId: string, paymentOption: 'deposit' | 'full') {
  const svc = await prisma.service.findUniqueOrThrow({ where: { id: serviceId } });
  const total = effectivePrice(svc.basePrice);
  const deposit = depositAmount(total);
  const due = paymentOption === 'deposit' ? deposit : total;
  return { total, deposit, chargeAmount: due };
}

bookingsRouter.get('/slots', async (req, res) => {
  const { date } = req.query as { date: string };
  const target = new Date(`${date}T00:00:00`);
  const weekday = target.getDay();
  const rule = await prisma.availabilityRule.findFirst({ where: { weekday, active: true } });
  if (!rule) return res.json([]);

  const [startH, startM] = rule.startTime.split(':').map(Number);
  const [endH, endM] = rule.endTime.split(':').map(Number);
  const slots: string[] = [];
  const d = new Date(target);
  d.setHours(startH, startM, 0, 0);
  const end = new Date(target);
  end.setHours(endH, endM, 0, 0);

  const offs = await prisma.timeOff.findMany({
    where: { date: { gte: new Date(target), lt: new Date(new Date(target).setDate(target.getDate() + 1)) } }
  });

  while (d < end) {
    const blocked = offs.some((off: any) => {
      const offStart = new Date(off.date);
      if (off.startTime && off.endTime) {
        const [oh, om] = off.startTime.split(':').map(Number);
        const [eh, em] = off.endTime.split(':').map(Number);
        offStart.setHours(oh, om, 0, 0);
        const offEnd = new Date(offStart);
        offEnd.setHours(eh, em, 0, 0);
        return d >= offStart && d < offEnd;
      }
      return true;
    });

    const exists = await prisma.booking.findFirst({ where: { date: d } });
    if (!blocked && !exists) slots.push(d.toISOString());
    d.setHours(d.getHours() + 1);
  }

  res.json(slots);
});

bookingsRouter.post('/', async (req, res) => {
  const { serviceId, dateTimeISO, name, phone, email, notes, paymentOption, policyAgreed } = req.body as any;
  if (!policyAgreed) return res.status(400).json({ error: 'Policy must be accepted' });
  const { total, deposit, chargeAmount } = await computeTotals(serviceId, paymentOption);

  const booking = await prisma.booking.create({
    data: { serviceId, date: new Date(dateTimeISO), name, phone, email, notes, totalKsh: total, depositKsh: deposit, paidKsh: 0, paymentOption, status: 'AWAITING_PAYMENT', policyAgreed: true },
    include: { service: true }
  });

  const prettyService = booking.service.name;
  const when = new Date(booking.date).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });
  const subject = `Beautify by Angel — Booking Initiated (${prettyService})`;
  const html = `
    <p>Hi ${booking.name},</p>
    <p>Thank you for booking <strong>${prettyService}</strong> on <strong>${when}</strong>.</p>
    <p>Total: KSh ${booking.totalKsh.toLocaleString()}<br/>
    Selected payment: ${paymentOption === 'deposit' ? `Deposit (30%): KSh ${booking.depositKsh.toLocaleString()}` : `Full: KSh ${booking.totalKsh.toLocaleString()}`}</p>
    <p>We'll prompt M-Pesa on your phone to complete payment. Your booking will be confirmed after payment.</p>
    <p>Contact: 0706805891 • cynthiamumo02@gmail.com</p>
    <p>Beauty Woven in Every Detail</p>
  `;
  await sendMail(booking.email, subject, html);
  await sendMail(ENV.OWNER_EMAIL, `New booking started — ${prettyService}`, `<p>${booking.name} (${booking.phone}) booked ${prettyService} at ${when}</p><p>Charge now: KSh ${chargeAmount}</p>`);
  await sendSMS(booking.phone, `Beautify by Angel: Booking started for ${prettyService} on ${when}. Complete M-Pesa prompt to confirm.`);

  res.json({ bookingId: booking.id, chargeAmount, total, deposit });
});

bookingsRouter.get('/', requireAdmin, async (_req, res) => {
  const list = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' }, include: { service: true, payment: true } });
  res.json(list);
});

bookingsRouter.put('/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body as { status: 'CONFIRMED' | 'CANCELED' | 'PENDING' | 'AWAITING_PAYMENT' };
  const updated = await prisma.booking.update({ where: { id: req.params.id }, data: { status } });
  res.json(updated);
});

bookingsRouter.get('/export.csv', requireAdmin, async (_req, res) => {
  const rows = await prisma.booking.findMany({ include: { service: true, payment: true } });
  const data = rows.map((r: any) => ({ id: r.id, service: r.service.name, date: r.date.toISOString(), name: r.name, phone: r.phone, email: r.email, totalKsh: r.totalKsh, depositKsh: r.depositKsh, paidKsh: r.paidKsh, paymentOption: r.paymentOption, status: r.status, paymentStatus: r.payment?.status ?? 'N/A' }));
  const csv = stringify(data, { header: true });
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
});