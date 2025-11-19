# 🧪 Product Management Testing Guide

## Quick Test Checklist

### ✅ Test 1: Create a Product

1. **Login** to your seller account
2. **Go to** `/seller/dashboard`
3. **Fill in the form** on the left:
   - Product name: "iPhone 15 Pro Max"
   - Category: "Phones"
   - Current price: 850000
   - Quantity: 10
   - (Optional fields: old price, new price, size, color, etc.)
4. **Click** "Publish product"
5. **Expected result**: 
   - Toast notification: "Product created successfully"
   - Page refreshes
   - Product appears in the table/list
   - Stats update (Total Products +1)

### ✅ Test 2: Edit a Product

1. **Find** the product you just created
2. **Click** "Edit" button
3. **Observe**:
   - Form fills with product data
   - Button changes to "Save changes"
   - "Cancel edit" button appears
4. **Change** quantity to 15
5. **Click** "Save changes"
6. **Expected result**:
   - Toast: "Product updated successfully"
   - Product quantity updates in table
   - Form resets

### ✅ Test 3: Search Products

1. **Type** "iPhone" in search box
2. **Expected result**:
   - Only products matching "iPhone" show
   - Other products filtered out

### ✅ Test 4: Filter by Status

1. **Select** "Published" from status dropdown
2. **Expected result**:
   - Only published products show
   - Drafts and archived hidden

### ✅ Test 5: Delete a Product

1. **Click** "Delete" on a product
2. **Confirm** the deletion
3. **Expected result**:
   - Toast: "Product deleted successfully"
   - Product removed from list
   - Stats update (Total Products -1)

### ✅ Test 6: Mobile Responsiveness

1. **Resize browser** to mobile width (< 768px)
2. **Observe**:
   - Form becomes full width
   - Table changes to card layout
   - Navigation stacks vertically
   - All features still work

### ✅ Test 7: Dark Mode

1. **Click** moon icon in navigation
2. **Expected result**:
   - Colors invert to dark theme
   - Preference saves (refresh to verify)

## Sample Product Data

### Product 1: Premium Phone
```
Name: Samsung Galaxy S24 Ultra
Category: Phones
Status: Published
Old Price: 900000
New Price: 850000
Current Price: 820000
Quantity: 15
Size: 6.8-inch
Color: Titanium Black
Location: Douala, Cameroon
Shop Name: Kamer Tech Hub
Phone: +237 650 000 001
WhatsApp: +237 650 000 001
Description: Latest flagship with S Pen, 200MP camera, and AI features
Features: S Pen included, 200MP camera, Snapdragon 8 Gen 3, 12GB RAM
Conditions: Brand new, sealed box, international warranty
Return Policy: 7-day return if unopened
✓ Featured product
✓ Active listing
```

### Product 2: Laptop
```
Name: MacBook Air M3
Category: Laptops
Status: Published
Current Price: 1250000
Quantity: 8
Size: 13-inch
Color: Midnight
Location: Yaoundé, Cameroon
Shop Name: Pro Devices CM
Description: Ultra-thin laptop with M3 chip for professionals
Features: M3 chip, 16GB RAM, 512GB SSD, 18-hour battery
Conditions: Brand new, sealed
Return Policy: 3-day inspection period
✓ Active listing
```

### Product 3: Accessory (Draft)
```
Name: AirPods Pro (2nd Gen)
Category: Accessories
Status: Draft
Old Price: 280000
Current Price: 260000
Quantity: 25
Color: White
Description: Wireless earbuds with active noise cancellation
Features: ANC, Transparency mode, MagSafe charging, Find My support
Conditions: Brand new
✓ Active listing
```

## Detailed Testing Scenarios

### Scenario 1: Full Product Lifecycle

**Steps:**
1. Create product (draft)
2. Edit and change to published
3. Update quantity
4. Mark as featured
5. Archive product
6. Delete product

**Expected:** All operations work smoothly with proper notifications.

### Scenario 2: Bulk Management

**Steps:**
1. Create 10 products
2. Search for specific one
3. Edit multiple products
4. Filter by category
5. Delete several products

**Expected:** Dashboard handles multiple products efficiently.

### Scenario 3: Validation Testing

**Try creating product with:**
- ❌ Empty name → Should show error
- ❌ Negative price → Should show error
- ❌ Negative quantity → Should show error
- ✅ All valid data → Should succeed

