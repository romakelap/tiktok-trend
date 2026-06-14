import pandas as pd
from sqlalchemy import create_engine

def main():
    conn_str = "mysql+pymysql://airflow_user:AirflowTiktok2026!@localhost:3306/tiktok_oltp"
    engine = create_engine(conn_str)
    
    query = """
    SELECT 
        fc.influencer_id,
        i.unique_id,
        i.display_name,
        COUNT(*) as forecast_count
    FROM ml_engagement_forecasts fc
    JOIN influencers i ON fc.influencer_id = i.influencer_id
    GROUP BY fc.influencer_id, i.unique_id, i.display_name
    ORDER BY forecast_count DESC
    """
    
    try:
        df = pd.read_sql(query, engine)
        print("=== ACCOUNTS WITH FORECAST DATA ===")
        print(df.to_string(index=False))
    except Exception as e:
        print(f"Error querying database: {e}")

if __name__ == "__main__":
    main()
