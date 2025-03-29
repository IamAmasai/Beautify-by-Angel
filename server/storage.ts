import { 
  users, type User, type InsertUser,
  services, type Service, type InsertService,
  bookings, type Booking, type InsertBooking,
  blockedTimes, type BlockedTime, type InsertBlockedTime,
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
  
  // Booking methods
  getAllBookings(): Promise<any[]>; // Extended booking with service info
  getBookingById(id: number): Promise<any | undefined>; // Extended booking with service info
  getBookingsByDate(date: string): Promise<any[]>; // Extended booking with service info
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Blocked time methods
  getAllBlockedTimes(): Promise<BlockedTime[]>;
  createBlockedTime(blockedTime: InsertBlockedTime): Promise<BlockedTime>;
  deleteBlockedTime(id: number): Promise<boolean>;
  
  // Contact message methods
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessageById(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private bookings: Map<number, Booking>;
  private blockedTimes: Map<number, BlockedTime>;
  private contactMessages: Map<number, ContactMessage>;
  
  private currentUserId: number;
  private currentServiceId: number;
  private currentBookingId: number;
  private currentBlockedTimeId: number;
  private currentContactMessageId: number;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.bookings = new Map();
    this.blockedTimes = new Map();
    this.contactMessages = new Map();
    
    this.currentUserId = 1;
    this.currentServiceId = 1;
    this.currentBookingId = 1;
    this.currentBlockedTimeId = 1;
    this.currentContactMessageId = 1;
    
    // Initialize with admin user
    this.createUser({
      username: "angel",
      password: "beautify123", // In a real app, this would be hashed
      isAdmin: true,
      name: "Angel Mwende",
      email: "angel@beautifybyangel.com"
    });
    
    // Initialize with services from constants
    servicesData.forEach(service => {
      this.createService({
        title: service.title,
        description: service.description,
        image: service.image,
        longDescription: service.longDescription || "",
        startingPrice: service.startingPrice || "2,000",
        duration: service.duration || "1-2 hours"
      });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    
    // Ensure isAdmin is a boolean
    const isAdmin = insertUser.isAdmin === undefined ? false : insertUser.isAdmin;
    // Ensure email is a string or null
    const email = insertUser.email === undefined ? null : insertUser.email;
    
    const user: User = { 
      ...insertUser,
      isAdmin,
      email, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
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
    // Ensure longDescription is a string or null
    const longDescription = insertService.longDescription === undefined ? null : insertService.longDescription;
    
    const service: Service = { 
      ...insertService,
      longDescription, 
      id,
      createdAt: now
    };
    this.services.set(id, service);
    return service;
  }
  
  // Booking methods
  async getAllBookings(): Promise<any[]> {
    return Array.from(this.bookings.values()).map(booking => {
      const service = this.services.get(booking.serviceId);
      return {
        ...booking,
        serviceName: service ? service.title : 'Unknown Service'
      };
    });
  }

  async getBookingById(id: number): Promise<any | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const service = this.services.get(booking.serviceId);
    return {
      ...booking,
      serviceName: service ? service.title : 'Unknown Service',
      clientName: booking.name
    };
  }

  async getBookingsByDate(date: string): Promise<any[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.date.toString() === date)
      .map(booking => {
        const service = this.services.get(booking.serviceId);
        return {
          ...booking,
          serviceName: service ? service.title : 'Unknown Service',
          clientName: booking.name
        };
      });
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const now = new Date();
    // Ensure notes is a string or null
    const notes = insertBooking.notes === undefined ? null : insertBooking.notes;
    
    const booking: Booking = { 
      ...insertBooking,
      notes, 
      id,
      status: 'pending',
      createdAt: now
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking: Booking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
  
  // Blocked time methods
  async getAllBlockedTimes(): Promise<BlockedTime[]> {
    return Array.from(this.blockedTimes.values());
  }

  async createBlockedTime(insertBlockedTime: InsertBlockedTime): Promise<BlockedTime> {
    const id = this.currentBlockedTimeId++;
    const now = new Date();
    const blockedTime: BlockedTime = { 
      ...insertBlockedTime, 
      id,
      createdAt: now
    };
    this.blockedTimes.set(id, blockedTime);
    return blockedTime;
  }

  async deleteBlockedTime(id: number): Promise<boolean> {
    if (!this.blockedTimes.has(id)) return false;
    return this.blockedTimes.delete(id);
  }
  
  // Contact message methods
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
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
