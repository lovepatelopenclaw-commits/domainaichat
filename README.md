Vyarah AI HelpDesk is a [Next.js](https://nextjs.org) application for domain-specific expert guidance across tax, legal, medical, real estate, business, and finance.

Production domain: `https://vyarah.com`

## Environment Setup

Create a `.env.local` file with these values:

```env
OPENROUTER_API_KEY=
NVIDIA_NIM_API_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
NEXT_PUBLIC_APP_URL=https://vyarah.com
VYARAH_ADMIN_EMAILS=founder@example.com
```

Enable Firebase Authentication, Firestore, and Google sign-in in your Firebase project before testing authenticated flows.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Verification

Use these checks after setup:

- Email sign up and sign in
- Google popup sign in
- Guest chat limit of 3
- Signed-in free plan limit of 10 per day
- Conversation history loading in the sidebar
- Dashboard usage and recent conversation summaries

## Build Commands

```bash
npm run lint
npm run build
```
