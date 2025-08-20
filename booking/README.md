# Beautify by Angel Booking System

A standalone, Apple-like booking system for Beautify by Angel with M-Pesa (Daraja STK) payments, admin dashboard, and deployment workflows.

## Features

- **Booking Flow**: Service selection, availability-aware date/time picker, customer details, policy agreement, and payment processing
- **M-Pesa Integration**: Safaricom Daraja STK push payments with callback handling
- **Admin Dashboard**: Secure JWT-based login, booking management, availability settings, CSV export
- **Notifications**: Email and optional SMS notifications for bookings and payments
- **Pricing**: Configurable price multiplier (default 2x base prices)
- **Design**: Mobile-first Apple-like UI with Plum and Gold branding
- **Deployment**: Ready for GitHub Pages (client) and Render (server)

## Structure

```
booking/
├── server/          # Node.js/Express/Prisma backend
├── client/          # React/Vite frontend
└── render.yaml      # Render deployment configuration
```

## Quick Start

### Server Setup

1. Navigate to server directory:
   ```bash
   cd booking/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. Initialize database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npm run seed
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

### Client Setup

1. Navigate to client directory:
   ```bash
   cd booking/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### Required Server Variables

- `ADMIN_EMAIL`: Admin login email
- `ADMIN_PASSWORD_HASH`: Bcrypt hash of admin password
- `JWT_SECRET`: Secret for JWT token generation
- `MPESA_CONSUMER_KEY`: Safaricom Daraja consumer key
- `MPESA_CONSUMER_SECRET`: Safaricom Daraja consumer secret
- `MPESA_SHORT_CODE`: M-Pesa shortcode (e.g., 174379 for sandbox)
- `MPESA_PASSKEY`: M-Pesa passkey
- `MPESA_CALLBACK_URL`: Public HTTPS URL for M-Pesa callbacks

### Optional Server Variables

- `CLIENT_URL`: Frontend URL (default: http://localhost:5174)
- `PRICE_MULTIPLIER`: Price multiplier (default: 2)
- `DEPOSIT_PERCENT`: Deposit percentage (default: 0.3)
- `SMTP_*`: Email configuration
- `TWILIO_*`: SMS configuration

### Client Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:4001)

## Deployment

### Server (Render)

1. Create a new Render service using the `booking/render.yaml` blueprint
2. Set environment variables in Render dashboard
3. Deploy automatically triggers on push to main branch

### Client (GitHub Pages)

1. Set `PROD_API_URL` repository secret to your production API URL
2. Push to main branch triggers automatic deployment
3. Enable GitHub Pages from Settings → Pages → Source: Deploy from branch → gh-pages

## API Endpoints

### Public Endpoints
- `GET /services` - Get available services
- `GET /bookings/slots?date=YYYY-MM-DD` - Get available time slots
- `POST /bookings` - Create new booking
- `POST /payments/mpesa` - Initiate M-Pesa payment
- `POST /payments/mpesa/callback` - M-Pesa callback (webhook)

### Admin Endpoints (require JWT token)
- `POST /auth/login` - Admin login
- `GET /bookings` - Get all bookings
- `PUT /bookings/:id/status` - Update booking status
- `GET /bookings/export.csv` - Export bookings as CSV
- `GET /availability/rules` - Get availability rules
- `PUT /availability/rules/:weekday` - Update availability rule

## Default Services

The system comes pre-seeded with sample services:
- Box Braids (Medium) - KSh 5,000 (2x base price of 2,500)
- Makeup — Soft Glam - KSh 4,000 (2x base price of 2,000)
- Gel Manicure - KSh 2,400 (2x base price of 1,200)
- Simple Henna - KSh 1,600 (2x base price of 800)

## Business Hours

Default availability: Monday–Saturday 09:00–18:00 (Sunday closed)
Configurable through admin dashboard.

## Contact Information

- Phone: 0706805891
- Email: cynthiamumo02@gmail.com
- Slogan: "Beauty Woven in Every Detail"