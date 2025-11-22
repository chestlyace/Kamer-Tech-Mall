const { database, dbType } = require('../config/database');

class Product {
  // Create a new product
  static async create(sellerId, productData) {
    const {
      name, category, status, oldPrice, newPrice, currentPrice,
      quantity, size, color, location, shopName, supplierPhone,
      supplierWhatsapp, featuredPhoto, otherPhotos, description,
      features, conditions, returnPolicy, isFeatured, isActive
    } = productData;

    if (dbType === 'mysql') {
      const query = `
        INSERT INTO products (
          seller_id, name, category, status, old_price, new_price, current_price,
          quantity, size, color, location, shop_name, supplier_phone,
          supplier_whatsapp, featured_photo, other_photos, description,
          features, conditions, return_policy, is_featured, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await database.query(query, [
        sellerId, name, category, status || 'draft',
        oldPrice || null, newPrice || null, currentPrice,
        quantity || 0, size || null, color || null, location || null,
        shopName || null, supplierPhone || null, supplierWhatsapp || null,
        featuredPhoto || null, otherPhotos || null, description || null,
        features || null, conditions || null, returnPolicy || null,
        isFeatured || false, isActive !== false
      ]);

      return await this.findById(result.insertId, sellerId);
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();
      const { data, error } = await supabase
        .from('products')
        .insert([{
          seller_id: sellerId,
          name,
          category,
          status: status || 'draft',
          old_price: oldPrice || null,
          new_price: newPrice || null,
          current_price: currentPrice,
          quantity: quantity || 0,
          size: size || null,
          color: color || null,
          location: location || null,
          shop_name: shopName || null,
          supplier_phone: supplierPhone || null,
          supplier_whatsapp: supplierWhatsapp || null,
          featured_photo: featuredPhoto || null,
          other_photos: otherPhotos || null,
          description: description || null,
          features: features || null,
          conditions: conditions || null,
          return_policy: returnPolicy || null,
          is_featured: isFeatured || false,
          is_active: isActive !== false
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  // Get all products for a seller
  static async findBySellerId(sellerId, filters = {}) {
    if (dbType === 'mysql') {
      let query = 'SELECT * FROM products WHERE seller_id = ?';
      const params = [sellerId];

      if (filters.status && filters.status !== 'all') {
        query += ' AND status = ?';
        params.push(filters.status);
      }

      if (filters.search) {
        query += ' AND (name LIKE ? OR category LIKE ? OR shop_name LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      query += ' ORDER BY updated_at DESC';

      return await database.query(query, params);
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();
      let query = supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId);

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,category.ilike.%${filters.search}%,shop_name.ilike.%${filters.search}%`);
      }

