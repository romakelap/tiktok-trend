import pandas as pd
from sqlalchemy import create_engine

def main():
    conn_str = "mysql+pymysql://airflow_user:AirflowTiktok2026!@localhost:3306/tiktok_oltp"
    engine = create_engine(conn_str)
    
    query = "SELECT user_id, email, full_name, is_active FROM users"
    
    try:
        df = pd.read_sql(query, engine)
        print("=== USERS ===")
        print(df)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
