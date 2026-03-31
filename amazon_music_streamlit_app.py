import streamlit as st
import pandas as pd
import plotly.express as px
import matplotlib.pyplot as plt

from sklearn.preprocessing import MinMaxScaler
from sklearn.decomposition import PCA

# -----------------------------
# Page config
# -----------------------------
st.set_page_config(page_title="Amazon Music Clustering Dashboard", layout="wide")

st.title("🎧 Amazon Music Clustering Dashboard")

# -----------------------------
# Load dataset
# -----------------------------
df = pd.read_csv("Data/cleaned data/Amazon_music_cluster_data.csv")

st.subheader("Dataset Preview")
st.dataframe(df.head(), width="stretch")

# -----------------------------
# Use values from your EDA
# -----------------------------
silhouette_value = 0.318
davies_value = 1.181

# -----------------------------
# KPI
# -----------------------------
col1, col2, col3, col4 = st.columns(4)
col1.metric("Total Songs", len(df))
col2.metric("Clusters", df["cluster_name"].nunique())
col3.metric("Silhouette Score", silhouette_value)
col4.metric("Davies-Bouldin Index", davies_value)

# -----------------------------
# Cluster Distribution
# -----------------------------
st.subheader("Cluster Distribution")

cluster_count = df["cluster_name"].value_counts().reset_index()
cluster_count.columns = ["cluster", "count"]

fig1 = px.bar(cluster_count, x="cluster", y="count",
              color="cluster", title="Songs per Cluster")

st.plotly_chart(fig1, width="stretch")

# -----------------------------
# Feature Comparison
# -----------------------------
st.subheader("Feature Comparison")

features = ["danceability", "energy", "acousticness", "valence", "tempo"]

avg = df.groupby("cluster_name")[features].mean().reset_index()

fig2 = px.bar(avg, x="cluster_name", y=features,
              barmode="group", title="Average Features by Cluster")

st.plotly_chart(fig2, width="stretch")

# -----------------------------
# PCA Visualization
# -----------------------------
st.subheader("PCA Visualization")

pca_features = [
    "danceability", "energy", "loudness", "speechiness",
    "acousticness", "instrumentalness", "liveness",
    "valence", "tempo", "duration_ms"
]

x = df[pca_features]

scaler = MinMaxScaler()
x_scaled = scaler.fit_transform(x)

pca = PCA(n_components=2)
x_pca = pca.fit_transform(x_scaled)

pca_df = pd.DataFrame({
    "PC1": x_pca[:, 0],
    "PC2": x_pca[:, 1],
    "cluster_name": df["cluster_name"],
    "name_song": df["name_song"]
})

fig3 = px.scatter(
    pca_df,
    x="PC1",
    y="PC2",
    color="cluster_name",
    hover_data=["name_song"],
    title="PCA Clustering Visualization"
)

st.plotly_chart(fig3, width="stretch")

# -----------------------------
# Elbow Method (from your EDA)
# -----------------------------
st.subheader("Elbow Method")

k_values = range(1, 11)

# Use your inertia values (replace if needed)
inertia = [45000, 32000, 27000, 21000, 18500, 16500, 15000, 14000, 13500, 13000]

plt.figure(figsize=(6,4))
plt.plot(k_values, inertia, marker='o')
plt.title("Elbow Method")
plt.xlabel("Number of Clusters")
plt.ylabel("Inertia")

st.pyplot(plt)

# -----------------------------
# Recommendation System
# -----------------------------
st.subheader("🎶 Song Recommendation (Based on Popularity)")

song = st.selectbox("Select a song", df["name_song"].dropna().unique())

cluster = df[df["name_song"] == song]["cluster_name"].values[0]

recs = df[
    (df["cluster_name"] == cluster) &
    (df["name_song"] != song)
]

# ✅ Sort by popularity (VERY IMPORTANT)
if "popularity_rank" in recs.columns:
    recs = recs.sort_values("popularity_rank", ascending=True)

st.write(f"Top recommended songs for **{song}**:")

st.dataframe(
    recs[["name_song", "name_artists", "cluster_name", "popularity_rank"]].head(10),
    width="stretch"
)