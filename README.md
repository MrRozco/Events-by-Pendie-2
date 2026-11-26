# Hosted Events — Next.js + Payload CMS

Website for murder mysteries, Traitors nights, dinner parties and private events.

- **Frontend:** Next.js 16 (App Router, React 19, TypeScript)
- **CMS / backend:** Payload 3, running inside the same Next.js app at `/admin`
- **Database:** Postgres
- **Animations:** CSS keyframes and transitions, plus [Motion](https://motion.dev) for scroll reveals, filter transitions, FAQ and mobile menu
- **Tickets:** Stripe Checkout, with a webhook that writes orders into Payload
- **Images:** Payload uploads (resized to WebP by `sharp`), saved to local disk or S3 / Cloudflare R2

---

## Quick start

```bash
cp .env.example .env              # fill in PAYLOAD_SECRET (openssl rand -hex 32)
docker compose up -d              # local Postgres (or point DATABASE_URL at Neon/Supabase)
npm install
npm run seed                      # optional: sample events, settings and FAQ
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin. The first visit asks you to create the first admin account. Add the second person under **Settings → Users**.

---

## What the two admins manage

| Admin section | Collection | What it does |
|---|---|---|
| **Events → Events** | `events` | Every event. Set the **status** to control where it appears: *On sale* and *Sold out* show on the home page, *Past* shows in Our work, *Draft* is hidden. Tickets sold updates automatically. |
| **Sales → Orders** | `orders` | Ticket orders created by Stripe. Read-only apart from marking an order *Refunded*. |
| **Inbox → Subscribers** | `subscribers` | Newsletter sign-ups from "Be first in line". |
| **Inbox → Messages** | `contact-submissions` | Contact form messages. Set the status to *Replied* or *Archived* as you work through them. |
| **Content → Testimonials** | `testimonials` | Real guest reviews shown on Our work. The section is hidden until you add one. |
| **Content → Media** | `media` | All photos. Alt text is required. |
| **Settings → Site settings** | global | Brand name, host name, city, email, socials, hero/host/private photos, About numbers, FAQ. |

Edits show on the site immediately: hooks call `revalidatePath`. Pages also refresh every 60s as a fallback.

Forms are protected with a hidden honeypot field. Submissions can only be **read** by logged-in admins. The public API can't list them.

---

## Ticketing (Stripe)

1. Add `STRIPE_SECRET_KEY` to `.env`.
2. Create a webhook in the Stripe dashboard pointing to `https://YOUR_DOMAIN/webhooks/stripe`, for the event `checkout.session.completed`. Put its signing secret in `STRIPE_WEBHOOK_SECRET`.
   - Local testing: `stripe listen --forward-to localhost:3000/webhooks/stripe`
3. Give each event a **price** and **capacity**, and set its status to **On sale**.

**Get tickets** checks availability on the server, then opens Stripe Checkout (1 to 10 tickets, capped at seats left). After payment, the webhook:

- creates the order (idempotent per Stripe session)
- increases **tickets sold**
- flips the event to **Sold out** when it reaches capacity

Until Stripe is configured, the button shows a friendly "not set up yet" message.

> Note: `ticketsSold` is updated with read-then-write. That's fine at this scale. If you ever expect bursts of hundreds of simultaneous buyers, move it to an atomic SQL increment.

---

## Newsletter sending

Sign-ups are stored in Payload. To send campaigns, export subscribers or sync them to an email service (Resend, Kit, Mailchimp) with an `afterChange` hook on `subscribers`. Sending from a dedicated service handles deliverability and unsubscribe compliance properly.

---

## Project structure

```
src/
  app/
    (frontend)/            public site
      layout.tsx           fonts (Fraunces, DM Sans, Hurricane), nav, footer
      globals.css          full design system: palette, buttons, cards, animations
      page.tsx             Home: hero → intro → marquee → our events → how it works → events → private → newsletter → CTA
      about/ our-work/ contact/ tickets/success/
      webhooks/stripe/     Stripe → Payload orders
    (payload)/             Payload admin + REST/GraphQL API (generated, don't edit)
  collections/             Events, Orders, Subscribers, ContactSubmissions, Testimonials, Media, Users
  globals/SiteSettings.ts
  components/              Nav, Footer, HeroBackground, Marquee, UpcomingEvents, Countdown,
                           TicketButton, NewsletterForm, ContactForm, Faq, WorkGallery, motion, icons
  lib/                     data queries, server actions, Stripe client, formatting
  seed/index.ts            `npm run seed`
  payload.config.ts
```

### Animation map

| Effect | Where | How |
|---|---|---|
| Hero fade-up, gold flourish draw, rising embers, rotating sunburst, scroll cue | Heroes | CSS keyframes (`globals.css`) |
| Scrolling band | Under intro | CSS `marquee` keyframe, two tracks for a seamless loop |
| Holographic sweep, scale and olive glow | All cards and gallery tiles | CSS `::before` + transitions |
| Left-to-right fill on hover | All buttons, FAQ toggles; Espresso fill on the navbar CTA | CSS background-position transition |
| Scroll reveal / stagger | Every section | Motion `whileInView` (`components/motion.tsx`) |
| Filter transitions | Upcoming events, Our work gallery | Motion `AnimatePresence` + `layout` |
| FAQ accordion, contact form → thank-you, mobile menu | Contact, nav | Motion |

Everything respects `prefers-reduced-motion`: CSS animations are disabled and Motion uses `reducedMotion="user"`.

---

## Deploying (Vercel + Neon + R2)

1. Create a Postgres database (Neon or Supabase) and set `DATABASE_URL`.
2. Create an R2 bucket and set the `S3_*` variables. Without them, uploads go to local disk, which doesn't persist on Vercel.
3. Set `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL` (your domain) and the Stripe keys in Vercel.
4. **Migrations:** in development the schema syncs automatically. For production:
   ```bash
   npm run migrate:create    # after changing collections; commit src/migrations
   npm run migrate           # run on deploy (e.g. Vercel build command: `npm run migrate && npm run build`)
   ```
5. After changing collections, run `npm run generate:types` to refresh `src/payload-types.ts`.

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run seed` | Sample content |
| `npm run generate:types` | Regenerate Payload TS types |
| `npm run generate:importmap` | Regenerate the admin import map (after adding custom admin components) |
| `npm run migrate:create` / `migrate` | Production DB migrations |
| `npm run typecheck` / `lint` | Checks |

## Before launch

- Fill in Site settings (brand, host name, city, email, socials, photos).
- Replace the `[bracket]` placeholder copy on About (story paragraph) and in the Our events card meta (group sizes and durations), in `src/app/(frontend)/page.tsx`.
- Add real FAQ answers (refund policy, what's included).
- Add Privacy, Terms and Refund policy pages. They're linked as text in the footer.
