import { 
  users, type User, type InsertUser,
  services, type Service, type InsertService,
  contactMessages, type ContactMessage, type InsertContactMessage
} from "@shared/schema";
import { services as servicesData } from "../client/src/lib/constants";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Service methods
  getAllServices(): Promise<Service[]>;
  getServiceById(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Contact message methods
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessageById(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;
}

export class MemStorage implements IStorage {
  private currentUserId: number;
  private currentServiceId: number;
  private currentContactMessageId: number;
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private contactMessages: Map<number, ContactMessage>;

  constructor() {
    this.currentUserId = 1;
    this.currentServiceId = 1;
    this.currentContactMessageId = 1;
    this.users = new Map();
    this.services = new Map();
    this.contactMessages = new Map();

    // Initialize with services from constants
    servicesData.forEach((service: any) => {
      const serviceData: Service = {
        id: service.id,
        title: service.title,
        description: service.description,
        image: service.image,
        longDescription: service.longDescription || service.description,
  startingPrice: service.startingPrice || "4,000",
        duration: service.duration || "1-2 hours",
        createdAt: new Date()
      };
      this.services.set(service.id, serviceData);
      this.currentServiceId = Math.max(this.currentServiceId, service.id + 1);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Service methods
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getServiceById(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const now = new Date();
    const service: Service = {
      ...insertService,
      id,
      createdAt: now
    };
    this.services.set(id, service);
    return service;
  }

  // Contact message methods
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getContactMessageById(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const now = new Date();
    const message: ContactMessage = {
      ...insertMessage,
      id,
      read: false,
      createdAt: now
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const message = this.contactMessages.get(id);
    if (!message) return undefined;
    
    const updatedMessage: ContactMessage = { ...message, read: true };
    this.contactMessages.set(id, updatedMessage);
    return updatedMessage;
  }
}

export const storage = new MemStorage();