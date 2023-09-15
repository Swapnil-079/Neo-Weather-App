"use strict";

const currLocation = document.querySelector(".locationText");
const time = document.querySelector(".time");
const temperatue = document.querySelector(".currTemp");
const currWeather = document.querySelector(".currWeather");
const pressure = document.querySelector(".pressureValue");
const rain = document.querySelector(".rainValue");
const wind = document.querySelector(".windValue");
const tabWind = document.querySelector(".l3wind");
const tabRain = document.querySelector(".l3rain");
const tabPressure = document.querySelector(".l3pressure");
const tabUv = document.querySelector(".l3uv");

const feelLike = document.querySelector(".feels-like-temp");
const humidity = document.querySelector(".humidity-percent");
const sunrise = document.querySelector(".sunrise-time");
const sunset = document.querySelector(".sunset-time");

const date1 = document.querySelector(".day-1-text-line-2");
const date2 = document.querySelector(".day-2-text-line-2");
const date3 = document.querySelector(".day-3-text-line-2");
const date4 = document.querySelector(".day-4-text-line-2");

const day2 = document.querySelector(".day-2-text-line-1");
const day3 = document.querySelector(".day-3-text-line-1");
const day4 = document.querySelector(".day-4-text-line-1");

const temp1min = document.querySelector(".day-1-temp-min");
const temp1max = document.querySelector(".day-1-temp-max");
const temp2min = document.querySelector(".day-2-temp-min");
const temp2max = document.querySelector(".day-2-temp-max");
const temp3min = document.querySelector(".day-3-temp-min");
const temp3max = document.querySelector(".day-3-temp-max");
const temp4min = document.querySelector(".day-4-temp-min");
const temp4max = document.querySelector(".day-4-temp-max");

const img1 = document.querySelector(".day-1-img");
const img2 = document.querySelector(".day-2-img");
const img3 = document.querySelector(".day-3-img");
const img4 = document.querySelector(".day-4-img");

const enterLocation = document.querySelector(".searchBar");
const form = document.querySelector(".form");
const topSection = document.querySelector(".topSection");
const middleSection = document.querySelector(".middleSection");
const bottomSection = document.querySelector(".bottomSection");
const rightSection = document.querySelector(".rightSection");
const leftSection = document.querySelector(".leftSection");
const errorText = document.querySelector(".errorText");

let cardTime = document.querySelectorAll(".card-time");
let cardTemp = document.querySelectorAll(".card-temperature");
let cardPicture = document.querySelectorAll(".card-picture");

const tempChart = document.querySelector(".temperature-chart");
const windChart = document.querySelector(".windchart");
const rainChart = document.querySelector(".rainchart");
const pressureChart = document.querySelector(".pressurechart");
const uvChart = document.querySelector(".uvchart");

const loader = document.querySelector(".preloader");
window.addEventListener("load", () => {
  loader.style.display = "none";
});

let data;
let data1;
let currHour;
let chartDrawn = false;
let api;

//using session Storage for storing api keys
sessionStorage.setItem("api1","D5LvYcIK8GYHnEhrBh1rOsLiCuNipsW6");
sessionStorage.setItem("api2","q0LxDhaXYiKxuZhmZOzQFg5HFFTzObuV");

// Switching api key if api limit is hit
if(sessionStorage.getItem("limitReached")==='true')
{api=sessionStorage.getItem("api2");}else{
  api=sessionStorage.getItem('api1')
}

// function for getting current hour
const gethours = function () {
  const d = new Date();
  currHour = d.getHours();
};
gethours();

// clock
setInterval(() => {
  const d = new Date();
  const hour = d.getHours();
  const min = d.getMinutes();

  
  if (currHour != hour) {
    currHour = hour; // updating current hour if hour has changed 
    weather(data1);
  }

  time.textContent = `${hour < 10 ? `0${hour}` : hour}:${
    min < 10 ? `0${min}` : min
  }`;
}, 1000);

