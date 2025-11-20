const bcrypt = require('bcryptjs');
const { database, dbType } = require('../config/database');

class Seller {
  // Register a new seller
  static async create(sellerData) {
    const { username, email, password, businessName, phone, address } = sellerData;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    if (dbType === 'mysql') {
      const query = `
        INSERT INTO sellers (username, email, password_hash, business_name, phone, address, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await database.query(query, [
        username,
        email,
        passwordHash,
        businessName,
        phone || null,
        address || null,
        sellerData.role || 'seller'
      ]);

      return {
        id: result.insertId,
        username,
        email,
        businessName,
        role: sellerData.role || 'seller'
      };
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();
      const { data, error } = await supabase
        .from('sellers')
        .insert([{
          username,
          email,
          password_hash: passwordHash,
          business_name: businessName,
          phone: phone || null,
          address: address || null,
          role: sellerData.role || 'seller'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  // Find seller by email
  static async findByEmail(email) {
    if (dbType === 'mysql') {
      const query = 'SELECT * FROM sellers WHERE email = ?';
      const results = await database.query(query, [email]);
      return results[0] || null;
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  }

  // Find seller by username
  static async findByUsername(username) {
    if (dbType === 'mysql') {
      const query = 'SELECT * FROM sellers WHERE username = ?';
      const results = await database.query(query, [username]);
      return results[0] || null;
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('username', username)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  }

  // Find seller by ID
  static async findById(id) {
    if (dbType === 'mysql') {
      const query = 'SELECT * FROM sellers WHERE id = ?';
      const results = await database.query(query, [id]);
      return results[0] || null;
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update seller profile
  static async update(id, updateData) {
    const { businessName, phone, address } = updateData;

    if (dbType === 'mysql') {
      const query = `
        UPDATE sellers 
        SET business_name = ?, phone = ?, address = ?
        WHERE id = ?
      `;
      await database.query(query, [businessName, phone, address, id]);
      return await this.findById(id);
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();
      const { data, error } = await supabase
        .from('sellers')
        .update({
          business_name: businessName,
          phone,
          address
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  // Update seller status
  static async updateStatus(id, status) {
    if (dbType === 'mysql') {
      const query = 'UPDATE sellers SET status = ? WHERE id = ?';
      await database.query(query, [status, id]);
      return await this.findById(id);
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();
      const { data, error } = await supabase
        .from('sellers')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  // Get all sellers (admin functionality)
  static async getAll() {
    if (dbType === 'mysql') {
      const query = 'SELECT id, username, email, business_name, status, verified, created_at FROM sellers';
      return await database.query(query);
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();
      const { data, error } = await supabase
        .from('sellers')
        .select('id, username, email, business_name, status, verified, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  }

  // Make user an admin
  static async makeAdmin(id) {
    if (dbType === 'mysql') {
      const query = 'UPDATE sellers SET role = ? WHERE id = ?';
      await database.query(query, ['admin', id]);
      return await this.findById(id);
    } else if (dbType === 'supabase') {
      const supabase = database.getClient();
      const { data, error } = await supabase
        .from('sellers')
        .update({ role: 'admin' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }
}

module.exports = Seller;

