const cities = {

    manila:{

        temp:"31°C",

        weather:"Sunny",

        humidity:"74%",

        wind:"12 km/h",

        feels:"33°C",

        visibility:"10 km"

    },

    tokyo:{

        temp:"21°C",

        weather:"Cloudy",

        humidity:"61%",

        wind:"8 km/h",

        feels:"22°C",

        visibility:"8 km"

    },

    london:{

        temp:"14°C",

        weather:"Rainy",

        humidity:"90%",

        wind:"18 km/h",

        feels:"13°C",

        visibility:"5 km"

    }

};

document.getElementById("searchBtn").onclick=function(){

    let city=document.getElementById("city").value.toLowerCase();

    if(cities[city]){

        let data=cities[city];

        document.getElementById("temperature").innerHTML=data.temp;

        document.getElementById("condition").innerHTML=data.weather;

        document.getElementById("humidity").innerHTML=data.humidity;

        document.getElementById("wind").innerHTML=data.wind;

        document.getElementById("feelsLike").innerHTML=data.feels;

        document.getElementById("visibility").innerHTML=data.visibility;

        document.getElementById("location").innerHTML=city;

    }

    else{

        alert("City not found.");

    }

}