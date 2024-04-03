## Getting Started

1. Create new file`.env` from`.env.example`

```bash
cp .env.example .env
```

2. Install packages

```bash
npm install
```

3. Create new database`genza`
4. Populate database

```bash
npm run migrate
npm run seed
```

5. Run development server

```bash
npm run dev
```

6. Run production server

```bash
npm run build
npm start
```

## Dashboard

To access dashboard go to /dashboard page ex: `http://localhost:3000/dashboard` with credentials:

```
User: admin@mailinator.com
Pass: admin1234
```
