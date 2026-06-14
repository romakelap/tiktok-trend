import pandas as pd
from sqlalchemy import create_engine

def main():
    conn_str = "mysql+pymysql://airflow_user:AirflowTiktok2026!@localhost:3306/tiktok_oltp"
    engine = create_engine(conn_str)
    
    query = """
    SELECT 
        ta.user_id,
        ta.tracking_type,
        COUNT(*) as count
    FROM tracked_accounts ta
    GROUP BY ta.user_id, ta.tracking_type
    """
    
    try:
        df = pd.read_sql(query, engine)
        print("=== TRACKING TYPES BY USER ===")
        print(df.to_string(index=False))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
