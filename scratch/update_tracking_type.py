import pandas as pd
from sqlalchemy import create_engine, text

def main():
    conn_str = "mysql+pymysql://airflow_user:AirflowTiktok2026!@localhost:3306/tiktok_oltp"
    engine = create_engine(conn_str)
    
    update_query = """
    UPDATE tracked_accounts 
    SET tracking_type = 'own' 
    WHERE user_id = 1 AND influencer_id = 6761346695965180929
    """
    
    check_query = """
    SELECT ta.user_id, ta.influencer_id, i.unique_id, ta.tracking_type
    FROM tracked_accounts ta
    JOIN influencers i ON ta.influencer_id = i.influencer_id
    WHERE ta.user_id = 1 AND ta.influencer_id = 6761346695965180929
    """
    
    try:
        with engine.begin() as conn:
            conn.execute(text(update_query))
        print("Update executed successfully.")
        
        # Verify the update
        df = pd.read_sql(check_query, engine)
        print("=== VERIFY OWN ACCOUNT UPDATE ===")
        print(df)
    except Exception as e:
        print(f"Error executing update: {e}")

if __name__ == "__main__":
    main()
