# 🚀 Quick Start Guide

Get your Kamer Tech Mall authentication system up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create Environment File

Copy the template and fill in your MySQL credentials:

```bash
# Create .env file manually with this content:
NODE_ENV=development
PORT=3000
SESSION_SECRET=my-secret-key-change-in-production
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=kamer_tech_mall
```

## Step 3: Set Up Database

```bash
npm run setup-db
```

This creates the database and tables automatically.

## Step 4: Start the Server

```bash
npm run dev
```

## Step 5: Test It Out!

1. Open your browser to `http://localhost:3000`
2. Click "Register" to create a seller account
3. Fill in the registration form
4. Login with your credentials
5. Access your dashboard!

## 🎉 You're Ready!

Your authentication system is now running. Check out `README-AUTH.md` for detailed documentation.

## Common Issues

### MySQL Connection Error
- Make sure MySQL is running: `sudo systemctl start mysql`
- Check your credentials in `.env`
- Verify MySQL is on port 3306

### Port Already in Use
- Change the PORT in `.env` to something else (e.g., 3001)

### Database Setup Fails
- Make sure you have MySQL installed
- Verify your user has database creation privileges
- Try running: `mysql -u root -p` to test connection

## Next Steps

- Read `README-AUTH.md` for full documentation
- Deploy to Netlify with Supabase (see deployment guide)
- Customize the UI to match your brand
- Add product management features

## Need Help?

Check the main `README-AUTH.md` for detailed troubleshooting and documentation.

