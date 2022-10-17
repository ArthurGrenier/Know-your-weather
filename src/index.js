// import * as codeTemps from './codeTemps';
async function getWeather() {
    // delete old res
    if (document.getElementById("res")) {
        document.body.removeChild(document.getElementById("res"));
    }

    // var
    const token = "7ff3737ebec73b955383801130a48541b060f0ab5c630b3209bdb1fe67bd00d7";
    const weatherApi = "api.meteo-concept.com";
    let city = document.getElementById("cityName").value;
    let zipCode = document.getElementById("zipCode").value;
    const uiDiv = document.getElementById("ui");

    // request city
    let urlCity = "";
    if (zipCode == "") {
        urlCity = "https://" + weatherApi + "/api/location/cities?token=" + token + "&search=" + city;
    } else {
        urlCity = "https://" + weatherApi + "/api/location/cities?token=" + token + "&search=" + zipCode;
    }

    const responseCity = await fetch(urlCity);
    const CityJson = await responseCity.json();
    let tablRes = [
        CityJson.cities[0].longitude,
        CityJson.cities[0].latitude,
        CityJson.cities[0].insee,
    ];

    // request weather from city
    let urlWeather = "https://"+weatherApi+"/api/forecast/nextHours?token="+token+"&latlng=" + CityJson.cities[0].latitude + "," + CityJson.cities[0].longitude + "&insee=" + CityJson.cities[0].insee + "&hourly=true";
    const response = await fetch(urlWeather);
    const weatherJson = await response.json();
    console.log(weatherJson);

    // insert res
    let divRes = document.createElement('div');
    divRes.setAttribute("id", "res");
    document.body.appendChild(divRes);
    let titleCity = document.createElement("h2");
    let titleCityC = document.createTextNode("Weather for " + weatherJson.city.name);
    titleCity.appendChild(titleCityC);
    divRes.appendChild(titleCity);
    let hourNumber = weatherJson.forecast.length;
    for (i=0;hourNumber > i;i++) {
        let date = new Date(weatherJson.forecast[i].datetime);
        let hour = date.getHours();

        // Title section
        let hourTitle = document.createElement("h3");
        let titleContent = document.createTextNode(hour + "h00");
        hourTitle.appendChild(titleContent);

        // infos section
        let content = document.createElement("p");
        let contentText = document.createTextNode(
            "Probability of rainning : " + weatherJson.forecast[i].probarain
        );
        content.appendChild(contentText);

        // br
        let br = document.createElement("br");

        // Append content to body
        divRes.appendChild(hourTitle);
        divRes.appendChild(content);
        divRes.appendChild(br);
    }
}