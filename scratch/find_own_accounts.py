import pandas as pd
from sqlalchemy import create_engine

def main():
    conn_str = "mysql+pymysql://airflow_user:AirflowTiktok2026!@localhost:3306/tiktok_oltp"
    engine = create_engine(conn_str)
    
    query = """
    SELECT 
        ta.user_id,
        ta.influencer_id,
        i.unique_id,
        i.display_name,
        ta.tracking_type,
        (SELECT COUNT(*) FROM videos_echotik WHERE influencer_id = ta.influencer_id) as video_count,
        (SELECT COUNT(*) FROM ml_predictions WHERE influencer_id = ta.influencer_id AND user_id = ta.user_id) as prediction_count,
        (SELECT COUNT(*) FROM ml_engagement_forecasts WHERE influencer_id = ta.influencer_id AND user_id = ta.user_id) as forecast_count
    FROM tracked_accounts ta
    JOIN influencers i ON ta.influencer_id = i.influencer_id
    WHERE ta.user_id = 1 AND ta.tracking_type = 'own'
    """
    
    try:
        df = pd.read_sql(query, engine)
        print("=== OWN ACCOUNTS FOR USER 1 ===")
        print(df.to_string(index=False))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
