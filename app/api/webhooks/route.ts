import { Webhook } from 'svix';
import { headers } from 'next/headers'; // ¡Ahora es asíncrona!
import { type WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Asegúrate de que la ruta sea correcta

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Webhook secret no configurado' },
      { status: 500 }
    );
  }

  // Obtener headers (¡CON AWAIT!)
  const headerPayload = await headers(); // 👈 Cambio clave
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: 'Headers de Svix faltantes' },
      { status: 400 }
    );
  }

  // Resto del código permanece igual...
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verificando webhook:', err);
    return NextResponse.json(
      { error: 'Firma inválida' },
      { status: 400 }
    );
  }

  const envenType = evt.type;

  if (envenType === 'user.created') {
    await db.user.create({
      data: {
        externalUserId: payload.data.id,
        username: payload.data.username,
        imageUrl: payload.data.image_url,
      },
    });
  }
  

  console.log(`🔔 Webhook recibido (Tipo: ${evt.type})`);
  return NextResponse.json({ received: true }, { status: 200 });
}