// listening event for form (search location)
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let inputLocation = enterLocation.value;
  console.log(enterLocation.value);

  const weather1 = async function (enteredLocation) {
    try {
      const res = await fetch(
        `https://api.tomorrow.io/v4/weather/forecast?location=${enteredLocation}&apikey=${api}`
      );
      if (!res.ok) {
        throw new Error("Bad response", {
          cause: {
            res,
          },
        });
      }
      data = await res.json();
      console.log(data);
      updateUI(data);
      currLocation.textContent = `${inputLocation}`;
    } catch (err) {
      switch (err.cause.res?.status) {
        case 400:
          errorText.textContent = `Location not Found`;
          break;

        case 404:
          errorText.textContent = `Location not Found`;
          break;

        case 429:
          errorText.textContent = `API Limit reached, try after sometime`;
          sessionStorage.setItem('limitReached','true');
          console.log('limit Reached');
          break;

        case 500:
          errorText.textContent = `Service is currently unavailable,try after sometime`;
          break;
      }
    }
  };

  weather1(enterLocation.value);
});

// Prompt user for permission to access their location
navigator.geolocation.getCurrentPosition(
  // Success callback function
  (position) => {
    // Get the user's latitude and longitude coordinates
    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    
    loader.style.display = "block";
    console.log(`Latitude: ${lat}, longitude: ${long}`);

    

    getLocation(lat, long);

    // loader.style.display='none';
    // leftSection.style.opacity = 100;
    // topSection.style.opacity = 100;
    // middleSection.style.opacity = 100;
    // bottomSection.style.opacity = 100;
    // rightSection.style.opacity = 100;
  },
  // if location access is refused
  (error) => {
    loader.style.display = "none";
    leftSection.style.opacity = 100;
    topSection.style.opacity = 100;
    
  }
);

const getLocation = async function (lat, long) {
  const ress = await fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=4387f8351a604022ab71912397b550bd`
  );
  data1 = await ress.json();
  console.log(data1);
  currLocation.textContent = `${data1.features[0].properties["city"]}`;
  weather(data1);
};
const weather = async function (data1) {
  try {
    const res = await fetch(
      `https://api.tomorrow.io/v4/weather/forecast?location=${data1.features[0].properties["city"]}&apikey=${api}`
    );
    if (!res.ok) {
      throw new Error("Bad response", {
        cause: {
          res,
        },
      });
    }
    data = await res.json();
    console.log(data);
    loader.style.display = "none";
    updateUI(data);
  } catch (err) {
    loader.style.display = "none";
    leftSection.style.opacity = 100;
    topSection.style.opacity = 100;

    switch (err.cause.res?.status) {
      case 400:
        errorText.textContent = `Location not Found`;
        break;

      case 404:
        errorText.textContent = `Location not Found`;
        break;

      case 429:
        errorText.textContent = `API Limit reached, try after sometime`;
        sessionStorage.setItem('limitReached','true');
        console.log('limit Reached');
        break;

      case 500:
        errorText.textContent = `Service is currently unavailable,try after sometime`;
        break;
    }
  }
};

