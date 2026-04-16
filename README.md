# 🎧 Amazon Music Clustering Dashboard

## 🚀 Project Overview

This project focuses on clustering Amazon Music songs based on their audio features using **unsupervised machine learning (K-Means)**.
The goal is to automatically group similar songs and simulate a **music recommendation system**.

---

## 🎯 Problem Statement

Music platforms contain millions of songs, making manual categorization into genres or moods inefficient.
This project solves that problem by grouping songs based on their **audio characteristics** such as energy, danceability, and tempo.

---

## 🧠 Approach

### 🔹 Data Preprocessing

* Removed unnecessary columns (IDs, text fields)
* Handled missing values
* Cleaned dataset for modeling

### 🔹 Feature Selection

Used key audio features:

* danceability
* energy
* loudness
* speechiness
* acousticness
* instrumentalness
* liveness
* valence
* tempo
* duration_ms

### 🔹 Feature Scaling

* Applied **MinMaxScaler**

### 🔹 Clustering

* Used **K-Means Clustering**
* Determined optimal clusters using:

  * Elbow Method
  * Silhouette Score

### 🔹 Dimensionality Reduction

* Applied **PCA (Principal Component Analysis)** for visualization

---

## 📊 Visualizations

* 📈 Elbow Method (Optimal cluster selection)
* 📉 PCA Scatter Plot (Cluster visualization)
* 📊 Cluster Distribution
* 📊 Feature Comparison by Cluster

---

## 🎶 Cluster Insights

| Cluster   | Description                                 |
| --------- | ------------------------------------------- |
| Cluster 0 | High energy, danceable → Party songs        |
| Cluster 1 | High acousticness, low energy → Chill music |
| Cluster 2 | Balanced features → Pop songs               |
| Cluster 3 | High instrumentalness → Background music    |

---

## 🎯 Evaluation Metrics

* **Silhouette Score:** 0.318
* **Davies-Bouldin Index:** 1.181

---

## 🔁 Recommendation System

Songs are recommended based on:

* Same cluster (similar audio profile)
* Sorted by **popularity rank**

👉 Example:

* Input: Song A
* Output: Top similar songs from same cluster

---

## 💼 Business Use Cases

* 🎵 Personalized Playlist Generation
* 🔍 Song Recommendation Systems
* 📊 User Listening Pattern Analysis
* 🎧 Music Segmentation

---

## 🛠️ Tech Stack

* Python
* Pandas, NumPy
* Scikit-learn
* Plotly
* Html,Css,Js
* Fastapi
 

---

## 📂 Project Structure

```
Amazon music clustering/
│
├── eda.ipynb
├──etl.py
├── README.md
└── Data/
    └── cleaned data/
        └── Amazon_music_cluster_data.csv
├──main.py
├──index.html
├──style.css
├──main.js
```

---

## ▶️ How to Run

```bash
pip install -r requirements.txt
streamlit run app.py
```

---

## 📌 Key Highlights

* End-to-end ML project
* Unsupervised learning implementation
* Interactive dashboard using Html,css,js
* Business-focused insights

---

## 🏁 Conclusion

This project demonstrates how clustering can be used to automatically group songs and enhance recommendation systems.
It replicates real-world use cases used in platforms like Spotify and Amazon Music.

---

## ⭐ Author

**KARTHIGEYAN M**

---

## 💡 Future Improvements

* Add deep learning models
* Real-time recommendation system
* Deploy on cloud (AWS)
