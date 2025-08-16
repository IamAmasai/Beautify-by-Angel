import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../env.js';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body as { email: string, password: string };
  if (email !== ENV.ADMIN_EMAIL) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, ENV.ADMIN_PASSWORD_HASH);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: ENV.ADMIN_EMAIL, role: 'admin' }, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN } as any);
  res.json({ token });
});