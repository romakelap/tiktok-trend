import pandas as pd
from sqlalchemy import create_engine

def main():
    conn_str = "mysql+pymysql://airflow_user:AirflowTiktok2026!@localhost:3306/tiktok_oltp"
    engine = create_engine(conn_str)
    
    query = """
    SELECT 
        ta.user_id,
        u.email,
        ta.influencer_id,
        i.unique_id,
        i.display_name,
        ta.tracking_type,
        COUNT(DISTINCT v.video_pk) as video_count,
        COUNT(DISTINCT p.prediction_id) as prediction_count
    FROM tracked_accounts ta
    JOIN influencers i ON ta.influencer_id = i.influencer_id
    JOIN users u ON ta.user_id = u.user_id
    LEFT JOIN videos_echotik v ON v.influencer_id = ta.influencer_id
    LEFT JOIN ml_predictions p ON p.video_pk = v.video_pk AND p.user_id = ta.user_id
    WHERE ta.is_active = 1
    GROUP BY ta.user_id, u.email, ta.influencer_id, i.unique_id, i.display_name, ta.tracking_type
    HAVING video_count > 0
    ORDER BY prediction_count DESC, video_count DESC
    LIMIT 20
    """
    
    try:
        df = pd.read_sql(query, engine)
        print("=== ACCOUNTS BY USER ===")
        print(df.to_string(index=False))
    except Exception as e:
        print(f"Error querying database: {e}")

if __name__ == "__main__":
    main()
