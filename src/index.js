async function getWeather() {
    // var
    const token = "mVIz4OT8xX54RwGMC8KvBG5xC1IkDXhc";
    const weatherApi = "dataservice.accuweather.com";
    const checkboxHourly = document.getElementById("isHourly");
    const checkboxDetail = document.getElementById("isDetails");
    const metricCelcus = document.getElementById("celMet");
    const resultDiv = document.getElementById("result");

    // delete old res
    if (document.getElementById("res")) {
        resultDiv.removeChild(document.getElementById("res"));
    }

    let isHourly = checkboxHourly.checked;
    let isDetails = checkboxDetail.checked;
    let metric = metricCelcus.checked;
    let city = document.getElementById("cityName").value;
    let zipCode = document.getElementById("zipCode").value;

    // request city
    let urlCity = "";
    if (zipCode == "") {
        urlCity = "https://" + weatherApi + "/locations/v1/cities/search?apikey=" + token + "&q=" + city;
    } else {
        urlCity = "https://" + weatherApi + "/locations/v1/cities/search?apikey=" + token + "&q=" + zipCode;
    }
    
    const responseCity = await fetch(urlCity);
    const CityJson = await responseCity.json();

    if (CityJson != undefined) {

        // br
        let br = document.createElement("br");
    
        if (isHourly) {
            // request weather from city
            let urlWeather = "https://"+weatherApi+"/forecasts/v1/hourly/12hour/" + CityJson[0].Key + "?apikey=" + token + "&details=true&metric=" + metric;
            const response = await fetch(urlWeather);
            const weatherJson = await response.json();
        
            // insert res
            let divRes = document.createElement('div');
            divRes.setAttribute("id", "res");
            resultDiv.appendChild(divRes);
            let titleCity = document.createElement("h2");
            let titleCityC = null
            if (city == "") {
                titleCityC = document.createTextNode("Weather for zip code : " + zipCode);
            } else {
                titleCityC = document.createTextNode("Weather for city " + city);
            }
            titleCity.appendChild(titleCityC);
            divRes.appendChild(titleCity);
            let hourNumber = weatherJson.length;
            for (i=0;hourNumber > i;i++) {
                let date = new Date(weatherJson[i].DateTime);
                let hour = date.getHours();
        
                // Title section
                let hourTitle = document.createElement("h3");
                let titleContent = document.createTextNode(hour + "h00");
                hourTitle.appendChild(titleContent);
                
                // info probarain section
                let probarain = document.createElement("p");
                let probarainText = document.createTextNode(
                    "Probability of rainning : " + weatherJson[i].RainProbability
                );
                probarain.appendChild(probarainText);
        
                // info temp
                let temp = document.createElement("p");
                let tempText = document.createTextNode(
                    "Temperature : " + weatherJson[i].Temperature.Value + "°" + weatherJson[i].Temperature.Unit
                );
                temp.appendChild(tempText);
        
                // info weather
                let weather = document.createElement("p");
                let weatherCodeGet = weatherJson[i].IconPhrase;
                let weatherText = document.createTextNode(
                    "Weather : " + weatherCodeGet
                );
                weather.appendChild(weatherText);
        
                // Append content to body
                divRes.appendChild(hourTitle);
                divRes.appendChild(probarain);
                divRes.appendChild(temp);
                divRes.appendChild(weather);
                if (isDetails) {
                    let detailsDoc = document.createElement("details");

                    let detailSummary = document.createElement("summary");
                    let detailSummaryText = document.createTextNode("Details");
                    detailSummary.appendChild(detailSummaryText);

                    detailsDoc.appendChild(detailSummary);

                    // Real Feel Temperature
                    let RFTemp = document.createElement("p");
                    let RFTempText = document.createTextNode(
                        "Real feel temperature : " + weatherJson[i].RealFeelTemperature.Value + "°" + weatherJson[i].RealFeelTemperature.Unit
                    );
                    RFTemp.appendChild(RFTempText);
                    detailsDoc.appendChild(RFTemp);

                    // Rain precipitaion in mm
                    let rainPrec = document.createElement("p");
                    let rainPrecText = document.createTextNode(
                        "Rain precipitaion : " + weatherJson[i].Rain.Value + " " + weatherJson[i].Rain.Unit
                    );
                    rainPrec.appendChild(rainPrecText);
                    detailsDoc.appendChild(rainPrec);

                    // Wind
                    let wind = document.createElement("p");
                    let windText = document.createTextNode(
                        "Wind : " + weatherJson[i].Wind.Speed.Value + " " + weatherJson[i].Wind.Speed.Unit
                    );
                    wind.appendChild(windText);
                    detailsDoc.appendChild(wind);

                    divRes.appendChild(detailsDoc);
                }
                divRes.appendChild(br);
            }
            
        } else { // Hourly = false
            // request weather from city
            let urlWeather = "https://"+weatherApi+"/forecasts/v1/daily/1day/" + CityJson[0].Key + "?apikey=" + token + "&details=true&metric=" + metric;

            const response = await fetch(urlWeather);
            const weatherJson = await response.json();

            // insert res
            let divRes = document.createElement('div');
            divRes.setAttribute("id", "res");
            resultDiv.appendChild(divRes);
            let titleCity = document.createElement("h2");
            let titleCityC = null
            if (city == "") {
                titleCityC = document.createTextNode("Weather for zip code : " + zipCode);
            } else {
                titleCityC = document.createTextNode("Weather for city " + city);
            }
            titleCity.appendChild(titleCityC);
            divRes.appendChild(titleCity);

            let date = new Date(weatherJson.DailyForecasts[0].Date);
            

            // Title section
            let dayTitle = document.createElement("h3");
            let dayContent = document.createTextNode("Date : " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear());
            dayTitle.appendChild(dayContent);

            //Text weather
            let weather = document.createElement("p");
            let weatherCodeGet = weatherJson.Headline.Text;
            let weatherText = document.createTextNode(
                "Weather : " + weatherCodeGet
            );
            weather.appendChild(weatherText);

            // Temp max
            let maxTemp = document.createElement("p");
            let maxTempText = document.createTextNode(
                "Max temperature : " + weatherJson.DailyForecasts[0].Temperature.Maximum.Value + "°" + weatherJson.DailyForecasts[0].Temperature.Maximum.Unit
            );
            maxTemp.appendChild(maxTempText);

            //Temp min
            let minTemp = document.createElement("p");
            let minTempText = document.createTextNode(
                "Max temperature : " + weatherJson.DailyForecasts[0].Temperature.Minimum.Value + "°" + weatherJson.DailyForecasts[0].Temperature.Minimum.Unit
            );
            minTemp.appendChild(minTempText);

            divRes.appendChild(weather);
            divRes.appendChild(br);
            divRes.appendChild(dayTitle);
            divRes.appendChild(maxTemp);
            divRes.appendChild(minTemp);
            if (isDetails) {
                let detailsDoc = document.createElement("details");

                let detailSummary = document.createElement("summary");
                let detailSummaryText = document.createTextNode("Details");
                detailSummary.appendChild(detailSummaryText);

                detailsDoc.appendChild(detailSummary);

                // PrecipitationProbability
                let probaRain = document.createElement("p");
                let probaRainText = document.createTextNode(
                    "Rain probability : " + weatherJson.DailyForecasts[0].Day.PrecipitationProbability
                );
                probaRain.appendChild(probaRainText);
                detailsDoc.appendChild(probaRain);

                // Rain precipitaion in mm
                let rainMm = document.createElement("p");
                let rainMmText = document.createTextNode(
                    "Rain precipitaion : " + weatherJson.DailyForecasts[0].Day.Rain.Value + " " + weatherJson.DailyForecasts[0].Day.Rain.Unit
                );
                rainMm.appendChild(rainMmText);
                detailsDoc.appendChild(rainMm);

                // wind
                let wind = document.createElement("p");
                let windText = document.createTextNode(
                    "Wind : " + weatherJson.DailyForecasts[0].Day.Wind.Speed.Value + " " + weatherJson.DailyForecasts[0].Day.Wind.Speed.Unit
                );
                wind.appendChild(windText);
                detailsDoc.appendChild(wind);

                divRes.appendChild(detailsDoc);
            }
        }
    } else {
        let divRes = document.createElement('div');
        divRes.setAttribute("id", "res");
        resultDiv.appendChild(divRes);
        let titleCity = document.createElement("h2");
        let titleCityC = document.createTextNode("City doesn't exist");
        titleCity.appendChild(titleCityC);
        divRes.appendChild(titleCity);
    }
}