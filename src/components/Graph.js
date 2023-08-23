import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import ReactSwitch from "react-switch";

const OMDB_API_URL = "http://www.omdbapi.com/";
const OMDB_API_KEY = "8ea4c4c5";

export default function Graph(props) {
  const [chart, setChart] = useState(null);
  const [episode, setEpisode] = useState({});
  const [chartType, setChartType] = useState("line");

  const [episodeImage, setEpisodeImage] = useState("");
  const [episodePlot, setEpisodePlot] = useState("");
  const [extraInfo, setExtraInfo] = useState({});

  const { setIsLoading, setErrorInfo, xxx, setSuggestions, show, setShow } =
    props;

  useEffect(() => {
    const fetchUrl = async (id) => {
      let url = `https://www.omdbapi.com/?i=${id}&apikey=ed39c59`;

      try {
        const response = await axios.get(url);
        const data = response.data;

        setEpisodeImage(data.Poster.replace("_V1_SX300.jpg", "_V1_SX500.jpg"));
        setEpisodePlot(data.Plot);

        setExtraInfo({
          image: data.Poster.replace("_V1_SX300.jpg", "_V1_SX500.jpg"),
          plot: data.Plot,
          released: data.Released,
          runtime: data.Runtime,
        });

        if (data.Error) {
          console.log("errr");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUrl(episode.id);
  }, [episode]);

  useEffect(() => {
    const handleSearch = async () => {
      setIsLoading(true);
      setErrorInfo("");
      try {
        const response = await axios.get(OMDB_API_URL, {
          params: {
            apikey: OMDB_API_KEY,
            t: xxx,
            type: "series",
          },
        });
        setShow(response.data);
        const data = response.data;
        if (data.Error) {
          setErrorInfo("No results found.");
          chart && chart.destroy();
        } else {
          const ratingsData = await getRatingsData(data);
          chart && chart.destroy();
          chartType === "line"
            ? renderLineChart(ratingsData)
            : renderBarChart(ratingsData);
        }
      } catch (error) {
        setErrorInfo("An error occurred while fetching the data.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    handleSearch();
  }, [xxx, chartType]);

  const getRatingsData = async (data) => {
    let ratingsData = [];
    for (let i = 1; i <= data.totalSeasons; i++) {
      const seasonData = await fetchSeasonData(data.Title, i);

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

    if (chartType === "bar") {
      ratingsData = ratingsData.sort(
        (a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating)
      );

      ratingsData = ratingsData.slice(0, 20);
    }

    setSuggestions([]);

    console.log("ratingsData: " + ratingsData);

    return ratingsData;
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

  const renderLineChart = (ratingsData) => {
    const imdbRatings = ratingsData.map((item) => parseFloat(item.imdbRating));
    console.log("imdbRatings: " + imdbRatings);
    console.log("ratingsData: " + JSON.stringify(ratingsData));

    const ctx = document.getElementById("myChartBar").getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 0, 500);
    gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
    gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
    gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ratingsData.map((item) => {
          const formattedSeason = item.season.toString().padStart(2, "0");
          const formattedEpisode = item.episode.toString().padStart(2, "0");
          return `${item.title} (S${formattedSeason}E${formattedEpisode})`;
        }),
        // labels: Array.from({ length: imdbRatings.length }, (_, i) => i + 1),

        datasets: [
          {
            label: "Episode Rating",
            data: imdbRatings,
            pointBackgroundColor: "white",
            backgroundColor: gradient,
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            fill: true,
            // moreData: ratingsData,
          },
        ],
      },
      options: {
        // indexAxis: "y",
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            display: true,
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
      },
    });

    setChart(newChart);
  };

  const renderBarChart = (ratingsData) => {
    const imdbRatings = ratingsData.map((item) => parseFloat(item.imdbRating));
    console.log("imdbRatings: " + imdbRatings);
    console.log("ratingsData: " + JSON.stringify(ratingsData));

    const ctx = document.getElementById("myChartBar").getContext("2d");

    const gradient = ctx.createLinearGradient(1000, 0, 0, 0);
    gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
    gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
    gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

    const hoverValue = {
      id: "hoverValue",

      afterDatasetDraw(chart) {
        const { data } = chart;
        let episodeData = data.datasets[0].moreData;

        try {
          setEpisode(episodeData[chart.getActiveElements()[0].index]);
        } catch (error) {
          console.error("error");
        }
      },
    };

    const newChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ratingsData.map((item) => {
          const formattedSeason = item.season.toString().padStart(2, "0");
          const formattedEpisode = item.episode.toString().padStart(2, "0");
          return `${item.title} (S${formattedSeason}E${formattedEpisode})`;
        }),
        datasets: [
          {
            label: "Episode Rating",
            data: imdbRatings,
            pointBackgroundColor: "white",
            backgroundColor: gradient,
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            fill: true,
            moreData: ratingsData,
          },
        ],
      },
      options: {
        indexAxis: "y",
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
      },
      plugins: [hoverValue],
    });

    setChart(newChart);
  };

  const toggleChart = () => {
    setChartType((current) => (current === "line" ? "bar" : "line"));
  };

  return (
    <div className="graph">
      <ReactSwitch
        checked={true}
        onChange={toggleChart}
        className="graph__switch"
      />

      {chartType === "bar" ? (
        <div className="graph__bar-container">
          <canvas className="graph__bar" id="myChartBar"></canvas>
          <div className="graph__info">
            <br />
            {chartType}
            <br />
            <img className="graph__image" src={extraInfo.image} />
            <br />
            <span>episode name: {episode.title}</span>
            <br />
            <span>season number {episode.season}</span>
            <br />
            <span>episode number {episode.episode}</span>
            <br />
            <span>episode rating {episode.imdbRating}</span>
            <br />
            {/* <span>release date: {episode.released}</span> */}
            <span>Released {extraInfo.released}</span>
            <br />
            <span>plot {extraInfo.plot}</span>
            <br />
            <span>Runtime {extraInfo.runtime}</span>
            <br />
          </div>
        </div>
      ) : (
        <canvas className="graph__line" id="myChartBar"></canvas>
      )}
    </div>
  );
}
