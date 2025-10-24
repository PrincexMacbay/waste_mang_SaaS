"""
Database Initialization Script
Creates the PostgreSQL database and tables for the Waste Management SaaS Platform
"""

import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_database_url():
    """Get database URL from environment variables"""
    return os.getenv('DATABASE_URL') or f"postgresql://{os.getenv('DB_USER', 'postgres')}:{os.getenv('DB_PASSWORD', 'password')}@{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '5432')}/{os.getenv('DB_NAME', 'waste_management_saas')}"

def create_database():
    """Create the database if it doesn't exist"""
    try:
        # Connect to PostgreSQL server (not to specific database)
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            port=os.getenv('DB_PORT', '5432'),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', 'password'),
            database='postgres'  # Connect to default postgres database
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Check if database exists
        db_name = os.getenv('DB_NAME', 'waste_management_saas')
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'")
        
        if not cursor.fetchone():
            # Create database
            cursor.execute(f"CREATE DATABASE {db_name}")
            print(f"✅ Database '{db_name}' created successfully")
        else:
            print(f"✅ Database '{db_name}' already exists")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        raise

def run_schema():
    """Run the database schema"""
    try:
        # Connect to the specific database
        conn = psycopg2.connect(get_database_url())
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Read and execute schema file
        schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
        
        with open(schema_path, 'r') as file:
            schema_sql = file.read()
        
        # Execute schema
        cursor.execute(schema_sql)
        print("✅ Database schema executed successfully")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error running schema: {e}")
        raise

def verify_tables():
    """Verify that all tables were created"""
    try:
        conn = psycopg2.connect(get_database_url())
        cursor = conn.cursor()
        
        # Get list of tables
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        
        tables = cursor.fetchall()
        table_names = [table[0] for table in tables]
        
        expected_tables = [
            'organizations', 'subscription_tiers', 'subscriptions', 'users',
            'zones', 'customers', 'pickups', 'invoices', 'payments',
            'notifications', 'audit_logs', 'complaints'
        ]
        
        print("\n📋 Database Tables:")
        for table in expected_tables:
            if table in table_names:
                print(f"  ✅ {table}")
            else:
                print(f"  ❌ {table} - MISSING")
        
        cursor.close()
        conn.close()
        
        return len([t for t in expected_tables if t in table_names]) == len(expected_tables)
        
    except Exception as e:
        print(f"❌ Error verifying tables: {e}")
        return False

def insert_initial_data():
    """Insert initial data (subscription tiers, super admin)"""
    try:
        conn = psycopg2.connect(get_database_url())
        cursor = conn.cursor()
        
        # Insert subscription tiers
        cursor.execute("""
            INSERT INTO subscription_tiers (name, description, price, billing_cycle, max_customers, max_managers, max_zones, features) 
            VALUES 
            ('Starter', 'Perfect for small waste management companies', 99.00, 'monthly', 100, 2, 3, '["basic_reporting", "email_support", "custom_branding"]'),
            ('Professional', 'Ideal for growing businesses', 199.00, 'monthly', 500, 5, 10, '["advanced_analytics", "priority_support", "api_access", "custom_domain"]'),
            ('Enterprise', 'For large organizations', 399.00, 'monthly', -1, -1, -1, '["custom_features", "dedicated_support", "white_label", "sla_guarantee"]')
            ON CONFLICT DO NOTHING
        """)
        
        # Insert super admin user
        cursor.execute("""
            INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, email_verified) 
            VALUES ('00000000-0000-0000-0000-000000000000', 'admin@wastemanagement-saas.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8QZ8K2K', 'Super', 'Admin', 'super_admin', true, true)
            ON CONFLICT (email) DO NOTHING
        """)
        
        conn.commit()
        print("✅ Initial data inserted successfully")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error inserting initial data: {e}")
        raise

def main():
    """Main initialization function"""
    print("🚀 Initializing Waste Management SaaS Database...")
    print("=" * 50)
    
    try:
        # Step 1: Create database
        print("\n1️⃣ Creating database...")
        create_database()
        
        # Step 2: Run schema
        print("\n2️⃣ Running database schema...")
        run_schema()
        
        # Step 3: Verify tables
        print("\n3️⃣ Verifying tables...")
        if verify_tables():
            print("✅ All tables created successfully")
        else:
            print("❌ Some tables are missing")
            return False
        
        # Step 4: Insert initial data
        print("\n4️⃣ Inserting initial data...")
        insert_initial_data()
        
        print("\n" + "=" * 50)
        print("🎉 Database initialization completed successfully!")
        print("\n📋 Next steps:")
        print("1. Update your .env file with database credentials")
        print("2. Start the Flask backend: python app.py")
        print("3. Start the React frontend: npm run dev")
        print("\n🔑 Demo credentials:")
        print("- Super Admin: admin@wastemanagement-saas.com / admin123")
        print("- Business Manager: business@mcbay.com / business123")
        print("- Regional Manager: regional@mcbay.com / regional123")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Database initialization failed: {e}")
        return False

if __name__ == '__main__':
    main()
