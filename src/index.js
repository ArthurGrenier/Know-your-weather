function getToken() {
    const token = "mVIz4OT8xX54RwGMC8KvBG5xC1IkDXhc";
    return token;
}

function getWeatherApi() {
    const weatherApi = "dataservice.accuweather.com";
    return weatherApi;
}

function getCheckboxHourly() {
    const checkboxHourly = document.getElementById("isHourly");
    return checkboxHourly;
}

function getCheckboxDetail() {
    const checkboxDetail = document.getElementById("isDetails");
    return checkboxDetail;
}

function getMetricCelcus() {
    const metricCelcus = document.getElementById("celMet");
    return metricCelcus;
}

function getResultDiv() {
    const resultDiv = document.getElementById("result");
    return resultDiv;
}

async function getWeather() {
    
    // delete old res
    if (document.getElementById("res")) {
        getResultDiv().removeChild(document.getElementById("res-title"))
        getResultDiv().removeChild(document.getElementById("res"));
    }

    let isHourly = getCheckboxHourly().checked;
    let metric = getMetricCelcus().checked;
    let city = document.getElementById("cityName").value;
    let zipCode = document.getElementById("zipCode").value;

    // request city
    let urlCity = "";
    if (zipCode == "") {
        urlCity = "https://" + getWeatherApi() + "/locations/v1/cities/search?apikey=" + getToken() + "&q=" + city;
    } else {
        urlCity = "https://" + getWeatherApi() + "/locations/v1/cities/search?apikey=" + getToken() + "&q=" + zipCode;
    }

    const responseCity = await fetch(urlCity);
    const CityJson = await responseCity.json();

    if (CityJson != undefined) {

        // br
        let divResGlobal = document.createElement("div");
        divResGlobal.setAttribute("id", "res");    

        if (isHourly) {
            // request current hour
            let urlCurrentHour = "https://" + getWeatherApi() + "/currentconditions/v1/" + CityJson[0].Key + "?apikey=" + getToken() + "&details=true&metric=" + metric;
            const responseCurrent = await fetch(urlCurrentHour);
            const weatherCurrentJson = await responseCurrent.json();

            // insert res
            let divRes = document.createElement('div');
            divRes.setAttribute("id", "res-title");
            getResultDiv().appendChild(divRes);

            // Title
            let titleCity = document.createElement("h2");
            let titleCityC = null
            if (city == "") {
                titleCityC = document.createTextNode(zipCode + " - Weather");
            } else {
                titleCityC = document.createTextNode(city + " - Weather");
            }
            titleCity.appendChild(titleCityC);
            divRes.appendChild(titleCity);

            divResGlobal.appendChild(CurrentWeatherHTML(weatherCurrentJson));
            getResultDiv().appendChild(divResGlobal);

            // request weather from city
            let urlWeather = "https://" + getWeatherApi() + "/forecasts/v1/hourly/12hour/" + CityJson[0].Key + "?apikey=" + getToken() + "&details=true&metric=" + metric;
            const response = await fetch(urlWeather);
            const weatherJson = await response.json();

            let hourNumber = weatherJson.length;

            for (i = 0; hourNumber > i; i++) {
                divResGlobal.appendChild(HourlyWeatherHTML(weatherJson, i));
                getResultDiv().appendChild(divResGlobal);
            }

        } else { // Hourly = false
            // request weather from city
            let urlWeather = "https://" + getWeatherApi() + "/forecasts/v1/daily/1day/" + CityJson[0].Key + "?apikey=" + getToken() + "&details=true&metric=" + metric;

            const response = await fetch(urlWeather);
            const weatherJson = await response.json();

            // insert res
            let divRes = document.createElement('div');
            divRes.setAttribute("id", "res-title");
            getResultDiv().appendChild(divRes);
            let titleCity = document.createElement("h2");
            let titleCityC = null
            if (city == "") {
                titleCityC = document.createTextNode(zipCode + " - Weather");
            } else {
                titleCityC = document.createTextNode(city + " - Weather");
            }
            titleCity.appendChild(titleCityC);
            divRes.appendChild(titleCity);

            divResGlobal.appendChild(DailyWeatherHTML(weatherJson));
            getResultDiv().appendChild(divResGlobal);
        }
    } else {
        let divRes = document.createElement('div');
        divRes.setAttribute("id", "res");
        getResultDiv().appendChild(divRes);
        let titleCity = document.createElement("h2");
        let titleCityC = document.createTextNode("City doesn't exist");
        titleCity.appendChild(titleCityC);
        divRes.appendChild(titleCity);
    }
}

window.onscroll = function () {
    const mybutton = document.getElementById("topButton");

    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
} 