const updateUI = function (data) {
  temperatue.textContent = `${Math.round(
    data.timelines.hourly[0].values["temperature"]
  )}°`;
  pressure.textContent = `${Math.round(
    data.timelines.daily[0].values["pressureSurfaceLevelMax"]
  )} hpa`;
  rain.textContent = `${Math.round(
    data.timelines.daily[0].values["precipitationProbabilityAvg"]
  )}%`;
  wind.textContent = `${Math.round(
    data.timelines.daily[0].values["windSpeedAvg"] * 3.6
  )} km/h`;

  if (data.timelines.hourly[0].values["precipitationProbability"] >= 80) {
    currWeather.textContent = `Rain`;
    middleSection.style.backgroundImage = `url('rain.jpg')`;
  } else if (data.timelines.hourly[0].values["cloudCover"] >= 90) {
    currWeather.textContent = `Overcast`;
    middleSection.style.backgroundImage = `url('cloudy-dark.jpg')`;
  } else if (data.timelines.hourly[0].values["cloudCover"] >= 70) {
    currWeather.textContent = `Cloudy`;
    middleSection.style.backgroundImage = `url('cloudy.jpg')`;
  } else if (data.timelines.hourly[0].values["cloudCover"] <= 30) {
    currWeather.textContent = `Clear`;
    middleSection.style.backgroundImage = `url('clear-sky.jpg')`;
  } else {
    currWeather.textContent = `Mostly Clear`;
    middleSection.style.backgroundImage = `url('clear-sky.jpg')`;
  }

  tabWind.textContent = `${Math.round(
    data.timelines.hourly[0].values["windSpeed"] * 3.6
  )} km/h`; // multiplying by 3.6 as speed is in m/s
  tabRain.textContent = `${Math.round(
    data.timelines.hourly[0].values["precipitationProbability"]
  )}%`;
  tabPressure.textContent = `${Math.round(
    data.timelines.hourly[0].values["pressureSurfaceLevel"]
  )} hpa`;
  tabUv.textContent = `${Math.round(
    data.timelines.hourly[0].values["uvIndex"]
  )}`;

  feelLike.textContent = `${Math.round(
    data.timelines.hourly[0].values["temperatureApparent"]
  )}°`;
  humidity.textContent = `${Math.round(
    data.timelines.hourly[0].values["humidity"]
  )}%`;
  sunrise.textContent = `${gettime(
    data.timelines.daily[0].values["sunriseTime"]
  )}`;
  sunset.textContent = `${gettime(
    data.timelines.daily[0].values["sunsetTime"]
  )}`;

  temp1min.textContent = `${Math.round(
    data.timelines.daily[1].values["temperatureMin"]
  )} `;
  temp2min.textContent = `${Math.round(
    data.timelines.daily[2].values["temperatureMin"]
  )} `;
  temp3min.textContent = `${Math.round(
    data.timelines.daily[3].values["temperatureMin"]
  )} `;
  temp4min.textContent = `${Math.round(
    data.timelines.daily[4].values["temperatureMin"]
  )} `;

  temp1max.textContent = ` ${Math.round(
    data.timelines.daily[1].values["temperatureMax"]
  )}`;
  temp2max.textContent = ` ${Math.round(
    data.timelines.daily[2].values["temperatureMax"]
  )}`;
  temp3max.textContent = ` ${Math.round(
    data.timelines.daily[3].values["temperatureMax"]
  )}`;
  temp4max.textContent = ` ${Math.round(
    data.timelines.daily[4].values["temperatureMax"]
  )}`;

  img1.src = `${getImageDay(data.timelines.daily[1].values)}`;
  img2.src = `${getImageDay(data.timelines.daily[2].values)}`;
  img3.src = `${getImageDay(data.timelines.daily[3].values)}`;
  img4.src = `${getImageDay(data.timelines.daily[4].values)}`;

  date1.textContent = `${getdate(data.timelines.daily[1].time)}`;
  date2.textContent = `${getdate(data.timelines.daily[2].time)}`;
  date3.textContent = `${getdate(data.timelines.daily[3].time)}`;
  date4.textContent = `${getdate(data.timelines.daily[4].time)}`;

  day2.textContent = `${getday(data.timelines.daily[2].time)}`;
  day3.textContent = `${getday(data.timelines.daily[3].time)}`;
  day4.textContent = `${getday(data.timelines.daily[4].time)}`;

  
  cardTime.forEach((item, i) => {
    item.textContent = `${(currHour + i) % 24}:00`;
  });

  cardTemp.forEach((item, i) => {
    item.textContent = `${Math.round(
      data.timelines.hourly[0 + i].values["temperature"]
    )}°`;
  });

  cardPicture.forEach((item, i) => {
    if (((currHour + i) % 24) >= 19 || ((currHour + i) % 24) < 5) {
      item.src = `${getCardImageNight(data.timelines.hourly[0 + i].values)}`;
    } else {
      item.src = `${getCardImageDay(data.timelines.hourly[0 + i].values)}`;
    }
  });

  leftSection.style.opacity = 100;
  topSection.style.opacity = 100;
  middleSection.style.opacity = 100;
  bottomSection.style.opacity = 100;
  rightSection.style.opacity = 100;

  if (!chartDrawn) { // checking if chart is drawn
    renderTempChart(data);
    rederRainChart(data);

    renderWindGuage(
      Math.round(data.timelines.hourly[0].values["windSpeed"] * 3.6)
    );

    renderPressureGuage(
     ( Math.round(data.timelines.hourly[0].values["pressureSurfaceLevel"]) % 650)/4
    ); // consedering pressure range 650-1050 , then dividing the value by 4 for getting a number between 0-100 

    renderUVchart(data);
    chartDrawn = true;
  } else {
    // clearing the previous drawn chart
    rainchart.destroy();
    windchart.destroy();
    pressurechart.destroy();
    uvchart.destroy();
    tempchart.destroy();

    // drawing new chart
    renderTempChart(data);
    rederRainChart(data);

    renderWindGuage(
      Math.round(data.timelines.hourly[0].values["windSpeed"] * 3.6),

    );

    renderPressureGuage(
     ( Math.round(data.timelines.hourly[0].values["pressureSurfaceLevel"]) % 650)/4

    );

    renderUVchart(data);
    chartDrawn = true;
  }
};