      query = query.order('updated_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  }

  // Find product by ID
  static async findById(productId, sellerId) {
    if (dbType === 'mysql') {
      const query = 'SELECT * FROM products WHERE id = ? AND seller_id = ?';
      const results = await database.query(query, [productId, sellerId]);
      return results[0] || null;
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('seller_id', sellerId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  }

  // Update product
  static async update(productId, sellerId, updateData) {
    const {
      name, category, status, oldPrice, newPrice, currentPrice,
      quantity, size, color, location, shopName, supplierPhone,
      supplierWhatsapp, featuredPhoto, otherPhotos, description,
      features, conditions, returnPolicy, isFeatured, isActive
    } = updateData;

    if (dbType === 'mysql') {
      const query = `
        UPDATE products SET
          name = ?, category = ?, status = ?, old_price = ?, new_price = ?,
          current_price = ?, quantity = ?, size = ?, color = ?, location = ?,
          shop_name = ?, supplier_phone = ?, supplier_whatsapp = ?,
          featured_photo = ?, other_photos = ?, description = ?, features = ?,
          conditions = ?, return_policy = ?, is_featured = ?, is_active = ?
        WHERE id = ? AND seller_id = ?
      `;
      await database.query(query, [
        name, category, status, oldPrice || null, newPrice || null,
        currentPrice, quantity, size || null, color || null, location || null,
        shopName || null, supplierPhone || null, supplierWhatsapp || null,
        featuredPhoto || null, otherPhotos || null, description || null,
        features || null, conditions || null, returnPolicy || null,
        isFeatured || false, isActive !== false, productId, sellerId
      ]);

      return await this.findById(productId, sellerId);
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();
      const { data, error } = await supabase
        .from('products')
        .update({
          name,
          category,
          status,
          old_price: oldPrice || null,
          new_price: newPrice || null,
          current_price: currentPrice,
          quantity,
          size: size || null,
          color: color || null,
          location: location || null,
          shop_name: shopName || null,
          supplier_phone: supplierPhone || null,
          supplier_whatsapp: supplierWhatsapp || null,
          featured_photo: featuredPhoto || null,
          other_photos: otherPhotos || null,
          description: description || null,
          features: features || null,
          conditions: conditions || null,
          return_policy: returnPolicy || null,
          is_featured: isFeatured || false,
          is_active: isActive !== false
        })
        .eq('id', productId)
        .eq('seller_id', sellerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  // Delete product
  static async delete(productId, sellerId) {
    if (dbType === 'mysql') {
      const query = 'DELETE FROM products WHERE id = ? AND seller_id = ?';
      await database.query(query, [productId, sellerId]);
      return true;
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('seller_id', sellerId);

      if (error) throw error;
      return true;
    }
  }

  // Get product statistics
  static async getStats(sellerId) {
    if (dbType === 'mysql') {
      const query = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as drafts
        FROM products WHERE seller_id = ?
      `;
      const results = await database.query(query, [sellerId]);
      return results[0];
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();

      const { data: allProducts } = await supabase
        .from('products')
        .select('status')
        .eq('seller_id', sellerId);

      return {
        total: allProducts?.length || 0,
        published: allProducts?.filter(p => p.status === 'published').length || 0,
        drafts: allProducts?.filter(p => p.status === 'draft').length || 0
      };
    }
  }

  // Get all published products (public access)
  static async getPublishedProducts(filters = {}) {
    if (dbType === 'mysql') {
      let query = `
        SELECT p.*, s.business_name, s.username as seller_username
        FROM products p
        JOIN sellers s ON p.seller_id = s.id
        WHERE p.status = 'published' AND p.is_active = TRUE
      `;
      const params = [];

      if (filters.category) {
        query += ' AND p.category = ?';
        params.push(filters.category);
      }

      if (filters.search) {
        query += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.category LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (filters.minPrice) {
        query += ' AND p.current_price >= ?';
        params.push(filters.minPrice);
      }

      if (filters.maxPrice) {
        query += ' AND p.current_price <= ?';
        params.push(filters.maxPrice);
      }

      if (filters.inStockOnly) {
        query += ' AND p.quantity > 0';
      }

      // Sorting
      switch (filters.sortBy) {
        case 'price-low-high':
          query += ' ORDER BY p.current_price ASC';
          break;
        case 'price-high-low':
          query += ' ORDER BY p.current_price DESC';
          break;
        case 'latest':
          query += ' ORDER BY p.created_at DESC';
          break;
        case 'featured':
          query += ' ORDER BY p.is_featured DESC, p.created_at DESC';
          break;
        default:
          query += ' ORDER BY p.is_featured DESC, p.created_at DESC';
      }

      return await database.query(query, params);
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();
      let query = supabase
        .from('products')
        .select(`
          *,
          sellers!inner(business_name, username)
        `)
        .eq('status', 'published')
        .eq('is_active', true);

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,category.ilike.%${filters.search}%`);
      }

      if (filters.minPrice) {
        query = query.gte('current_price', filters.minPrice);
      }

      if (filters.maxPrice) {
        query = query.lte('current_price', filters.maxPrice);
      }

      if (filters.inStockOnly) {
        query = query.gt('quantity', 0);
      }

      // Sorting
      switch (filters.sortBy) {
        case 'price-low-high':
          query = query.order('current_price', { ascending: true });
          break;
        case 'price-high-low':
          query = query.order('current_price', { ascending: false });
          break;
        case 'latest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'featured':
          query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
          break;
        default:
          query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  }

  // Get featured products
  static async getFeaturedProducts(limit = 8) {
    if (dbType === 'mysql') {
      const query = `
        SELECT p.*, s.business_name, s.username as seller_username
        FROM products p
        JOIN sellers s ON p.seller_id = s.id
        WHERE p.status = 'published' AND p.is_active = TRUE AND p.is_featured = TRUE
        ORDER BY p.created_at DESC
        LIMIT ?
      `;
      return await database.query(query, [limit]);
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          sellers!inner(business_name, username)
        `)
        .eq('status', 'published')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    }
  }

  // Get single published product by ID
  static async getPublishedProductById(productId) {
    if (dbType === 'mysql') {
      const query = `
        SELECT p.*, s.business_name, s.username as seller_username, s.phone as seller_phone, s.email as seller_email
        FROM products p
        JOIN sellers s ON p.seller_id = s.id
        WHERE p.id = ? AND p.status = 'published' AND p.is_active = TRUE
      `;
      const results = await database.query(query, [productId]);
      return results[0] || null;
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          sellers!inner(business_name, username, phone, email)
        `)
        .eq('id', productId)
        .eq('status', 'published')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  }
}

module.exports = Product;

