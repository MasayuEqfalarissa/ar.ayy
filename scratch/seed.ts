import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.transaction.createMany({
    data: [
      { type: 'income', amount: 500000, category: 'Savings', description: 'Monthly joint saving', date: new Date() },
      { type: 'expense', amount: 120000, category: 'Food & Dining', description: 'Sushi date', date: new Date() },
      { type: 'expense', amount: 80000, category: 'Dates & Fun', description: 'Movie tickets', date: new Date() },
    ]
  });

  await prisma.memory.create({
    data: {
      title: 'Our First Date Here',
      description: 'The food was amazing!',
      mediaUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop',
      mediaType: 'image',
      date: new Date(),
    }
  });

  console.log('Seeded database!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