//function for getting the image according to data
const getImageDay = function (input) {
  if (input["precipitationProbabilityMax"] >= 70) {
    return `./pictures/thunderstorm.png`;
  } else if (input["cloudCoverAvg"] >= 85) {
    return `./pictures/overcast.png`;
  } else if (input["cloudCoverAvg"] >= 65) {
    return `./pictures/cloudy-day.png`;
  } else {
    return `./pictures/sunny.png`;
  }
};

//function for getting the card image for night according to data
const getCardImageNight = function (input) {
  if (input["precipitationProbability"] >= 85) {
    return `./pictures/rain.png`;
  } else if (input["precipitationProbability"] >= 70) {
    return `./pictures/thunderstorm.png`;
  } else if (input["cloudCover"] >= 85) {
    return `./pictures/overcast.png`;
  } else if (input["cloudCover"] >= 65) {
    return `./pictures/cloudy night.png`;
  } else {
    return `./pictures/clear-night.png`;
  }
};
//function for getting the card image for day according to data
const getCardImageDay = function (input) {
  if (input["precipitationProbability"] >= 85) {
    return `./pictures/rain.png`;
  } else if (input["precipitationProbability"] >= 70) {
    return `./pictures/thunderstorm.png`;
  } else if (input["cloudCover"] >= 85) {
    return `./pictures/overcast.png`;
  } else if (input["cloudCover"] >= 65) {
    return `./pictures/cloudy-day.png`;
  } else {
    return `./pictures/sunny.png`;
  }
};

// time obtain from api is in Zulu time format so changing it in IST
const gettime = function (input) {
  const d = new Date(
    `${input.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`
  );

  return `${d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()}:${
    d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
  }`;
};

// function for obtaining date from Zulu time
const getdate = function (input) {
  const d = new Date(
    `${input.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`
  );
  
  let month;
  const date = d.getDate();
  const monthCount = d.getMonth();

  switch (monthCount) {
    case 0:
      month = "Jan";
      break;
    case 1:
      month = "Feb";
      break;
    case 2:
      month = "Mar";
      break;
    case 3:
      month = "Apr";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "Jun";
      break;
    case 6:
      month = "Jul";
      break;
    case 7:
      month = "Aug";
      break;
    case 8:
      month = "Sep";
      break;
    case 9:
      month = "Oct";
      break;
    case 10:
      month = "Nov";
      break;
    case 11:
      month = "Dec";
      break;
  }

  // since IST is GMT + 5:30 
  if (currHour < 6) {
    return `${date+1} ${month}`;
  }

  return `${date} ${month}`;
};

//function for obtaining day
const getday = function (input) {
  const d = new Date(
    `${input.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`
  );
  let day;
  let dayCount = d.getDay();

  if (currHour < 6) {
    dayCount = (dayCount + 1) % 7;
  }

  switch (dayCount) {
    case 0:
      day = "Sunday";
      break;

    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
      break;
  }
  return day;
};

