async function getWeather() {
    // delete old res
    if (document.getElementById("res")) {
        document.body.removeChild(document.getElementById("res"));
    }

    // var
    const weatherCode = {
        "0"   : "Soleil",
        "1"   : "Peu nuageux",
        "2"   : "Ciel voilé",
        "3"   : "Nuageux",
        "4"   : "Très nuageux",
        "5"   : "Couvert",
        "6"   : "Brouillard",
        "7"   : "Brouillard givrant",
        "10"  : "Pluie faible",
        "11"  : "Pluie modérée",
        "12"  : "Pluie forte",
        "13"  : "Pluie faible verglaçante",
        "14"  : "Pluie modérée verglaçante",
        "15"  : "Pluie forte verglaçante",
        "16"  : "Bruine",
        "20"  : "Neige faible",
        "21"  : "Neige modérée",
        "22"  : "Neige forte",
        "30"  : "Pluie et neige mêlées faibles",
        "31"  : "Pluie et neige mêlées modérées",
        "32"  : "Pluie et neige mêlées fortes",
        "40"  : "Averses de pluie locales et faibles",
        "41"  : "Averses de pluie locales",
        "42"  : "Averses locales et fortes",
        "43"  : "Averses de pluie faibles",
        "44"  : "Averses de pluie",
        "45"  : "Averses de pluie fortes",
        "46"  : "Averses de pluie faibles et fréquentes",
        "47"  : "Averses de pluie fréquentes",
        "48"  : "Averses de pluie fortes et fréquentes",
        "60"  : "Averses de neige localisées et faibles",
        "61"  : "Averses de neige localisées",
        "62"  : "Averses de neige localisées et fortes",
        "63"  : "Averses de neige faibles",
        "64"  : "Averses de neige",
        "65"  : "Averses de neige fortes",
        "66"  : "Averses de neige faibles et fréquentes",
        "67"  : "Averses de neige fréquentes",
        "68"  : "Averses de neige fortes et fréquentes",
        "70"  : "Averses de pluie et neige mêlées localisées et faibles",
        "71"  : "Averses de pluie et neige mêlées localisées",
        "72"  : "Averses de pluie et neige mêlées localisées et fortes",
        "73"  : "Averses de pluie et neige mêlées faibles",
        "74"  : "Averses de pluie et neige mêlées",
        "75"  : "Averses de pluie et neige mêlées fortes",
        "76"  : "Averses de pluie et neige mêlées faibles et nombreuses",
        "77"  : "Averses de pluie et neige mêlées fréquentes",
        "78"  : "Averses de pluie et neige mêlées fortes et fréquentes",
        "100" : "Orages faibles et locaux",
        "101" : "Orages locaux",
        "102" : "Orages fort et locaux",
        "103" : "Orages faibles",
        "104" : "Orages",
        "105" : "Orages forts",
        "106" : "Orages faibles et fréquents",
        "107" : "Orages fréquents",
        "108" : "Orages forts et fréquents",
        "120" : "Orages faibles et locaux de neige ou grésil",
        "121" : "Orages locaux de neige ou grésil",
        "122" : "Orages locaux de neige ou grésil",
        "123" : "Orages faibles de neige ou grésil",
        "124" : "Orages de neige ou grésil",
        "125" : "Orages de neige ou grésil",
        "126" : "Orages faibles et fréquents de neige ou grésil",
        "127" : "Orages fréquents de neige ou grésil",
        "128" : "Orages fréquents de neige ou grésil",
        "130" : "Orages faibles et locaux de pluie et neige mêlées ou grésil",
        "131" : "Orages locaux de pluie et neige mêlées ou grésil",
        "132" : "Orages fort et locaux de pluie et neige mêlées ou grésil",
        "133" : "Orages faibles de pluie et neige mêlées ou grésil",
        "134" : "Orages de pluie et neige mêlées ou grésil",
        "135" : "Orages forts de pluie et neige mêlées ou grésil",
        "136" : "Orages faibles et fréquents de pluie et neige mêlées ou grésil",
        "137" : "Orages fréquents de pluie et neige mêlées ou grésil",
        "138" : "Orages forts et fréquents de pluie et neige mêlées ou grésil",
        "140" : "Pluies orageuses",
        "141" : "Pluie et neige mêlées à caractère orageux",
        "142" : "Neige à caractère orageux",
        "210" : "Pluie faible intermittente",
        "211" : "Pluie modérée intermittente",
        "212" : "Pluie forte intermittente",
        "220" : "Neige faible intermittente",
        "221" : "Neige modérée intermittente",
        "222" : "Neige forte intermittente",
        "230" : "Pluie et neige mêlées",
        "231" : "Pluie et neige mêlées",
        "232" : "Pluie et neige mêlées",
        "235" : "Averses de grêle"
    }
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

    if (CityJson.cities[0] != undefined) {
        let tablRes = [
            CityJson.cities[0].longitude,
            CityJson.cities[0].latitude,
            CityJson.cities[0].insee,
        ];
    
        // request weather from city
        let urlWeather = "https://"+weatherApi+"/api/forecast/nextHours?token="+token+"&latlng=" + CityJson.cities[0].latitude + "," + CityJson.cities[0].longitude + "&insee=" + CityJson.cities[0].insee + "&hourly=true";
        const response = await fetch(urlWeather);
        const weatherJson = await response.json();
    
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
    
            // info probarain section
            let probarain = document.createElement("p");
            let probarainText = document.createTextNode(
                "Probability of rainning : " + weatherJson.forecast[i].probarain
            );
            probarain.appendChild(probarainText);
    
            // info temp
            let temp = document.createElement("p");
            let tempText = document.createTextNode(
                "Temperature : " + weatherJson.forecast[i].temp2m + "°C"
            );
            temp.appendChild(tempText);
    
            // info weather
            let weather = document.createElement("p");
            let weatherCodeGet = weatherJson.forecast[i].weather;
            let weatherText = document.createTextNode(
                "Weather : " + weatherCode[weatherCodeGet]
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