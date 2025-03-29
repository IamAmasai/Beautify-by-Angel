import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { insertBookingSchema, insertContactMessageSchema, insertBlockedTimeSchema } from "../shared/schema";
import { setupAuth } from "./auth";

// Global error handler helper function
const handleError = (res: Response, message: string, error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  return res.status(500).json({ message, error: errorMessage });
};

// Helper to consistently handle unknown errors
const safeErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : 'Unknown error';
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded assets
  app.use('/assets/uploads', express.static('public/assets/uploads'));
  
  // Set up authentication
  setupAuth(app);

  // Middleware to check if user is authenticated and is an admin
  const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user && req.user.isAdmin) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized. Admin access required.' });
  };

  // Services routes
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error: any) {
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
    } catch (error: any) {
      handleError(res, 'Error fetching service', error);
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
    } catch (error: any) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      handleError(res, 'Error creating booking', error);
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: 'Error fetching available dates', error: errorMessage });
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: 'Error fetching available times', error: errorMessage });
    }
  });

  // Admin booking management routes
  app.get('/api/admin/bookings', isAdmin, async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching bookings', 
        error: safeErrorMessage(error)
      });
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