// function for rain chart (doughnut)
let rainchart;
const rederRainChart = function (data) {


  const rainChartData = {
    labels: ["Rain chances", "No rain"],
    data: [
      data.timelines.hourly[0].values["precipitationProbability"],
      100 - data.timelines.hourly[0].values["precipitationProbability"],
    ],
  };

  let rainChance;
  if (data.timelines.hourly[0].values["precipitationProbability"] > 75) {
    rainChance = "High";
  } else {
    rainChance =
      data.timelines.hourly[0].values["precipitationProbability"] < 45
        ? `Low`
        : `Medium`;
  }

  const doughnutLabel = {
    id: "doughnutLabel",
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const { ctx, data } = chart;
      ctx.save();
      const xCor = chart.getDatasetMeta(0).data[0].x;
      const yCor = chart.getDatasetMeta(0).data[0].y;
      ctx.font = " 20px Roboto ";
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${rainChance}`, xCor, yCor);
    },
  };

  rainchart = new Chart(rainChart, {
    type: "doughnut",

    data: {
      labels: rainChartData.labels,
      datasets: [
        {
          data: rainChartData.data,
          cutout: "88%",
          backgroundColor: ["rgb(7, 33, 145)", "rgb(112, 174, 255)"],
        },
      ],
    },
    options: {
      aspectRatio: 1,
      borderWidth: 0,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
    plugins: [doughnutLabel],
  });
};

//function for wind chart (guage)
let windchart;
const renderWindGuage = function (input) {
  windchart = new Chart(windChart, {
    type: "doughnut",

    data: {
      labels: [`Wind Speed`, ""],
      datasets: [
        {
          data: [input, 100 - input],
          circumference: 225,
          rotation: 250,
          cutout: "88%",
          backgroundColor: ["rgb(7, 33, 145)", "rgb(112, 174, 255)"],
        },
      ],
    },
    options: {
      borderRadius: 3,
      borderWidth: 0,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: { enabled: false },
      },
    },
  });
};

//function for pressure chart (guage)
let pressurechart;
const renderPressureGuage = function (input) {
  pressurechart = new Chart(pressureChart, {
    type: "doughnut",

    data: {
      labels: [`Pressure`, ""],
      datasets: [
        {
          data: [input, 100 - input],
          circumference: 225,
          rotation: 250,
          cutout: "88%",
          backgroundColor: ["rgb(7, 33, 145)", "rgb(112, 174, 255)"],
        },
      ],
    },
    options: {
      borderRadius: 3,
      borderWidth: 0,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: { enabled: false },
      },
    },
  });
};

//function for uv chart (linear gradient guage)
let uvchart;
const renderUVchart = function (data) {
  const chartData = {
    labels: ["", "", ""],
    data: [33, 33, 33],
  };

  let uv;
  if (data.timelines.hourly[0].values["uvIndex"] >= 6) {
    uv = "High";
  } else {
    uv = data.timelines.hourly[0].values["uvIndex"] <= 2 ? `Low` : `Medium`;
  }

  const doughnutLabel = {
    id: "doughnutLabel",
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const { ctx, data } = chart;
      ctx.save();
      const xCor = chart.getDatasetMeta(0).data[0].x;
      const yCor = chart.getDatasetMeta(0).data[0].y;
      ctx.font = " 20px Roboto ";
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${uv}`, xCor, yCor);
    },
  };
  const ctx = uvChart.getContext("2d");
  var gradient = ctx.createLinearGradient(0, 0, 200, 0);
  gradient.addColorStop(0, "green");
  gradient.addColorStop(0.4, "yellow");
  gradient.addColorStop(0.8, "red");

  uvchart = new Chart(uvChart, {
    type: "doughnut",

    data: {
      labels: chartData.labels,
      datasets: [
        {
          // fillColor : gradient,
          data: chartData.data,

          circumference: 225,
          rotation: 250,
          cutout: "90%",
          backgroundColor: [gradient],
        },
      ],
    },
    options: {
      borderRadius: 1,
      borderWidth: 0,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: { enabled: false },
      },
    },
    plugins: [doughnutLabel],
  });
};

//function for temperature chart (line chart)
let tempchart;
const renderTempChart = function (input) {
  const tempData = {
    label: [
      `${currHour}:00`,
      `${(currHour + 4) % 24}:00`,
      `${(currHour + 8) % 24}:00`,
      `${(currHour + 12) % 24}:00`,
    ],
    data: [
      Math.round(input.timelines.hourly[0].values["temperature"]),
      Math.round(input.timelines.hourly[0 + 4].values["temperature"]),
      Math.round(input.timelines.hourly[0 + 8].values["temperature"]),
      Math.round(input.timelines.hourly[0 + 12].values["temperature"]),
    ],
  };

  Chart.defaults.font.size = 15;
  tempchart = new Chart(tempChart.getContext("2d"), {
    type: "line",
    data: {
      labels: tempData.label,
      datasets: [
        {
          label: "temperature",
          data: tempData.data,
          backgroundColor: ["white"],
          borderColor: ["white"],
          borderWidth: 2,
          borderRadius: 5,
        },
      ],
    },
    options: {
      tension: 0.5,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            color: "black",
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            display: false,
            color: "white",
          },
        },
      },
    },
  });
};
