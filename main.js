const buttons= document.querySelectorAll(".nav-btn");

buttons.forEach(function(btn){
    btn.addEventListener("click", function(){
        const target = this.getAttribute("data-target");

        document.querySelectorAll(".section").forEach(function(sec){
            sec.style.display = "none";
        });

    document.getElementById(target).style.display = "block";


        if (target === "Analysis") {
            const defaultFeature = drop_features.value;

            setTimeout(() => {
                hist_box_values(defaultFeature);
                boxplot_box_values(defaultFeature);
                loadHeatmap();
            }, 100);
        }
        
        if (target === "Visualization") {
            setTimeout(() => {
                pca_scatter();
            }, 100);
        }

        if (target === "Evaluation") {
            setTimeout(() => {
                elbow_method();
            }, 100);
        }
    });
});



function loadOverviewchart1data(){
    fetch("http://127.0.0.1:8000/cluster-count")
    .then(response => response.json())
    .then(data => {
        const trace = {
            x:data.clusters,
            y:data.counts,
            type:"bar",
            marker:{
                color:data.counts,
                color: ["#8b5cf6", "#6366f1", "#3b82f6", "#06b6d4"]
            }
        };

        const layout = {
    title: {
        text: "Songs per Cluster",
        font: {
            color: "white",
            size: 26
        }
    },
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    plot_bgcolor: "rgba(0, 0, 0, 0)",
    font: {
        color: "white",
        size: 14
    },
    xaxis: {
        title: "Clusters",
        color: "white",
        gridcolor: "rgba(255, 255, 255, 0.2)",
        zerolinecolor: "rgba(255, 255, 255, 0.34)"
    },
    yaxis: {
        title: "Counts",
        color: "white",
        gridcolor: "rgba(255, 255, 255, 0.22)",
        zerolinecolor: "rgba(255, 255, 255, 0)"
    },
    margin: { l: 60, r: 20, t: 60, b: 80 }
};
        
        Plotly.newPlot("cluster_distribution",[trace],layout);

    })

 
}


function loadOverviewchart2data(){
    fetch("http://127.0.0.1:8000/top-features")
    .then(response => response.json())
    .then(data => {
        const trace1 = {
            x:data.clusters,
            y:data.values[0],
            type:"bar",
            name:"energy",
            marker:{
                color:data.values,
                color: ["#8b5cf6","#8b5cf6", "#8b5cf6", "#8b5cf6"]
            }
        };
        const trace2 = {
            x:data.clusters,
            y:data.values[1],
            type:"bar",
            name:"speechiness",
            marker:{
                color:data.values,
                color: ["#ff00ff", "#ff00ff", "#ff00ff", "#ff00ff"]
            }
        };
        const trace3 = {
            x:data.clusters,
            y:data.values[2],
            type:"bar",
            name:"acousticness",
            marker:{
                color:data.values,
                color: ["#f59e0b", "#f59e0b", "#f59e0b", "#f59e0b"]
            }
        };
        const trace4 = {
            x:data.clusters,
            y:data.values[3],
            type:"bar",
            name:"instrumentalnes",
            marker:{
                color:data.values,
                color: ["#22c55e", "#22c55e", "#22c55e","#22c55e"]
            }
        };
        

        const layout = {
    title: {
        text: "Top features per cluster",
        font: {
            color: "white",
            size: 26
        }
    },
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    plot_bgcolor: "rgba(0, 0, 0, 0)",
    font: {
        color: "white",
        size: 14
    },
    xaxis: {
        title: "Clusters",
        color: "white",
        gridcolor: "rgba(255, 255, 255, 0.2)",
        zerolinecolor: "rgba(255, 255, 255, 0.34)"
    },
    yaxis: {
        title: "Average",
        color: "white",
        gridcolor: "rgba(255, 255, 255, 0.22)",
        zerolinecolor: "rgba(255, 255, 255, 0)"
    },
    margin: { l: 60, r: 20, t: 60, b: 80 },
    barmode:'group'
};
        
        Plotly.newPlot("top_features_per_cluster",[trace1,trace2,trace3,trace4],layout);

    })

 
}

loadOverviewchart1data();

loadOverviewchart2data();
document.querySelector(".nav-btn").click();



const drop_features=document.getElementById("dropfeature");

drop_features.addEventListener("change", function(){
        const drop_target = this.value;
        console.log("Selected feature:", drop_target);
        hist_box_values(drop_target); 
        boxplot_box_values(drop_target);
    });


function hist_box_values(drop_target){
    fetch(`http://127.0.0.1:8000/feature-data?feature=${encodeURIComponent(drop_target)}`)
    .then(response => response.json())
    .then(data => {
        const trace1 ={
            x:data.values,
            type:"histogram",
            marker:{
                color:data.values,
                color:"#8b5cf6"
            }
        }

        const layout = {
    title: {
        text: `${drop_target} Distribution`,
        font: {
            color: "white",
            size: 26
        }
    },
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    plot_bgcolor: "rgba(0, 0, 0, 0)",
    font: {
        color: "white",
        size: 14
    },
    xaxis: {
        color: "white",
        gridcolor: "rgba(255, 255, 255, 0.2)",
        zerolinecolor: "rgba(255, 255, 255, 0.08)"
    },
    yaxis: {
        color: "white",
        gridcolor: "rgba(255, 255, 255, 0.22)",
        zerolinecolor: "rgba(255, 255, 255, 0)"
    },

    margin: { l: 60, r: 20, t: 60, b: 80 }
};
    Plotly.react("feature-hist",[trace1],layout);

    })
}



