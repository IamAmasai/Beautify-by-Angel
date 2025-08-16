import { Router } from 'express';
import { prisma } from '../prisma.js';
import { requireAdmin } from '../middleware/auth.js';

export const availabilityRouter = Router();

availabilityRouter.get('/rules', async (_req, res) => {
  const rules = await prisma.availabilityRule.findMany({ orderBy: { weekday: 'asc' } });
  res.json(rules);
});

availabilityRouter.get('/timeoff', requireAdmin, async (_req, res) => {
  const list = await prisma.timeOff.findMany({ orderBy: { date: 'asc' } });
  res.json(list);
});

availabilityRouter.put('/rules/:weekday', requireAdmin, async (req, res) => {
  const weekday = Number(req.params.weekday);
  const { startTime, endTime, active } = req.body;
  const r = await prisma.availabilityRule.upsert({
    where: { weekday },
    update: { startTime, endTime, active },
    create: { weekday, startTime, endTime, active: Boolean(active) }
  });
  res.json(r);
});

availabilityRouter.post('/timeoff', requireAdmin, async (req, res) => {
  const { date, startTime, endTime, reason } = req.body;
  const t = await prisma.timeOff.create({ data: { date: new Date(date), startTime, endTime, reason } });
  res.json(t);
});

availabilityRouter.delete('/timeoff/:id', requireAdmin, async (req, res) => {
  await prisma.timeOff.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});