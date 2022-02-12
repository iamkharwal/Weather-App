/** @format */

let key = "09e040c6c1c954be06a5237bdec5d1e3";
document.getElementById("aside").style.display = "none";
document.getElementById("sidebar").style.display = "none";
document.getElementById("footer").style.display = "none";
var wrap = document.getElementById("wrap");

function getWeather1() {
  let mapKey = "AIzaSyCv3AIJAWZdBRz1B5s_l4yrg9aqtx1hRIo";
  var cityName = document.getElementById("city").value;
  let mapUrl = `https://www.google.com/maps/embed/v1/place?key=${mapKey}&q=${cityName}`;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}&units=metric`;

  //fetch data
  async function getData() {
    try {
      let res = await fetch(url);
      let data = await res.json();
      displayData(data, mapUrl);
      console.log(data);
      // temp = Math.round(temp - 273);
      // console.log('temp: ', temp + "C");
    } catch (err) {
      console.log("err: ", err);
      noInfo();
    }
  }
  getData();
}

//get current location

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(function (success) {
    let { latitude, longitude } = success.coords;
  });
}

//display weather
function displayData(data, mapUrl) {
  let lat = data.coord.lat;
  let lon = data.coord.lon;
  wrap.textContent = "";
  let forcasturl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${key}&units=metric`;

  fetch(forcasturl)
    .then(function (data) {
      return data.json();
    })
    .then(function (res) {
      forcast(res.daily);
    });

  function forcast(res) {
    wrap.textContent = "";
    let card = "";
    res.map(function (day, id) {
      if (id == 0) {
        card += `
                    <div class="card first">
                        <div id="imgS">
                            <img src="http://openweathermap.org/img/wn/${
                              day.weather[0].icon
                            }@2x.png" alt="">
                        </div>
                        <div class="info">
                            <h3>${window
                              .moment(day.dt * 1000)
                              .format("ddd")}</h3>
                            <p style="text-transform:uppercase">${
                              day.weather[0].description
                            }</p>
                            <p>Night: ${day.temp.night}<sup>o</sup>C</p>
                        <p>Day: ${day.temp.day}<sup>o</sup>C</p>
                        </div>
                     </div>`;
      } else {
        card += `
                <div class="card">
                <h3>${window.moment(day.dt * 1000).format("ddd")}</h3>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="">
                <p style="text-transform:uppercase;border:1px dotted white">${
                  day.weather[0].main
                }</p>
                <p>Night: ${day.temp.night}<sup>o</sup>C</p>
                <p>Day: ${day.temp.day}<sup>o</sup>C</p>
                  </div>`;
      }
    });
    wrap.innerHTML = card;
  }

  document.getElementById("aside").style.display = "block";
  document.getElementById("sidebar").style.display = "block";
  setTimeout(function () {
    document.getElementById("footer").style.display = "block";
  }, 2000);

  document.querySelector("iframe").setAttribute("src", mapUrl);

  document.getElementById("humidity").textContent = data.main.humidity + "%";
  document.getElementById("pressure").textContent = data.main.pressure;
  document.getElementById("maxtemp").innerHTML =
    Math.round(data.main.temp_max) + "<sup>o</sup>C";
  document.getElementById("mintemp").innerHTML =
    Math.round(data.main.temp_min) + "<sup>o</sup>C";
  document.getElementById("wind").textContent = data.wind.speed;
  document.getElementById("gust").textContent = data.wind.gust;
  document.getElementById("place").textContent = data.name;
  document.getElementById("time").textContent = new Date().toLocaleString();
  document.getElementById("temperature").innerHTML =
    Math.round(data.main.temp_max) + "<sup>o</sup>C";
  document.getElementById("weather").textContent = data.weather[0].main;

  if (data.weather[0].main == "Clouds") {
    document.getElementById("logo").setAttribute("src", "./img/clouds.png");
  } else if (data.weather[0].main == "Clear") {
    document.getElementById("logo").setAttribute("src", "./img/clear.png");
  } else if (
    data.weather[0].main == "Smoke" ||
    data.weather[0].main == "Haze"
  ) {
    document.getElementById("logo").setAttribute("src", "./img/haze.png");
  } else if (data.weather[0].main == "Rain") {
    document.getElementById("logo").setAttribute("src", "./img/rain.png");
  }
}

function noInfo() {
  document.getElementById("aside").style.display = "none";
  document.getElementById("sidebar").style.display = "none";
  document.getElementById("footer").style.display = "none";
  setTimeout(function () {
    alert("No result Found!!");
  }, 2000);
}
