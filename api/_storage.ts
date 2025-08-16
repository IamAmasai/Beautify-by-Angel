// Minimal in-memory storage to be used by serverless functions (mirrors server/storage.ts minimal needs)
import { services as servicesData, testimonials } from "../client/src/lib/constants";

let contactMessages: any[] = [];
let currentMsgId = 1;

export function getAllServices() {
  return servicesData.map((s:any) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    image: s.image,
    longDescription: s.longDescription ?? null,
    startingPrice: s.startingPrice ?? "4000",
    duration: s.duration ?? "1-2 hours",
    createdAt: new Date().toISOString()
  }));
}

export function getServiceById(id:number) {
  return getAllServices().find(s => s.id === id);
}

export function createContactMessage(data:any) {
  const message = { id: currentMsgId++, ...data, read: false, createdAt: new Date().toISOString() };
  contactMessages.push(message);
  return message;
}

export function getAllContactMessages() { return contactMessages.slice().reverse(); }
export function getContactMessageById(id:number){ return contactMessages.find(m => m.id === id); }
export function markContactMessageAsRead(id:number){
  const m = getContactMessageById(id);
  if(!m) return undefined;
  m.read = true;
  return m;
}
