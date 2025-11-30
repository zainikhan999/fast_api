import psycopg2
from dotenv import load_dotenv
from app.core.config import settings



def get_db_connection():
    """Establishes and returns a connection to the PostgreSQL database."""
    conn = psycopg2.connect(
        host=settings.PG_HOST,
        database=settings.PG_DATABASE,
        user=settings.PG_USER,
        password=settings.PG_PASSWORD,
        port=settings.PG_PORT

    )
    return conn

def test_db_connection():
    """Test PostgreSQL connection and print result."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT version();")
        db_version = cur.fetchone()
        print(f"✅ Connected to PostgreSQL: {db_version[0]}")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ DB Connection Error: {e}")
