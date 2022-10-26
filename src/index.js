async function getWeather() {
    // delete old res
    if (document.getElementById("res")) {
        document.body.removeChild(document.getElementById("res"));
    }

    // var
    const token = "mVIz4OT8xX54RwGMC8KvBG5xC1IkDXhc";
    const weatherApi = "dataservice.accuweather.com";
    let city = document.getElementById("cityName").value;
    let zipCode = document.getElementById("zipCode").value;
    const uiDiv = document.getElementById("ui");

    // request city
    let urlCity = "";
    if (zipCode == "") {
        urlCity = "http://" + weatherApi + "/locations/v1/cities/search?apikey=" + token + "&q=" + city;
    } else {
        urlCity = "http://" + weatherApi + "/locations/v1/cities/search?apikey=" + token + "&q=" + zipCode;
    }
    
    const responseCity = await fetch(urlCity);
    const CityJson = await responseCity.json();

    if (CityJson != undefined) {
    
        // request weather from city
        let urlWeather = "http://"+weatherApi+"/forecasts/v1/hourly/12hour/" + CityJson[0].Key + "?apikey=" + token + "&details=true&metric=true";
        const response = await fetch(urlWeather);
        const weatherJson = await response.json();
    
        // insert res
        let divRes = document.createElement('div');
        divRes.setAttribute("id", "res");
        document.body.appendChild(divRes);
        let titleCity = document.createElement("h2");
        let titleCityC = document.createTextNode("Weather for " + city);
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
    
    
            // br
            let br = document.createElement("br");
    
            // Append content to body
            divRes.appendChild(hourTitle);
            divRes.appendChild(probarain);
            divRes.appendChild(temp);
            divRes.appendChild(weather);
            divRes.appendChild(br);
        }
    } else {
        let divRes = document.createElement('div');
        divRes.setAttribute("id", "res");
        document.body.appendChild(divRes);
        let titleCity = document.createElement("h2");
        let titleCityC = document.createTextNode("City doesn't exist");
        titleCity.appendChild(titleCityC);
        divRes.appendChild(titleCity);
    }
}