function CurrentWeatherHTML(jsonResponse) {
    let isDetails = getCheckboxDetail().checked;

    let divRes = document.createElement("div");
    divRes.setAttribute("class", "one-result");

    // Current hour
    let date = new Date(jsonResponse[0].LocalObservationDateTime);
    let hour = date.getHours();
    let minute = date.getMinutes();

    // Title section
    let hourTitle = document.createElement("h3");
    let titleContent = document.createTextNode(hour + "h" + minute);
    hourTitle.appendChild(titleContent);
    divRes.appendChild(hourTitle);    
    
    // info probarain section
    let probarain = document.createElement("p");
    let probarainText = document.createTextNode(
        "Is rainning : " + jsonResponse[0].HasPrecipitation
    );
    probarain.appendChild(probarainText);
    divRes.appendChild(probarain);

    // info temp
    let temp = document.createElement("p");
    let tempText;
    if (jsonResponse[0].Temperature.Metric.Value <= 0) {
        temp.setAttribute("class", "negative");
        tempText = document.createTextNode(
            "/WARNING\\ Temperature : " + jsonResponse[0].Temperature.Metric.Value + "°" + jsonResponse[0].Temperature.Metric.Unit
        );
    } else {
        temp.setAttribute("class", "positive");
        tempText = document.createTextNode(
            "Temperature : " + jsonResponse[0].Temperature.Metric.Value + "°" + jsonResponse[0].Temperature.Metric.Unit
        );
    }
    temp.appendChild(tempText);
    divRes.appendChild(temp); 

    // info weather
    let weather = document.createElement("p");
    let weatherCodeGet = jsonResponse[0].WeatherText;
    let weatherText = document.createTextNode(
        "Weather : " + weatherCodeGet
    );
    weather.appendChild(weatherText);
    divRes.appendChild(weather);

    // weather icon
    let icon = new Image();
    icon.src = "./src/img/" + jsonResponse[0].WeatherIcon + ".png";
    divRes.appendChild(icon);
    
    if (isDetails) {
        let detailsDoc = document.createElement("details");

        let detailSummary = document.createElement("summary");
        let detailSummaryText = document.createTextNode("Details");
        detailSummary.appendChild(detailSummaryText);

        detailsDoc.appendChild(detailSummary);

        // Real Feel Temperature
        let RFTemp = document.createElement("p");
        let RFTempText = document.createTextNode(
            "Real feel temperature : " + jsonResponse[0].RealFeelTemperature.Metric.Value + "°" + jsonResponse[0].RealFeelTemperature.Metric.Unit
        );
        RFTemp.appendChild(RFTempText);
        detailsDoc.appendChild(RFTemp);

        // Rain precipitaion in mm
        let rainPrec = document.createElement("p");
        let rainPrecText = document.createTextNode(
            "Rain precipitaion : " + jsonResponse[0].PrecipitationSummary.Precipitation.Metric.Value + " " + jsonResponse[0].PrecipitationSummary.Precipitation.Metric.Unit
        );
        rainPrec.appendChild(rainPrecText);
        detailsDoc.appendChild(rainPrec);

        // Wind
        let wind = document.createElement("p");
        let windText = document.createTextNode(
            "Wind : " + jsonResponse[0].Wind.Speed.Metric.Value + " " + jsonResponse[0].Wind.Speed.Metric.Unit
        );
        wind.appendChild(windText);
        detailsDoc.appendChild(wind);

        divRes.appendChild(detailsDoc);
    }
    
    return divRes;
}

function HourlyWeatherHTML(jsonResponse, i) {
    let isDetails = getCheckboxDetail().checked;

    let divRes = document.createElement("div");
    divRes.setAttribute("class", "one-result");

    
    let date = new Date(jsonResponse[i].DateTime);
    let hour = date.getHours();

    // Title section
    let hourTitle = document.createElement("h3");
    let titleContent = document.createTextNode(hour + "h00");
    hourTitle.appendChild(titleContent);
    divRes.appendChild(hourTitle);

    // info probarain section
    let probarain = document.createElement("p");
    let probarainText = document.createTextNode(
        "Probability of rainning : " + jsonResponse[i].RainProbability
    );
    probarain.appendChild(probarainText);
    divRes.appendChild(probarain);

    // info temp
    let temp = document.createElement("p");
    let tempText;
    if (jsonResponse[i].Temperature.Value <= 0) {
        temp.setAttribute("class", "negative");
        tempText = document.createTextNode(
            "/WARNING\\ Temperature : " + jsonResponse[i].Temperature.Value + "°" + jsonResponse[i].Temperature.Unit
        );
    } else {
        temp.setAttribute("class", "positive");
        tempText = document.createTextNode(
            "Temperature : " + jsonResponse[i].Temperature.Value + "°" + jsonResponse[i].Temperature.Unit
        );
    }

    temp.appendChild(tempText);
    divRes.appendChild(temp);

    // info weather
    let weather = document.createElement("p");
    let weatherCodeGet = jsonResponse[i].IconPhrase;
    let weatherText = document.createTextNode(
        "Weather : " + weatherCodeGet
    );
    weather.appendChild(weatherText);
    divRes.appendChild(weather);

    // weather icon
    let icon = new Image();
    icon.src = "./src/img/" + jsonResponse[i].WeatherIcon + ".png";
    divRes.appendChild(icon);

    if (isDetails) {
        let detailsDoc = document.createElement("details");

        let detailSummary = document.createElement("summary");
        let detailSummaryText = document.createTextNode("Details");
        detailSummary.appendChild(detailSummaryText);

        detailsDoc.appendChild(detailSummary);

        // Real Feel Temperature
        let RFTemp = document.createElement("p");
        let RFTempText = document.createTextNode(
            "Real feel temperature : " + jsonResponse[i].RealFeelTemperature.Value + "°" + jsonResponse[i].RealFeelTemperature.Unit
        );
        RFTemp.appendChild(RFTempText);
        detailsDoc.appendChild(RFTemp);

        // Rain precipitaion in mm
        let rainPrec = document.createElement("p");
        let rainPrecText = document.createTextNode(
            "Rain precipitaion : " + jsonResponse[i].Rain.Value + " " + jsonResponse[i].Rain.Unit
        );
        rainPrec.appendChild(rainPrecText);
        detailsDoc.appendChild(rainPrec);

        // Wind
        let wind = document.createElement("p");
        let windText = document.createTextNode(
            "Wind : " + jsonResponse[i].Wind.Speed.Value + " " + jsonResponse[i].Wind.Speed.Unit
        );
        wind.appendChild(windText);
        detailsDoc.appendChild(wind);

        divRes.appendChild(detailsDoc);
    }
    
    return divRes;
}