### Scenario 4: Filter Combinations

**Test:**
1. Search "Phone" + Filter "Published"
2. Search "Laptop" + Filter "Draft"
3. Clear all filters
4. Apply single filter
5. Apply search only

**Expected:** All combinations work correctly.

## Visual Checks

### Desktop View (> 1024px)
- ✅ 3-column layout
- ✅ Form on left (1 column)
- ✅ Product table on right (2 columns)
- ✅ Table with 7 columns visible
- ✅ Horizontal scroll if needed

### Tablet View (768px - 1024px)
- ✅ 2-column grid for stats
- ✅ Form takes full width
- ✅ Table scrolls horizontally
- ✅ All actions accessible

### Mobile View (< 768px)
- ✅ Single column layout
- ✅ Stats stack vertically
- ✅ Cards replace table
- ✅ Touch-friendly buttons
- ✅ Readable on small screens

## Performance Checks

### Page Load
- ✅ Dashboard loads in < 2 seconds
- ✅ Stats display immediately
- ✅ Products load quickly
- ✅ No console errors

### Operations
- ✅ Create product < 1 second
- ✅ Edit product < 1 second
- ✅ Delete product < 1 second
- ✅ Search instant (< 100ms)
- ✅ Filter instant (< 100ms)

## Error Handling

### Network Errors
1. **Disconnect internet**
2. **Try to create product**
3. **Expected**: Error toast showing network issue

### Invalid Data
1. **Enter invalid price** (text instead of number)
2. **Submit form**
3. **Expected**: Validation error

### Unauthorized Access
1. **Logout**
2. **Try to access** `/seller/dashboard`
3. **Expected**: Redirect to login

## Database Verification

### Check MySQL
```sql
-- Connect to MySQL
mysql -u root -p

-- Use database
USE kamer_tech_mall;

-- View all products
SELECT id, seller_id, name, category, status, current_price, quantity 
FROM products;

-- View products with seller info
SELECT p.name, p.category, p.current_price, s.username as seller
FROM products p
JOIN sellers s ON p.seller_id = s.id;

-- Check product count
SELECT COUNT(*) as total_products FROM products;

-- Check by status
SELECT status, COUNT(*) as count 
FROM products 
GROUP BY status;
```

## Browser Compatibility

Test on:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if on Mac)
- ✅ Mobile browsers (iOS/Android)

## Accessibility

- ✅ Keyboard navigation works
- ✅ Tab order is logical
- ✅ Form labels are clear
- ✅ Buttons have descriptive text
- ✅ Colors have sufficient contrast

## Security Testing

### Authentication
1. **Logout**
2. **Try** `/seller/products` API directly
3. **Expected**: 401/403 or redirect

### Authorization
1. **Login as Seller A**
2. **Note a product ID**
3. **Login as Seller B**
4. **Try to edit** Seller A's product
5. **Expected**: Can't access other seller's products

### Input Validation
1. **Try SQL injection** in product name: `'; DROP TABLE products; --`
2. **Expected**: Saved as regular text, no SQL executed
3. **Try XSS** in description: `<script>alert('xss')</script>`
4. **Expected**: Escaped and displayed as text

## Common Issues & Solutions

### Issue: Products not saving
**Solution:** 
- Check console for errors
- Verify database connection
- Check all required fields filled

### Issue: Images not showing
**Solution:**
- Verify image URLs are valid
- Check if URLs start with http/https
- Try different image hosting

### Issue: Search not working
**Solution:**
- Clear filters first
- Try exact product name
- Check spelling

### Issue: Dark mode not persisting
**Solution:**
- Check localStorage is enabled
- Clear browser cache
- Try different browser

## Success Criteria

Your product management system is working correctly if:

1. ✅ Can create products with all fields
2. ✅ Can edit and update products
3. ✅ Can delete products with confirmation
4. ✅ Search finds products correctly
5. ✅ Filters work as expected
6. ✅ Stats update in real-time
7. ✅ Mobile view is usable
8. ✅ Dark mode works
9. ✅ No console errors
10. ✅ Database persists data correctly

## 🎉 Ready to Test!

Start with Test 1 (Create a Product) and work your way through. Each test builds on the previous one.

**Quick Start:**
```bash
npm run dev
# Open http://localhost:3000
# Login → Dashboard → Start testing!
```

Good luck! 🚀

