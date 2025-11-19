-- Supabase Schema for Kamer Tech Mall
-- Run this in your Supabase SQL Editor when deploying to production

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create sellers table
CREATE TABLE IF NOT EXISTS sellers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  business_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  verified BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sellers_email ON sellers(email);
CREATE INDEX IF NOT EXISTS idx_sellers_username ON sellers(username);

-- Create seller_sessions table
CREATE TABLE IF NOT EXISTS seller_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for sessions
CREATE INDEX IF NOT EXISTS idx_seller_sessions_token ON seller_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_seller_sessions_seller_id ON seller_sessions(seller_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for sellers table
CREATE TRIGGER update_sellers_updated_at BEFORE UPDATE ON sellers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for sellers
CREATE POLICY "Sellers can view their own data" ON sellers
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Sellers can update their own data" ON sellers
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Create policies for seller_sessions
CREATE POLICY "Sellers can view their own sessions" ON seller_sessions
  FOR SELECT USING (auth.uid()::text = seller_id::text);

CREATE POLICY "Sellers can delete their own sessions" ON seller_sessions
  FOR DELETE USING (auth.uid()::text = seller_id::text);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'archived')),
  old_price DECIMAL(12, 2),
  new_price DECIMAL(12, 2),
  current_price DECIMAL(12, 2) NOT NULL,
  quantity INT DEFAULT 0,
  size VARCHAR(100),
  color VARCHAR(100),
  location VARCHAR(255),
  shop_name VARCHAR(255),
  supplier_phone VARCHAR(20),
  supplier_whatsapp VARCHAR(20),
  featured_photo TEXT,
  other_photos TEXT,
  description TEXT,
  features TEXT,
  conditions TEXT,
  return_policy TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for products
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Enable Row Level Security for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Sellers can view their own products" ON products
  FOR SELECT USING (auth.uid()::text = seller_id::text);

CREATE POLICY "Sellers can insert their own products" ON products
  FOR INSERT WITH CHECK (auth.uid()::text = seller_id::text);

CREATE POLICY "Sellers can update their own products" ON products
  FOR UPDATE USING (auth.uid()::text = seller_id::text);

CREATE POLICY "Sellers can delete their own products" ON products
  FOR DELETE USING (auth.uid()::text = seller_id::text);

-- Create trigger for products table
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE sellers IS 'Stores seller account information';
COMMENT ON TABLE seller_sessions IS 'Stores active seller session tokens';
COMMENT ON TABLE products IS 'Stores product listings from sellers';

