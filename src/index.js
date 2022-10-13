async function getWeather() {
    const token = "7ff3737ebec73b955383801130a48541b060f0ab5c630b3209bdb1fe67bd00d7";
    const weatherApi = "api.meteo-concept.com";
    var city = document.getElementById("cityName").value;
    var zipCode = document.getElementById("zipCode").value;
    var element = document.getElementById("setWeather");
    element.innerHTML = "Coucou tu cliques, bravo [" + city + " " + zipCode + "] !";

    let url = "https://"+weatherApi+"/api/forecast/nextHours?token="+token+"&latlng=47.3229,5.0379&insee=21231&hourly=true";
    const response = await fetch(url);
    const weatherJson = await response.json();
    console.log(weatherJson);
}