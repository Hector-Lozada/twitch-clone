import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { type WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Webhook secret no configurado' },
      { status: 500 }
    );
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: 'Headers de Svix faltantes' },
      { status: 400 }
    );
  }

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

  const eventType = evt.type;

  try {
    if (eventType === 'user.created') {
      // Verificar si el usuario ya existe
      const existingUser = await db.user.findUnique({
        where: {
          externalUserId: payload.data.id
        }
      });
    
      if (existingUser) {
        return NextResponse.json(
          { error: 'El usuario ya existe' },
          { status: 409 }
        );
      }
    
      // Si no existe, crearlo
      await db.user.create({
        data: {
          externalUserId: payload.data.id,
          username: payload.data.username || `user_${payload.data.id}`, // Valor por defecto si username es null
          imageUrl: payload.data.image_url,
          stream: {
            create: {
              name: `${payload.data.username || 'Nuevo stream'}'s stream`
            }
          }
        },
      });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (eventType === 'user.updated') {
      const currentUser = await db.user.findUnique({
        where: { 
          externalUserId: payload.data.id 
        },
      });

      if (!currentUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      await db.user.update({
        where: { externalUserId: payload.data.id },
        data: {
          username: payload.data.username,
          imageUrl: payload.data.image_url,
        },
      });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (eventType === 'user.deleted') {
      await db.user.delete({
        where: { 
          externalUserId: payload.data.id 
        },
      });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Si llega aquí y no ha manejado el tipo de evento
    return NextResponse.json(
      { error: 'Tipo de evento no manejado' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error procesando webhook:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}