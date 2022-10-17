async function getWeather() {
    const token = "7ff3737ebec73b955383801130a48541b060f0ab5c630b3209bdb1fe67bd00d7";
    const weatherApi = "api.meteo-concept.com";
    var city = document.getElementById("cityName").value;
    var zipCode = document.getElementById("zipCode").value;
    var element = document.getElementById("setWeather");

    let url = "https://"+weatherApi+"/api/forecast/nextHours?token="+token+"&latlng=47.3229,5.0379&insee=21231&hourly=true";
    const response = await fetch(url);
    const weatherJson = await response.json();

    let date = new Date(weatherJson.forecast[0].datetime);
    console.log(date.getHours());
    element.innerHTML = "Température dans une heure => " + weatherJson.forecast[1].temp2m + "°C"
}