import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@photoljay.com' },
    update: {},
    create: {
      userName: 'Admin',
      email: 'admin@photoljay.com',
      password: hashedPassword,
      role: Role.ADMIN,
      phoneNumber: '+2250102030405',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('Admin user created:', admin);

  // Create some categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Électronique',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.category.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Vêtements',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.category.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Maison & Jardin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  console.log('Categories created:', categories);

  // Create some sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'user1@example.com' },
      update: {},
      create: {
        userName: 'Jean Dupont',
        email: 'user1@example.com',
        password: await bcrypt.hash('password123', 10),
        role: Role.USER,
        phoneNumber: '+2250607080910',
        whatsappNumber: '+2250607080910',
        shopLink: 'https://shop1.example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: 'user2@example.com' },
      update: {},
      create: {
        userName: 'Marie Martin',
        email: 'user2@example.com',
        password: await bcrypt.hash('password123', 10),
        role: Role.USER,
        phoneNumber: '+2250607080911',
        whatsappNumber: '+2250607080911',
        isVIP: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  console.log('Sample users created:', users);

  // Create some sample products (some approved, some pending)
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: 'Smartphone Samsung Galaxy',
        description: 'Téléphone neuf, excellent état',
        price: 150000,
        userId: users[0].id,
        categoryId: categories[0].id,
        status: 'APPROVED',
        priority: false,
        views: 25,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.product.upsert({
      where: { id: 2 },
      update: {},
      create: {
        title: 'Ordinateur portable HP',
        description: 'Ordinateur portable professionnel',
        price: 300000,
        userId: users[1].id,
        categoryId: categories[0].id,
        status: 'PENDING',
        priority: true,
        views: 10,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.product.upsert({
      where: { id: 3 },
      update: {},
      create: {
        title: 'Robe d\'été',
        description: 'Belle robe d\'été, taille M',
        price: 25000,
        userId: users[0].id,
        categoryId: categories[1].id,
        status: 'APPROVED',
        priority: false,
        views: 15,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.product.upsert({
      where: { id: 4 },
      update: {},
      create: {
        title: 'Table de salon',
        description: 'Table moderne pour salon',
        price: 75000,
        userId: users[1].id,
        categoryId: categories[2].id,
        status: 'PENDING',
        priority: false,
        views: 5,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  console.log('Sample products created:', products);

  // Create some moderation logs
  const logs = await Promise.all([
    prisma.moderationLog.upsert({
      where: { id: 1 },
      update: {},
      create: {
        productId: products[0].id,
        moderatorId: admin.id,
        action: 'APPROVED',
        reason: 'Produit conforme aux règles',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.moderationLog.upsert({
      where: { id: 2 },
      update: {},
      create: {
        productId: products[2].id,
        moderatorId: admin.id,
        action: 'APPROVED',
        reason: 'Produit validé',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log('Moderation logs created:', logs);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