function DailyWeatherHTML(jsonResponse) {
    let isDetails = getCheckboxDetail().checked;
    
    let divRes = document.createElement("div");
    divRes.setAttribute("class", "one-result");


    let date = new Date(jsonResponse.DailyForecasts[0].Date);

    //Text weather
    let weather = document.createElement("p");
    let weatherCodeGet = jsonResponse.Headline.Text;
    let weatherText = document.createTextNode(
        "Weather : " + weatherCodeGet
    );
    weather.appendChild(weatherText);
    divRes.appendChild(weather);

    // Title section
    let dayTitle = document.createElement("h3");
    let dayContent = document.createTextNode("Date : " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear());
    dayTitle.appendChild(dayContent);
    divRes.appendChild(dayTitle);

    // Temp max/min
    let maxTemp = document.createElement("p");
    let maxTempText = document.createTextNode(
        "Temperature : " + jsonResponse.DailyForecasts[0].Temperature.Maximum.Value + "°" + jsonResponse.DailyForecasts[0].Temperature.Maximum.Unit + " / " +
        jsonResponse.DailyForecasts[0].Temperature.Minimum.Value + "°" + jsonResponse.DailyForecasts[0].Temperature.Minimum.Unit
    );
    maxTemp.appendChild(maxTempText);
    divRes.appendChild(maxTemp);

    if (jsonResponse.DailyForecasts[0].Temperature.Minimum.Value <= 0) {
        let minTempWarning = document.createElement("p");
        let minTempWarningText;
        minTempWarning.setAttribute("class", "negative");
        minTempWarningText = document.createTextNode("/WARNING\\ Minimum temperature is negative !");
        minTempWarning.appendChild(minTempWarningText);
        divRes.appendChild(minTempWarning);
    }

    // Icon day
    let iconDay = new Image();
    iconDay.src = "./src/img/" + jsonResponse.DailyForecasts[0].Day.Icon + ".png";

    // Icon night
    let iconNight = new Image();
    iconNight.src = "./src/img/" + jsonResponse.DailyForecasts[0].Night.Icon + ".png";

    let divIcon = document.createElement("div");
    divIcon.appendChild(iconDay);
    divIcon.appendChild(iconNight);
    divRes.appendChild(divIcon);

    if (isDetails) {
        let detailsDoc = document.createElement("details");

        let detailSummary = document.createElement("summary");
        let detailSummaryText = document.createTextNode("Details");
        detailSummary.appendChild(detailSummaryText);

        detailsDoc.appendChild(detailSummary);

        // PrecipitationProbability
        let probaRain = document.createElement("p");
        let probaRainText = document.createTextNode(
            "Rain probability : " + jsonResponse.DailyForecasts[0].Day.PrecipitationProbability
        );
        probaRain.appendChild(probaRainText);
        detailsDoc.appendChild(probaRain);

        // Rain precipitaion in mm
        let rainMm = document.createElement("p");
        let rainMmText = document.createTextNode(
            "Rain precipitaion : " + jsonResponse.DailyForecasts[0].Day.Rain.Value + " " + jsonResponse.DailyForecasts[0].Day.Rain.Unit
        );
        rainMm.appendChild(rainMmText);
        detailsDoc.appendChild(rainMm);

        // wind
        let wind = document.createElement("p");
        let windText = document.createTextNode(
            "Wind : " + jsonResponse.DailyForecasts[0].Day.Wind.Speed.Value + " " + jsonResponse.DailyForecasts[0].Day.Wind.Speed.Unit
        );
        wind.appendChild(windText);
        detailsDoc.appendChild(wind);

        divRes.appendChild(detailsDoc);
    }

    return divRes;
}