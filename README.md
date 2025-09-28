# ThoughtDump (voice-dump)

Super-simple cross-platform voice dump app: record on mobile, review on web.

## Prereqs
- Node.js 18+
- Expo CLI
- Supabase project

## Environment variables
Copy `.env.example` to:
- `mobile/.env`
- `web/.env.local`

Fill with your project values:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

## Supabase setup
1) Create a private Storage bucket named `recordings`.
2) In SQL Editor, run `supabase/schema.sql`, then `supabase/policies.sql`.

## Develop
### Mobile
```
cd mobile
npm i
# npx expo prebuild --clean  # only if native config needed
npm run start
```

### Web
```
cd web
npm i
npm run dev
```

## Deploy (optional)
- Mobile: Expo EAS
- Web: Vercel

