import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ─── Admin ────────────────────────────────────────────────────────────────
  const adminEmail = 'admin@pedidosdigital.com';
  const existeAdmin = await prisma.usuario.findUnique({ where: { correo: adminEmail } });

  if (!existeAdmin) {
    await prisma.usuario.create({
      data: {
        correo: adminEmail,
        usuario: 'admin',
        contrasena: await bcrypt.hash('Admin1234!', 10),
        nombre: 'Administrador',
        rol: 'ADMIN',
      },
    });
    console.log('✅ Admin creado → admin@pedidosdigital.com / Admin1234!');
  } else {
    console.log('ℹ️  Admin ya existe');
  }

  // ─── Vendedor de prueba ───────────────────────────────────────────────────
  const vendedorEmail = 'vendedor@pedidosdigital.com';
  const existeVendedor = await prisma.usuario.findUnique({ where: { correo: vendedorEmail } });

  if (!existeVendedor) {
    await prisma.usuario.create({
      data: {
        correo: vendedorEmail,
        usuario: 'vendedor',
        contrasena: await bcrypt.hash('Vendedor1234!', 10),
        nombre: 'Vendedor Demo',
        rol: 'VENDEDOR',
      },
    });
    console.log('✅ Vendedor creado → vendedor@pedidosdigital.com / Vendedor1234!');
  } else {
    console.log('ℹ️  Vendedor demo ya existe');
  }

  // ─── Catálogo de Permutas (iPhones) ─────────────────────────────────────
  const permutasCount = await prisma.celularPermuta.count();
  if (permutasCount === 0) {
    await prisma.celularPermuta.createMany({
      data: [
        { nombre: 'iPhone 11', modelo: 'A2221', bateriaMin: 70, bateriaMax: 79, precioUsd: 80 },
        { nombre: 'iPhone 11', modelo: 'A2221', bateriaMin: 80, bateriaMax: 89, precioUsd: 100 },
        { nombre: 'iPhone 11', modelo: 'A2221', bateriaMin: 90, bateriaMax: 100, precioUsd: 120 },
        { nombre: 'iPhone 12', modelo: 'A2403', bateriaMin: 70, bateriaMax: 79, precioUsd: 120 },
        { nombre: 'iPhone 12', modelo: 'A2403', bateriaMin: 80, bateriaMax: 89, precioUsd: 150 },
        { nombre: 'iPhone 12', modelo: 'A2403', bateriaMin: 90, bateriaMax: 100, precioUsd: 180 },
        { nombre: 'iPhone 13', modelo: 'A2633', bateriaMin: 70, bateriaMax: 79, precioUsd: 180 },
        { nombre: 'iPhone 13', modelo: 'A2633', bateriaMin: 80, bateriaMax: 89, precioUsd: 220 },
        { nombre: 'iPhone 13', modelo: 'A2633', bateriaMin: 90, bateriaMax: 100, precioUsd: 270 },
        { nombre: 'iPhone 14', modelo: 'A2882', bateriaMin: 70, bateriaMax: 79, precioUsd: 280 },
        { nombre: 'iPhone 14', modelo: 'A2882', bateriaMin: 80, bateriaMax: 89, precioUsd: 340 },
        { nombre: 'iPhone 14', modelo: 'A2882', bateriaMin: 90, bateriaMax: 100, precioUsd: 400 },
        { nombre: 'iPhone 15', modelo: 'A3090', bateriaMin: 80, bateriaMax: 89, precioUsd: 450 },
        { nombre: 'iPhone 15', modelo: 'A3090', bateriaMin: 90, bateriaMax: 100, precioUsd: 530 },
      ],
    });
    console.log('✅ Catálogo de permutas creado (14 entradas)');
  } else {
    console.log('ℹ️  Catálogo de permutas ya existe');
  }

  // ─── Planes de Pago ─────────────────────────────────────────────────────
  const planesCount = await prisma.planPago.count();
  if (planesCount === 0) {
    await prisma.planPago.createMany({
      data: [
        { marca: 'VISA', cuotas: 3, interesPct: 10.00, ivaPct: 21.00 },
        { marca: 'VISA', cuotas: 6, interesPct: 20.00, ivaPct: 21.00 },
        { marca: 'VISA', cuotas: 12, interesPct: 35.00, ivaPct: 21.00 },
        { marca: 'MASTERCARD', cuotas: 3, interesPct: 10.00, ivaPct: 21.00 },
        { marca: 'MASTERCARD', cuotas: 6, interesPct: 20.00, ivaPct: 21.00 },
        { marca: 'MASTERCARD', cuotas: 12, interesPct: 35.00, ivaPct: 21.00 },
        { marca: 'AMERICAN_EXPRESS', cuotas: 3, interesPct: 12.00, ivaPct: 21.00 },
        { marca: 'AMERICAN_EXPRESS', cuotas: 6, interesPct: 25.00, ivaPct: 21.00 },
      ],
    });
    console.log('✅ Planes de pago creados (8 planes)');
  } else {
    console.log('ℹ️  Planes de pago ya existen');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
