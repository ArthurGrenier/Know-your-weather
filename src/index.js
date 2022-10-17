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

    // request
    let url = "https://"+weatherApi+"/api/forecast/nextHours?token="+token+"&latlng=47.3229,5.0379&insee=21231&hourly=true";
    const response = await fetch(url);
    const weatherJson = await response.json();

    // insert res
    let divRes = document.createElement('div');
    divRes.setAttribute("id", "res");
    document.body.appendChild(divRes);
    let hourNumber = weatherJson.forecast.length;
    for (i=0;hourNumber > i;i++) {
        let date = new Date(weatherJson.forecast[i].datetime);
        let hour = date.getHours();
        // Title section
        let hourTitle = document.createElement("h2");
        let TitleContent = document.createTextNode(hour + "h00");
        hourTitle.appendChild(TitleContent);
        divRes.appendChild(hourTitle);

        // infos section
        let content = document.createElement("p");
        let contentText = document.createTextNode(
            "Probability of rainning : " + weatherJson.forecast[i].probarain
        );
        content.appendChild(contentText);

        // Append content to body
        divRes.appendChild(hourTitle);
        divRes.appendChild(content);

        console.log(weatherJson.forecast[i]);
    }
}