import { prisma } from '../src/prisma.js';

async function main() {
  const services = [
    { name: 'Box Braids (Medium)', description: 'Classic medium box braids.', basePrice: 2500, durationMin: 180, category: 'hair' },
    { name: 'Makeup — Soft Glam', description: 'Natural, elegant look.', basePrice: 2000, durationMin: 90, category: 'makeup' },
    { name: 'Gel Manicure', description: 'Classic gel finish.', basePrice: 1200, durationMin: 60, category: 'nails' },
    { name: 'Simple Henna', description: 'Elegant minimal designs.', basePrice: 800, durationMin: 45, category: 'henna' }
  ];

  for (const s of services) {
    await prisma.service.upsert({ where: { name: s.name }, create: s, update: s });
  }

  // Mon–Sat 09:00–18:00; Sunday off
  for (let d = 0; d < 7; d++) {
    await prisma.availabilityRule.upsert({
      where: { weekday: d },
      create: { weekday: d, startTime: d === 0 ? '00:00' : '09:00', endTime: d === 0 ? '00:00' : '18:00', active: d !== 0 },
      update: { startTime: d === 0 ? '00:00' : '09:00', endTime: d === 0 ? '00:00' : '18:00', active: d !== 0 }
    });
  }

  console.log('Seed complete');
}

main().finally(async () => prisma.$disconnect());