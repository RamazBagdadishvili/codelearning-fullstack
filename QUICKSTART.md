# ⚡ სწრაფი დაწყება (Quick Start)

წინაპირობები: **Node.js 18+**, **PostgreSQL 15+**, **npm**

## 1. პროექტის გადმოწერა

```bash
git clone <repository-url>
cd Full-Stack-Platform
```

## 2. მონაცემთა ბაზა

```bash
# შექმენით ბაზა
psql -U postgres -c "CREATE DATABASE codelearning;"

# გაუშვით schema და seed
psql -U postgres -d codelearning -f schema.sql
psql -U postgres -d codelearning -f seed.sql
```

## 3. Backend

```bash
cd backend
cp .env.example .env
# შეცვალეთ .env ფაილში DATABASE_URL და JWT_SECRET
npm install
npm run dev
```

Backend ამუშავდება: `http://localhost:5000`

## 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend ამუშავდება: `http://localhost:5173`

## 5. შესვლა

გახსენით ბრაუზერში `http://localhost:5173` და შედით ტესტ ანგარიშით:

- **ელ-ფოსტა:** `admin@codelearning.ge`
- **პაროლი:** (მითითებულია `seed.sql`-ში)

---

სრული ინსტრუქციისთვის იხილეთ [SETUP-GUIDE.md](./SETUP-GUIDE.md)
