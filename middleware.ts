import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/uploadthing',
])

const isWebhookRoute = createRouteMatcher([
  '/api/webhooks(.*)' // Asegúrate de que coincida con la ruta de tu webhook
])

export default clerkMiddleware(async (auth, req) => {
  if (isWebhookRoute(req)) {
    // No proteger el webhook
    return
  }

  if (!isPublicRoute(req)) {
    await auth.protect() // Solo proteger rutas privadas
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}