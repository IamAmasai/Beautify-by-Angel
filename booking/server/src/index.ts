import express from 'express';
import cors from 'cors';
import { ENV } from './env.js';
import { servicesRouter } from './routes/services.js';
import { availabilityRouter } from './routes/availability.js';
import { bookingsRouter } from './routes/bookings.js';
import { paymentsRouter } from './routes/payments.js';
import { authRouter } from './routes/auth.js';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRouter);
app.use('/services', servicesRouter);
app.use('/availability', availabilityRouter);
app.use('/bookings', bookingsRouter);
app.use('/payments', paymentsRouter);

app.listen(ENV.PORT, () => { console.log(`Booking server running on :${ENV.PORT}`); });