function boxplot_box_values(drop_target){
    fetch(`http://127.0.0.1:8000/feature-data?feature=${encodeURIComponent(drop_target)}`)
    .then(response => response.json())
    .then(data => {
        const trace1 ={
            x:data.values,
            type:"box",
            marker:{
                color:data.values,
                color:"#8b5cf6"
            }
        }

        const layout = {
    title: {
        text: `${drop_target} Boxplot`,
        font: {
            color: "white",
            size: 26
        }
    },
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    plot_bgcolor: "rgba(0, 0, 0, 0)",
    font: {
        color: "white",
        size: 14
    },
    xaxis: {
        color: "white",
        gridcolor: "rgba(255, 255, 255, 0.2)",
        zerolinecolor: "rgba(255, 255, 255, 0.08)"
    },
    yaxis: {
        color: "white",
        gridcolor: "rgba(255, 255, 255, 0.22)",
        zerolinecolor: "rgba(255, 255, 255, 0)"
    },

    margin: { l: 60, r: 20, t: 60, b: 80 }
};
    Plotly.react("feature-box",[trace1],layout);

    })
}

function loadHeatmap() {
    fetch("http://127.0.0.1:8000/correlation")
        .then(res => res.json())
        .then(data => {

            const trace = {
                z: data.z,
                x: data.labels,
                y: data.labels,
                type: "heatmap",
                colorscale:'Bluered',
                showscale: true,
                
            };

            const layout = {
                title: {
                    text: "Correlation Matrix",
                    font: { color: "white", size: 24 }
                },
                paper_bgcolor: "rgba(0,0,0,0)",
                plot_bgcolor: "rgba(0,0,0,0)",
                font: { color: "white" },
                xaxis: {
                    side: "top"
                },
                margin: { l: 120, r: 20, t: 60, b: 60 }
            };

            Plotly.react("cor-heatmap", [trace], layout, { responsive: true });
        });
}


function pca_scatter(){
    fetch("http://127.0.0.1:8000/pca-scatter")
    .then(response => response.json())
    .then(data => {
        const trace1 ={
            x:data.pca_1,
            y:data.pca_2,
            mode:"markers",
            type:"scatter",
            marker:{
                    size: 8,
                    color: data.cluster,
                    colorscale: "Viridis",
                    showscale: true,
                    opacity: 0.8
            }
        }

        const layout = {
    title: {
        text: "PCA scatter plot",
        font: {
            color: "white",
            size: 26
        }
    },
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    plot_bgcolor: "rgba(0, 0, 0, 0)",
    font: {
        color: "white",
        size: 14
    },
    xaxis: {
        color: "white",
        gridcolor: "rgba(255, 255, 255, 0.2)",
        zerolinecolor: "rgba(255, 255, 255, 0.08)"
    },
    yaxis: {
        color: "white",
        gridcolor: "rgba(255, 255, 255, 0.22)",
        zerolinecolor: "rgba(255, 255, 255, 0)"
    },

    margin: { l: 60, r: 20, t: 60, b: 80 }
};
    Plotly.react("pca",[trace1],layout, { responsive: true });

    })
}


function elbow_method(){
        const trace1 ={
            x:[1,2,3,4,5,6,7,8,9,10],
            y:[42697.53414613098,
 31296.192297506495,
 27415.19674382321,
 20518.080375487836,
 18256.043028370845,
 16451.526829036717,
 15084.431350738232,
 14637.12204447654,
 13921.916498717945,
 13349.253650624922],
            mode:"lines+markers",
            marker:{
                    size:15
            },
            line: {
    color: 'rgb(255, 255, 255)',
    width: 2
  }
        }

        const layout = {
    title: {
        text: "Elbow Method",
        font: {
            color: "white",
            size: 26
        }
    },
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    plot_bgcolor: "rgba(0, 0, 0, 0)",
    font: {
        color: "white",
        size: 14
    },
    xaxis: {
        title:"Number of clusters",
        color: "white",
        gridcolor: "rgba(255, 255, 255, 0.2)",
        zerolinecolor: "rgba(255, 255, 255, 0.08)"
    },
    yaxis: {
        title:"Inertia",
        color: "white",
        gridcolor: "rgba(255, 255, 255, 0.22)",
        zerolinecolor: "rgba(255, 255, 255, 0)"
    },

    margin: { l: 60, r: 20, t: 60, b: 80 }
};
    Plotly.newPlot("elbow",[trace1],layout, { responsive: true });

    }


    
const input = document.getElementById("song-input");
const suggestions = document.getElementById("suggestions");
const tableBody = document.querySelector("#recommend-table tbody");

// 🔍 SEARCH SONGS
input.addEventListener("input", async function () {
    const query = this.value;

    if (query.length < 2) {
        suggestions.innerHTML = "";
        return;
    }

    const res = await fetch(
        `http://127.0.0.1:8000/search-songs?query=${encodeURIComponent(query)}`
    );

    const data = await res.json();

    suggestions.innerHTML = "";

    data.forEach(song => {
        const div = document.createElement("div");
        div.textContent = song;
        div.className = "suggest-item";

        // 👉 CLICK SONG
        div.addEventListener("click", () => {
            input.value = song;
            suggestions.innerHTML = "";

            loadRecommendations(song);
        });

        suggestions.appendChild(div);
    });
});


// 🎵 LOAD RECOMMENDATIONS
async function loadRecommendations(song) {
    const res = await fetch(
        `http://127.0.0.1:8000/recommend?song=${encodeURIComponent(song)}`
    );

    const data = await res.json();

    renderTable(data.recommendations);
}


// 📊 RENDER TABLE
function renderTable(songs) {
    tableBody.innerHTML = "";

    songs.forEach((song, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${song.track}</td>
            <td>⭐ ${song.popularity}</td>
        `;

        tableBody.appendChild(row);
    });
}

