async function getWeather() {
    // delete old res
    if (document.getElementById("res")) {
        document.removeChild(document.getElementById("res"));
    }

    // var
    const token = "7ff3737ebec73b955383801130a48541b060f0ab5c630b3209bdb1fe67bd00d7";
    const weatherApi = "api.meteo-concept.com";
    let city = document.getElementById("cityName").value;
    let zipCode = document.getElementById("zipCode").value;
    const uiDiv = document.getElementById("ui");

    // request
    let url = "https://"+weatherApi+"/api/forecast/nextHours?token="+token+"&latlng=47.3229,5.0379&insee=21231&hourly=true";
    const response = await fetch(url);
    const weatherJson = await response.json();

    // parse
    let date = new Date(weatherJson.forecast[0].datetime);
    console.log(date.getHours());

    // insert res
    let divRes = document.createElement('div');
    divRes.setAttribute("id", "res");
    document.body.appendChild(divRes);
}