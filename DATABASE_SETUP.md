# EcoSwap Database Integration

This document explains the database integration that replaces the localStorage-based authentication system with a proper database backend.

## 🗄️ Database Technology

- **Database**: SQLite (easily upgradeable to PostgreSQL)
- **ORM**: Custom service layer with raw SQL queries
- **Security**: bcryptjs for password hashing
- **Architecture**: Express.js API server + React frontend

## 📁 Project Structure

```
EcoSwap/
├── src/
│   ├── contexts/
│   │   └── AuthContext.js          # Updated to use API calls
│   ├── services/
│   │   ├── userService.js          # Database operations (Node.js)
│   │   └── apiService.js           # Frontend API client
│   └── database/
│       ├── connection.js           # Database connection management
│       └── migrations.js           # Database setup and seeding
├── server/
│   └── server.js                   # Express API server
├── scripts/
│   ├── initDatabase.js             # Database initialization
│   └── testDatabase.js             # Database testing
├── database/                       # SQLite database files (auto-created)
├── .env                           # Environment configuration
└── .env.example                   # Environment template
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Initialize Database
```bash
npm run db:init
```

### 4. Start Development Servers
```bash
npm run dev
```

This will start both:
- Backend API server on `http://localhost:3001`
- React frontend on `http://localhost:3000`

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run db:init` | Initialize database and create demo user |
| `npm run db:reset` | Reset database (drops and recreates tables) |
| `npm run server` | Start only the API server |
| `npm start` | Start only the React frontend |
| `npm run dev` | Start both servers concurrently |

## 🗃️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  hashedPassword TEXT NOT NULL,
  isActive BOOLEAN DEFAULT 1,
  emailVerified BOOLEAN DEFAULT 0,
  resetToken TEXT,
  resetTokenExpiry DATETIME,
  lastLogin DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### User Profiles Table
```sql
CREATE TABLE user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER UNIQUE NOT NULL,
  bio TEXT,
  location TEXT,
  phone TEXT,
  avatar TEXT,
  preferences TEXT, -- JSON string
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
);
```

## 🔐 Security Features

- **Password Hashing**: bcryptjs with 12 salt rounds
- **SQL Injection Protection**: Parameterized queries
- **Input Validation**: Server-side validation for all inputs
- **Environment Variables**: Sensitive data stored in .env
- **Password Reset Tokens**: Secure random tokens with expiration

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### User Management
- `GET /api/user/:id` - Get user profile
- `GET /api/health` - API health check

## 🧪 Demo User

A demo user is automatically created during database initialization:

- **Email**: `demo@ecoswap.com`
- **Password**: `demo123`

## 🔄 Migration from localStorage

The new system maintains the same API interface as the localStorage version:

1. **AuthContext**: Same methods (`login`, `register`, `forgotPassword`)
2. **User Experience**: Identical authentication flow
3. **Data Persistence**: User sessions still cached in localStorage for performance
4. **Backward Compatibility**: Existing components work without changes

## 🛠️ Development

### Adding New User Fields
1. Update database schema in `src/database/connection.js`
2. Add migration in `src/database/migrations.js`
3. Update `userService.js` methods
4. Add API endpoints in `server/server.js`

### Database Operations
```javascript
// Example: Adding a new user field
await dbConnection.run(`
  ALTER TABLE user_profiles 
  ADD COLUMN newField TEXT
`);
```

## 🚀 Production Deployment

### Environment Variables
```bash
# Production .env
NODE_ENV=production
DB_TYPE=sqlite
DB_PATH=./database/ecoswap_prod.db
JWT_SECRET=your-super-secure-production-secret
BCRYPT_ROUNDS=12
```

### Database Backup
```bash
# Backup SQLite database
cp database/ecoswap.db database/backup_$(date +%Y%m%d_%H%M%S).db
```

## 🔧 Troubleshooting

### Database Issues
```bash
# Reset database if corrupted
npm run db:reset

# Check database health
node scripts/testDatabase.js
```

### API Connection Issues
```bash
# Test API server
curl http://localhost:3001/api/health

# Check server logs
npm run server
```

## 📈 Performance Considerations

- **Connection Pooling**: SQLite handles concurrent connections
- **Indexing**: Email and reset token fields are indexed
- **Caching**: User sessions cached in localStorage
- **Transactions**: Database operations use transactions for consistency

## 🔮 Future Enhancements

- **PostgreSQL Migration**: Easy upgrade path for production
- **JWT Tokens**: Replace localStorage with secure tokens
- **Email Integration**: Real password reset emails
- **User Profiles**: Extended profile management
- **Admin Panel**: User management interface
