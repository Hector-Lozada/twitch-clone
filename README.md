<p align="center">
  <img src="[https://nextjs.org/static/favicon/favicon-32x32.png](https://www.svgrepo.com/show/354113/nextjs-icon.svg)" height="48" alt="Next.js Logo" />
</p>

<h1 align="center">Twitch Clone – Next.js 15, LiveKit, UploadThing, Prisma & MySQL</h1>
<p align="center">
  <i>Minimal, professional, and elegant streaming platform starter.</i>
</p>

---

A modern Twitch-like streaming application built with the latest [Next.js 15](https://nextjs.org/), [LiveKit](https://livekit.io/), [UploadThing](https://uploadthing.com/), [Prisma](https://www.prisma.io/), and MySQL. This project provides a robust, scalable foundation for real-time video streaming and chat.

---

## Features

- ⚡ **Live Streaming** with LiveKit
- 📦 **Media Uploads** via UploadThing
- 💾 **Database ORM** with Prisma & MySQL
- 🎨 **Next.js 15 App Router** and [Geist font](https://vercel.com/font)
- 🔒 User authentication and basic channel management
- 🚀 Ready for deployment on [Vercel](https://vercel.com/)

---

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   # or
   bun install
   ```

2. **Configure environment**

   - Copy `.env.example` to `.env.local` and fill in your credentials for MySQL, LiveKit, and UploadThing.

3. **Set up the database**

   ```bash
   npx prisma migrate dev
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
app/            Next.js app directory (pages, layouts, components)
prisma/         Prisma schema and migrations
lib/            Utilities and helpers (LiveKit, UploadThing, etc.)
public/         Static files
styles/         CSS and styling
```

---

## Customization

- **Streaming & Chat:** Powered by LiveKit. See `lib/livekit.ts` and related components.
- **Uploads:** Configured using UploadThing. See `lib/uploadthing.ts`.
- **Database Models:** Edit `prisma/schema.prisma` to modify channels, users, streams, etc.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [LiveKit Docs](https://docs.livekit.io/)
- [UploadThing Docs](https://docs.uploadthing.com/)
- [Prisma Docs](https://www.prisma.io/docs/)

---

## Deployment

Ready to deploy? Use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

For more details, see [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

## License

[MIT](LICENSE)

---

<p align="center"><sub>Streaming made simple. Built with Next.js 15.</sub></p>
