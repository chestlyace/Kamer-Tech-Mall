# Kamer Tech Mall - Seller Authentication System

A complete authentication system for sellers built with Node.js, Express, EJS, and supporting both MySQL (local development) and Supabase (production on Netlify).

## 🚀 Features

- ✅ Secure user registration with validation
- ✅ Email/password authentication
- ✅ Session management
- ✅ Password hashing with bcrypt
- ✅ Protected routes with middleware
- ✅ Seller dashboard and profile management
- ✅ MySQL support for local development
- ✅ Supabase support for production deployment
- ✅ Beautiful, responsive UI with Tailwind CSS
- ✅ Flash messages for user feedback
- ✅ Account status management (pending, active, suspended)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (for local development)
- Supabase account (for production deployment)

## 🛠️ Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# MySQL Configuration (Local Development)
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=kamer_tech_mall
```

### 3. Set Up the Database

Run the database setup script:

```bash
npm run setup-db
```

This will:
- Create the database if it doesn't exist
- Create the `sellers` table
- Create the `seller_sessions` table
- Set up all necessary indexes

### 4. Start the Development Server

```bash
npm run dev
```

Or for production mode:

```bash
npm start
```

The server will be available at `http://localhost:3000`

## 🌐 Production Deployment (Netlify + Supabase)

### 1. Set Up Supabase Database

1. Create a new project on [Supabase](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL script from `supabase-schema.sql`

### 2. Configure Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Create a `netlify.toml` file:
```toml
[build]
  command = "npm install"
  functions = "netlify/functions"
  publish = "public"

[functions]
  node_bundler = "esbuild"

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/server/:splat"
  status = 200
```

3. Create serverless function at `netlify/functions/server.js`:
```javascript
const serverless = require('serverless-http');
const app = require('../../server');

module.exports.handler = serverless(app);
```

4. Update `.env` for production:
```env
NODE_ENV=production
DB_TYPE=supabase
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SESSION_SECRET=generate-a-strong-random-secret
```

5. Deploy to Netlify:
```bash
netlify login
netlify init
netlify deploy --prod
```

6. Set environment variables in Netlify:
   - Go to Site Settings → Build & deploy → Environment
   - Add all the variables from your `.env` file

## 📁 Project Structure

```
Kamer-Tech-Mall/
├── config/
│   └── database.js          # Database configuration (MySQL & Supabase)
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   └── Seller.js            # Seller model with CRUD operations
├── routes/
│   ├── auth.js              # Authentication routes
│   └── seller.js            # Seller dashboard routes
├── views/
│   ├── auth/
│   │   ├── login.ejs        # Login page
│   │   ├── register.ejs     # Registration page
│   │   └── suspended.ejs    # Suspended account page
│   ├── seller/
│   │   ├── dashboard.ejs    # Seller dashboard
│   │   └── profile.ejs      # Profile management
│   ├── home.ejs             # Landing page
│   ├── 404.ejs              # 404 error page
│   └── error.ejs            # General error page
├── server.js                # Express server setup
├── setup-database.js        # Database setup script
├── supabase-schema.sql      # Supabase database schema
├── package.json             # Dependencies and scripts
└── .env                     # Environment variables (create this)
```

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds
- **Session Management**: Secure session handling with HTTP-only cookies
- **CSRF Protection**: Ready for CSRF token implementation
- **Input Validation**: Server-side validation using express-validator
- **SQL Injection Prevention**: Prepared statements and parameterized queries
- **XSS Protection**: EJS automatic escaping

## 📚 API Routes

### Authentication Routes (`/auth`)

- `GET /auth/register` - Registration page
- `POST /auth/register` - Handle registration
- `GET /auth/login` - Login page
- `POST /auth/login` - Handle login
- `GET /auth/logout` - Logout user
- `GET /auth/suspended` - Suspended account page

### Seller Routes (`/seller`) - Protected

- `GET /seller/dashboard` - Seller dashboard (requires authentication)
- `GET /seller/profile` - Profile page (requires authentication)
- `POST /seller/profile` - Update profile (requires authentication)

### Public Routes

- `GET /` - Home page

## 🎨 UI Features

- Responsive design using Tailwind CSS
- Font Awesome icons
- Flash messages for user feedback
- Modern gradient backgrounds
- Card-based layouts
- Mobile-friendly navigation

## 🔄 Database Schema

### Sellers Table

```sql
- id (INT/UUID, Primary Key)
- username (VARCHAR, Unique)
- email (VARCHAR, Unique)
- password_hash (VARCHAR)
- business_name (VARCHAR)
- phone (VARCHAR, Optional)
- address (TEXT, Optional)
- verified (BOOLEAN, Default: false)
- status (ENUM: pending/active/suspended, Default: pending)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Seller Sessions Table

```sql
- id (INT/UUID, Primary Key)
- seller_id (Foreign Key → sellers.id)
- session_token (VARCHAR, Unique)
- ip_address (VARCHAR)
- user_agent (TEXT)
- expires_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

## 🧪 Testing

1. **Register a new seller**:
   - Go to `http://localhost:3000/auth/register`
   - Fill in the registration form
   - Submit and verify success message

2. **Login**:
   - Go to `http://localhost:3000/auth/login`
   - Use the credentials you just created
   - Verify redirect to dashboard

3. **Access Protected Routes**:
   - Try accessing `/seller/dashboard` without logging in
   - Verify redirect to login page

4. **Update Profile**:
   - Go to `/seller/profile`
   - Update business information
   - Verify changes are saved

## 🚧 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Social login (Google, Facebook)
- [ ] Product management
- [ ] Order management
- [ ] Analytics dashboard
- [ ] Payment integration
- [ ] Admin panel

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support, email support@kamertechmall.com or create an issue in the repository.

## 🙏 Acknowledgments

- Express.js for the web framework
- EJS for templating
- Tailwind CSS for styling
- Supabase for production database
- Font Awesome for icons

