import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { insertContactMessageSchema } from "../shared/schema";
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
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };

  // Services routes
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error: any) {
      handleError(res, 'Error fetching services', error);
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

  app.patch('/api/admin/contact-messages/:id/read', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.markContactMessageAsRead(id);
      
      if (!message) {
        return res.status(404).json({ message: 'Contact message not found' });
      }
      
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: 'Error updating contact message', error: error.message });
    }
  });

  const server = createServer(app);
  return server;
}