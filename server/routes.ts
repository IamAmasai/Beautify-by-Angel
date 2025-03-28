import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { insertBookingSchema, insertContactMessageSchema, insertBlockedTimeSchema } from "../shared/schema";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded assets
  app.use('/assets/uploads', express.static('public/assets/uploads'));
  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'beautify-by-angel-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  }));

  // Configure Passport.js for authentication
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      if (user.password !== password) { // In a real app, use proper password hashing
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Middleware to check if user is authenticated and is an admin
  const isAdmin = (req: any, res: any, next: any) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
  };

  // API Routes
  
  // Authentication routes
  app.post('/api/admin/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Login successful', user: req.user });
  });

  app.post('/api/admin/logout', (req: any, res) => {
    req.logout(() => {
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/admin/check-auth', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ authenticated: true, user: req.user });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Services routes
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching services', error: error.message });
    }
  });

  app.get('/api/services/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.getServiceById(id);
      
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching service', error: error.message });
    }
  });

  // Bookings routes
  app.post('/api/bookings', async (req, res) => {
    try {
      const data = insertBookingSchema.parse({
        ...req.body,
        serviceId: parseInt(req.body.service)
      });
      
      const booking = await storage.createBooking(data);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
  });

  app.get('/api/bookings/available-dates', async (req, res) => {
    try {
      // In a real implementation, this would fetch actual available dates
      // For now, return the next 14 days as available
      const availableDates = [];
      const today = new Date();
      
      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Skip Sundays and Mondays (days off)
        if (date.getDay() !== 0 && date.getDay() !== 1) {
          availableDates.push(date.toISOString().split('T')[0]);
        }
      }
      
      res.json(availableDates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching available dates', error: error.message });
    }
  });

  app.get('/api/bookings/available-times', async (req, res) => {
    try {
      // In a real implementation, this would fetch times that are not booked for a specific date
      // For now, return fixed time slots
      const availableTimes = [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
      ];
      
      res.json(availableTimes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching available times', error: error.message });
    }
  });

  // Admin booking management routes
  app.get('/api/admin/bookings', isAdmin, async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
  });

  app.get('/api/admin/bookings/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBookingById(id);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching booking', error: error.message });
    }
  });

  app.get('/api/admin/bookings/date/:date', isAdmin, async (req, res) => {
    try {
      const date = req.params.date;
      const bookings = await storage.getBookingsByDate(date);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching bookings for date', error: error.message });
    }
  });

  app.post('/api/admin/bookings/:id/approve', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.updateBookingStatus(id, 'approved');
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Error approving booking', error: error.message });
    }
  });

  app.post('/api/admin/bookings/:id/cancel', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.updateBookingStatus(id, 'cancelled');
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Error cancelling booking', error: error.message });
    }
  });

  // Availability management routes
  app.get('/api/admin/blocked-times', isAdmin, async (req, res) => {
    try {
      const blockedTimes = await storage.getAllBlockedTimes();
      res.json(blockedTimes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching blocked times', error: error.message });
    }
  });

  app.post('/api/admin/block-time', isAdmin, async (req, res) => {
    try {
      const data = insertBlockedTimeSchema.parse(req.body);
      const blockedTime = await storage.createBlockedTime(data);
      res.status(201).json(blockedTime);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Error blocking time', error: error.message });
    }
  });

  app.delete('/api/admin/blocked-times/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBlockedTime(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Blocked time not found' });
      }
      
      res.json({ message: 'Time unblocked successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error unblocking time', error: error.message });
    }
  });

  // Contact form route
  app.post('/api/contact', async (req, res) => {
    try {
      const data = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(data);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Error submitting contact form', error: error.message });
    }
  });

  // Admin contact messages routes
  app.get('/api/admin/contact-messages', isAdmin, async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching contact messages', error: error.message });
    }
  });

  app.get('/api/admin/contact-messages/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.getContactMessageById(id);
      
      if (!message) {
        return res.status(404).json({ message: 'Contact message not found' });
      }
      
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching contact message', error: error.message });
    }
  });

  app.post('/api/admin/contact-messages/:id/mark-read', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.markContactMessageAsRead(id);
      
      if (!message) {
        return res.status(404).json({ message: 'Contact message not found' });
      }
      
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: 'Error marking message as read', error: error.message });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
