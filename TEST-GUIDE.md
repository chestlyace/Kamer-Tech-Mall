# 🧪 Testing Your Authentication System

This guide will help you test the login and registration pages that are already built and connected to the backend.

## ✅ What's Already Connected

### Backend Routes (Working)
- ✅ `POST /auth/register` - Handles user registration
- ✅ `POST /auth/login` - Handles user login
- ✅ `GET /auth/logout` - Handles logout
- ✅ `GET /seller/dashboard` - Protected dashboard (requires login)
- ✅ `GET /seller/profile` - Profile management (requires login)

### Frontend Pages (Working)
- ✅ `/auth/register` - Beautiful registration form with validation
- ✅ `/auth/login` - Login form with authentication
- ✅ `/seller/dashboard` - Seller dashboard with stats
- ✅ `/seller/profile` - Profile editing page

## 🚀 Quick Test (5 Minutes)

### Step 1: Start the Server

```bash
# First time setup
npm install
npm run setup-db

# Start the development server
npm run dev
```

You should see:
```
🚀 Server is running on http://localhost:3000
📦 Environment: development
🗄️  Database: mysql
MySQL database connected successfully
```

### Step 2: Test Registration

1. **Open your browser** to: `http://localhost:3000`
2. **Click "Register"** or go to: `http://localhost:3000/auth/register`
3. **Fill in the form:**
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test1234` (must have uppercase, lowercase, and number)
   - Confirm Password: `Test1234`
   - Business Name: `Test Shop`
   - Phone: `+237 123 456 789` (optional)
   - Address: `Douala, Cameroon` (optional)
4. **Click "Create Account"**
5. **Expected Result:** 
   - ✅ Success message: "Registration successful! You can now log in."
   - ✅ Redirected to login page

### Step 3: Test Login

1. **On the login page** (or go to `http://localhost:3000/auth/login`)
2. **Enter credentials:**
   - Email: `test@example.com`
   - Password: `Test1234`
3. **Click "Sign In"**
4. **Expected Result:**
   - ✅ Success message: "Welcome back, testuser!"
   - ✅ Redirected to dashboard at `/seller/dashboard`

### Step 4: Test Dashboard (Protected Route)

1. **You should now be on:** `http://localhost:3000/seller/dashboard`
2. **You should see:**
   - ✅ Welcome banner with your username
   - ✅ Account status (Pending/Active)
   - ✅ Stats cards (Products, Orders, Revenue)
   - ✅ Quick action buttons
   - ✅ Business information section
3. **Try navigating:**
   - Click "Profile" to edit your information
   - Update your business details
   - Click "Save Changes"

### Step 5: Test Profile Update

1. **Go to:** `http://localhost:3000/seller/profile`
2. **Update fields:**
   - Business Name: `My Awesome Shop`
   - Phone: `+237 987 654 321`
   - Address: `Yaoundé, Cameroon`
3. **Click "Save Changes"**
4. **Expected Result:**
   - ✅ Success message: "Profile updated successfully"
   - ✅ Changes saved in database

### Step 6: Test Logout

1. **Click "Logout"** in the navigation
2. **Expected Result:**
   - ✅ Session destroyed
   - ✅ Redirected to login page
   - ✅ Can't access dashboard without logging back in

### Step 7: Test Protected Routes

1. **After logging out**, try to access: `http://localhost:3000/seller/dashboard`
2. **Expected Result:**
   - ✅ Redirected to login page
   - ✅ Error message: "Please log in to access this page"

## 🔍 Visual Tour of Your Pages

### Registration Page Features:
- ✅ Real-time validation
- ✅ Password strength requirements
- ✅ Duplicate username/email checking
- ✅ Beautiful gradient background
- ✅ Responsive mobile design
- ✅ Error message display
- ✅ Link to login page

### Login Page Features:
- ✅ Email/password authentication
- ✅ Remember me checkbox
- ✅ Forgot password link (placeholder)
- ✅ Error handling
- ✅ Redirect to dashboard on success
- ✅ Link to registration

### Dashboard Features:
- ✅ Personalized welcome message
- ✅ Account status badge
- ✅ Statistics cards (Products, Orders, Revenue)
- ✅ Quick action buttons
- ✅ Business information display
- ✅ Navigation menu
- ✅ Logout functionality

## 🐛 Troubleshooting

### "Cannot connect to MySQL"
**Solution:**
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Verify credentials in .env file
cat .env
```

### "Port 3000 already in use"
**Solution:**
```bash
# Option 1: Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Change port in .env
# Set PORT=3001 in your .env file
```

### "Cannot find module"
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Registration not working"
**Solution:**
1. Check browser console for errors (F12)
2. Check server terminal for error messages
3. Verify database is set up: `npm run setup-db`
4. Check MySQL connection in .env

### "Validation errors"
Make sure your password:
- Is at least 8 characters long
- Contains at least one uppercase letter
- Contains at least one lowercase letter
- Contains at least one number

## 📊 Database Verification

### Check if user was created:
```sql
mysql -u root -p
USE kamer_tech_mall;
SELECT id, username, email, business_name, status, created_at FROM sellers;
```

You should see your test user listed!

## 🎯 API Endpoints Reference

### Public Endpoints
```
GET  /                      → Home page
GET  /auth/register         → Registration page
POST /auth/register         → Create new seller
GET  /auth/login            → Login page
POST /auth/login            → Authenticate seller
```

### Protected Endpoints (Require Authentication)
```
GET  /seller/dashboard      → Seller dashboard
GET  /seller/profile        → Profile page
POST /seller/profile        → Update profile
GET  /auth/logout           → Logout
```

## 🧪 Test with cURL

### Register a new user:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=curluser&email=curl@test.com&password=Test1234&confirmPassword=Test1234&businessName=Curl+Shop"
```

### Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=curl@test.com&password=Test1234" \
  -c cookies.txt
```

### Access Dashboard (with session):
```bash
curl http://localhost:3000/seller/dashboard -b cookies.txt
```

## ✨ Everything is Connected!

Your authentication system is **fully functional**:

1. ✅ **Frontend Pages** → Beautiful EJS templates
2. ✅ **Backend Routes** → Express routes handling requests
3. ✅ **Database** → MySQL storing user data
4. ✅ **Validation** → Server-side input validation
5. ✅ **Security** → Password hashing, session management
6. ✅ **Middleware** → Route protection
7. ✅ **Flash Messages** → User feedback system

## 🎉 Ready to Use!

Start testing now:
```bash
npm run dev
```

Then open: **http://localhost:3000**

Happy testing! 🚀

