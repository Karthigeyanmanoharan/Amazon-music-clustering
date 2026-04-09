import pandas as pd
from sqlalchemy import create_engine

engine=create_engine('postgresql://postgres:root@localhost:5432/Amazon_music_cluster')
df=pd.read_csv(r"C:\Users\ASUS\Desktop\Projects\Amazon_music_clustering\Data\cleaned data\Amazon_music_cluster_data.csv")

df.to_sql('amazon_music_cluster',con=engine,if_exists="replace",index=False)