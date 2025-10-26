import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/prisma';

export async function GET() {
  try {
    // Teste básico de conexão
    await prisma.$connect();
    
    // Teste de query simples
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      userCount,
      databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Not configured'
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Not configured'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
