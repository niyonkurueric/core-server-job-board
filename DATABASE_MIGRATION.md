# Database Migration Guide: SQLite to PostgreSQL

## Why Migrate?

Vercel's serverless environment has a read-only filesystem, making SQLite databases unusable in production.

## Option 1: Vercel Postgres (Recommended)

### 1. Set up Vercel Postgres

1. **In Vercel Dashboard**:
   - Go to your project
   - Click "Storage" → "Create Database"
   - Choose "Postgres"
   - Select region
   - Click "Create"

2. **Get Connection Details**:
   - Copy the connection string
   - Note the database name, user, password, and host

### 2. Update Dependencies

```bash
npm install pg pg-hstore
npm uninstall sqlite3
```

### 3. Update Database Configuration

Replace `src/config/db.js`:

```javascript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
```

### 4. Update Environment Variables

Add to your `.env` file:
```
DATABASE_URL=postgresql://username:password@host:port/database
```

## Option 2: Supabase (Free Alternative)

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create account and new project
3. Get connection string from Settings → Database

### 2. Update Dependencies

```bash
npm install pg pg-hstore
npm uninstall sqlite3
```

### 3. Update Database Configuration

Same as Vercel Postgres, but use Supabase connection string.

## Option 3: Railway

### 1. Set up Railway

1. Go to [railway.app](https://railway.app)
2. Create account and new project
3. Add PostgreSQL service
4. Get connection string

### 2. Update Dependencies

```bash
npm install pg pg-hstore
npm uninstall sqlite3
```

## Migration Steps

### 1. Install New Dependencies

```bash
npm install pg pg-hstore
npm uninstall sqlite3
```

### 2. Update Database Config

Replace your current `src/config/db.js` with the PostgreSQL version above.

### 3. Update Environment Variables

Set `DATABASE_URL` in your `.env` file and Vercel dashboard.

### 4. Update Migration Scripts

Your existing migrations should work, but ensure they're compatible with PostgreSQL.

### 5. Test Locally

```bash
npm run migrate
npm run seed
npm run dev
```

### 6. Deploy to Vercel

```bash
vercel --prod
```

## PostgreSQL vs SQLite Differences

### Data Types
- `INTEGER` → `INTEGER` (same)
- `TEXT` → `TEXT` (same)
- `REAL` → `DOUBLE PRECISION`
- `BLOB` → `BYTEA`

### Constraints
- `UNIQUE` → `UNIQUE` (same)
- `NOT NULL` → `NOT NULL` (same)
- `PRIMARY KEY` → `PRIMARY KEY` (same)

### Functions
- `datetime('now')` → `NOW()`
- `strftime('%Y-%m-%d', 'now')` → `CURRENT_DATE`

## Testing Your Migration

1. **Local Testing**:
   ```bash
   npm run migrate
   npm run seed
   npm run dev
   ```

2. **Test All Endpoints**:
   - Create jobs
   - Apply for jobs
   - User authentication
   - Analytics

3. **Check Data Integrity**:
   - Verify all tables created
   - Check relationships
   - Validate constraints

## Troubleshooting

### Common Issues

1. **Connection Refused**:
   - Check connection string
   - Verify database is running
   - Check firewall settings

2. **SSL Errors**:
   - Add `rejectUnauthorized: false` to SSL options
   - Use `require: true` for SSL

3. **Migration Failures**:
   - Check PostgreSQL syntax
   - Verify user permissions
   - Check for reserved keywords

### Getting Help

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Sequelize Documentation](https://sequelize.org/)
- [Vercel Postgres Guide](https://vercel.com/docs/storage/vercel-postgres)
