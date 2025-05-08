// scripts/test-connection.ts
import { db } from '@/lib/db';

async function testConnection() {
  try {
    await db.$queryRaw`SELECT 1`;
    console.log("✅ Conexión a la base de datos exitosa");
  } catch (error) {
    console.error("❌ Error de conexión a la base de datos:");
    console.error(error);
  } finally {
    await db.$disconnect();
  }
}

testConnection();