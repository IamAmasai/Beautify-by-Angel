import { Router } from 'express';
import { prisma } from '../prisma.js';
import { effectivePrice } from '../utils/pricing.js';
import { requireAdmin } from '../middleware/auth.js';

export const servicesRouter = Router();

servicesRouter.get('/', async (_req, res) => {
  const services = await prisma.service.findMany({ where: { active: true } });
  res.json(services.map((s: any) => ({ ...s, effectivePrice: effectivePrice(s.basePrice) })));
});

servicesRouter.post('/', requireAdmin, async (req, res) => {
  const { name, description, basePrice, durationMin, category } = req.body;
  const svc = await prisma.service.create({ data: { name, description, basePrice, durationMin, category, active: true } });
  res.json(svc);
});

servicesRouter.put('/:id', requireAdmin, async (req, res) => {
  const id = req.params.id;
  const { name, description, basePrice, durationMin, category, active } = req.body;
  const svc = await prisma.service.update({ where: { id }, data: { name, description, basePrice, durationMin, category, active } });
  res.json(svc);
});