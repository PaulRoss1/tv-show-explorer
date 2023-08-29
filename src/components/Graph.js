import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import ReactSwitch from "react-switch";

const OMDB_API_URL = "http://www.omdbapi.com/";
const OMDB_API_KEY = "8ea4c4c5";

export default function Graph(props) {
  const [errorInfo, setErrorInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chart, setChart] = useState(null);
  const [episode, setEpisode] = useState({});
  const [chartType, setChartType] = useState("line");
  const [extraInfo, setExtraInfo] = useState({});
  const [lineRatingsData, setLineRatingsData] = useState([]);

  const barRatingsData = [...lineRatingsData]
    .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating))
    .slice(0, 20);

  const { searchedShow, showData, setShowData } = props;

  useEffect(() => {
    const retrieveExtraInfo = async (id) => {
      let url = `https://www.omdbapi.com/?i=${id}&apikey=ed39c59`;

      try {
        const response = await axios.get(url);
        const data = response.data;

        setExtraInfo({
          image: data.Poster.replace("_V1_SX300.jpg", "_V1_SX500.jpg"),
          plot: data.Plot,
          released: data.Released,
          runtime: data.Runtime,
        });

        if (data.Error) {
          console.log("error");
        }
      } catch (error) {
        console.error(error);
      }
    };
    retrieveExtraInfo(episode.id);
  }, [episode]);

  useEffect(() => {
    chart && chart.destroy();
    const handleSearch = async () => {
      setIsLoading(true);
      setErrorInfo("");
      try {
        const response = await axios.get(OMDB_API_URL, {
          params: {
            apikey: OMDB_API_KEY,
            t: searchedShow,
            type: "series",
          },
        });

        if (response.Error) {
          setErrorInfo("No results found.");
          chart && chart.destroy();
        } else {
          setShowData(response.data);
          chart && chart.destroy();
        }
      } catch (error) {
        setErrorInfo("An error occurred while fetching the data.");
        console.error(error);
      }
    };
    searchedShow.length > 0 && handleSearch();
  }, [searchedShow]);

  useEffect(() => {
    const getRatingsData = async (showData) => {
      let ratingsData = [];
      for (let i = 1; i <= showData.totalSeasons; i++) {
        const seasonData = await fetchSeasonData(showData.Title, i);

        for (let j = 0; j < seasonData["Episodes"].length; j++) {
          const rating = seasonData["Episodes"][j]["imdbRating"];
          if (rating === "N/A") {
            try {
              const avgRating =
                (parseFloat(seasonData["Episodes"][j - 1]["imdbRating"]) +
                  parseFloat(seasonData["Episodes"][j + 1]["imdbRating"])) /
                2;

              ratingsData.push({
                title: seasonData["Episodes"][j]["Title"],
                released: seasonData["Episodes"][j]["Released"],
                imdbRating: avgRating,
                id: seasonData["Episodes"][j]["imdbID"],
                season: i,
                episode: j,
              });
            } catch (error) {
              console.log(error.message);
            }
          } else {
            ratingsData.push({
              title: seasonData["Episodes"][j]["Title"],
              released: seasonData["Episodes"][j]["Released"],
              imdbRating: rating,
              id: seasonData["Episodes"][j]["imdbID"],
              season: i,
              episode: j,
            });
          }
        }
      }

      setLineRatingsData(ratingsData);
      setIsLoading(false);
    };

    const fetchSeasonData = async (title, season) => {
      const response = await axios.get(OMDB_API_URL, {
        params: {
          apikey: OMDB_API_KEY,
          t: title,
          Season: season,
        },
      });
      return response.data;
    };

    getRatingsData(showData);
  }, [showData]);

  useEffect(() => {
    chart && chart.destroy();
    if (chartType === "line") {
      renderChart("line", lineChartData, lineChartOptions);
    } else {
      renderChart("bar", barChartData, barChartOptions);

      setEpisode(barRatingsData[0]);
    }
  }, [lineRatingsData, chartType]);

  const lineChartData = {
    labels: lineRatingsData.map((item) => {
      const formattedSeason = item.season.toString().padStart(2, "0");
      const formattedEpisode = item.episode.toString().padStart(2, "0");
      return `${item.title} (S${formattedSeason}E${formattedEpisode})`;
    }),
    datasets: [
      {
        label: "Episode Rating",
        data: lineRatingsData.map((item) => parseFloat(item.imdbRating)),
        pointBackgroundColor: "white",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 500);
          gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
          gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
          gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
          return gradient;
        },
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        fill: true,
        moreData: lineRatingsData,
      },
    ],
  };

  const lineChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          labelColor: function (context) {
            return {
              borderColor: "#000",
              backgroundColor: "#000",
              borderWidth: 0,
            };
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(200, 200, 200, 0.08)",
          lineWidth: 1,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(200, 200, 200, 0.08)",
          lineWidth: 1,
        },
        beginAtZero: true,
      },
    },
    point: {
      backgroundColor: "white",
    },
  };

  const barChartData = {
    labels: barRatingsData.map((item) => {
      const formattedSeason = item.season.toString().padStart(2, "0");
      const formattedEpisode = item.episode.toString().padStart(2, "0");
      return `${item.title} (S${formattedSeason}E${formattedEpisode})`;
    }),
    datasets: [
      {
        label: "Episode Rating",
        data: barRatingsData.map((item) => parseFloat(item.imdbRating)),
        pointBackgroundColor: "white",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(1000, 0, 0, 0);
          gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
          gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
          gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
          return gradient;
        },
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        moreData: barRatingsData,
      },
    ],
  };

  const barChartOptions = {
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        display: false,
        callbacks: {
          labelColor: function (context) {
            return {
              borderColor: "#000",
              backgroundColor: "#000",
              borderWidth: 0,
            };
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(200, 200, 200, 0.08)",
          lineWidth: 1,
        },
      },
      y: {
        grid: {
          color: "rgba(200, 200, 200, 0.08)",
          lineWidth: 1,
        },
        ticks: {
          display: false,
        },
      },
    },
    point: {
      backgroundColor: "white",
    },
  };

  const renderChart = (chartType, chartData, chartOptions) => {
    if (searchedShow.length > 0) {
      const ctx = document.getElementById("myChart").getContext("2d");

      const hoverValue = {
        id: "hoverValue",

        afterDatasetDraw(chart) {
          const { data } = chart;
          let episodeData = data.datasets[0].moreData;

          try {
            setEpisode(episodeData[chart.getActiveElements()[0].index]);
          } catch (error) {
            // console.error("error");
          }
        },
      };

      const newChart = new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: chartOptions,
        plugins: [hoverValue],
      });

      setChart(newChart);
    }
  };

  const toggleChart = () => {
    setChartType((current) => (current === "line" ? "bar" : "line"));
  };

  return (
    <div className="graph">
      <span className="graph__error">{errorInfo}</span>

      {isLoading && <div className="graph__loading">Loading..</div>}

      {chart && (
        <ReactSwitch
          checked={true}
          onChange={toggleChart}
          className="graph__switch"
        />
      )}
      {chartType === "bar" ? (
        <div className="graph__bar-container">
          <canvas className="graph__bar" id="myChart"></canvas>
          <div className="graph__info">
            <div className="graph__image-container">
              <img className="graph__image" src={extraInfo.image} />
            </div>
            <br />
            <span>
              {episode.title}{" "}
              {"(S" +
                episode.season?.toString().padStart(2, "0") +
                "E" +
                episode.episode?.toString().padStart(2, "0") +
                ")"}
            </span>
            <br />
            <span>
              {episode.imdbRating} <span className="graph__info-star">★</span>
            </span>
            <br></br>
            <span>{extraInfo.runtime}</span>
            <br />
            <span>Episode aired {extraInfo.released}</span>
            <br />
            <span className="graph__info-plot">{extraInfo.plot}</span>
            <br />
          </div>
        </div>
      ) : (
        <canvas className="graph__line" id="myChart"></canvas>
      )}
    </div>
  );
}
