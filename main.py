from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import uvicorn

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
conn = psycopg2.connect(host="localhost",
                        database="Amazon_music_cluster",
                        user="postgres",
                        password="root",
                        port="5432")


@app.get("/cluster-count")
def overview_chart1():
    cur=conn.cursor()
    query=""" SELECT CLUSTER_NAME, COUNT(*) AS CNT FROM AMAZON_MUSIC_CLUSTER
              GROUP BY CLUSTER_NAME
              ORDER BY CNT DESC;"""
    
    cur.execute(query)
    rows=cur.fetchall()
    cur.close()
    clusters= [row[0] for row in rows]
    counts= [row[1] for row in rows]

    return {"clusters":clusters,"counts":counts}


@app.get("/top-features")
def overview_chart2():
    cur=conn.cursor()
    query="""select avg(energy) as energy,
		avg(speechiness) as speechiness,
		avg(acousticness) as acousticness,
		avg(instrumentalness) as instrumentalness,
        cluster_name from AMAZON_MUSIC_CLUSTER
group by cluster_name
order by cluster_name;"""
    cur.execute(query)
    rows=cur.fetchall()
    cur.close()
    
    clusters=[row[4] for row in rows]

    energy = [row[0] for row in rows]
    speechiness = [row[1] for row in rows]
    acousticness = [row[2] for row in rows]
    instrumentalness = [row[3] for row in rows]

    return {
        "clusters": clusters,
        "features": ["Energy", "Speechiness", "Acousticness", "Instrumentalness"],
        "values": [energy, speechiness, acousticness, instrumentalness]
    }


@app.get('/feature-data')
def get_feature_data(feature:str):
    cur=conn.cursor()
    query=f"""select {feature} from AMAZON_MUSIC_CLUSTER"""
    cur.execute(query)
    rows=cur.fetchall()
    cur.close()

    values=[row[0] for row in rows]

    return {"values":values}


@app.get("/correlation")
def correlation_matrix():
    import pandas as pd

    query = "SELECT danceability, energy, loudness, speechiness, acousticness FROM AMAZON_MUSIC_CLUSTER"
    df = pd.read_sql(query, conn)

    corr = df.corr()

    return {
        "z": corr.values.tolist(),
        "labels": corr.columns.tolist()
    }


@app.get("/pca-scatter")
def pca():
    cur=conn.cursor()
    query="""SELECT * FROM PCA_VALUES;"""
    
    cur.execute(query)
    rows=cur.fetchall()
    cur.close()
    pca_1= [row[0] for row in rows]
    pca_2= [row[1] for row in rows]
    clusters= [row[2] for row in rows]

    return {"pca_1":pca_1,"pca_2":pca_2,"clusters":clusters}


@app.get("/search-songs")
def search_songs(query: str):
    cur = conn.cursor()

    cur.execute("""
        SELECT name_song
        FROM AMAZON_MUSIC_CLUSTER
        WHERE name_song ILIKE %s
        LIMIT 10;
    """, (f"%{query}%",))

    rows = cur.fetchall()
    cur.close()

    return [row[0] for row in rows]


@app.get("/recommend")
def recommend(song: str):
    cur = conn.cursor()

    # Get cluster
    cur.execute("""
        SELECT cluster_name
        FROM AMAZON_MUSIC_CLUSTER
        WHERE name_song = %s
        LIMIT 1;
    """, (song,))

    result = cur.fetchone()

    if not result:
        return {"recommendations": []}

    cluster = result[0]

    # Get top 10 by popularity
    cur.execute("""
        SELECT name_song, popularity_rank
        FROM AMAZON_MUSIC_CLUSTER
        WHERE cluster_name = %s
          AND name_song != %s
        ORDER BY popularity_rank asc
        LIMIT 10;
    """, (cluster, song))

    rows = cur.fetchall()
    cur.close()

    return {
        "recommendations": [
            {"track": r[0], "popularity": r[1]}
            for r in rows
        ]
    }
