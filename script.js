const apiKey = "74b9f4c0ad0fd06617a82d6fa686d89b"
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric";

async function checkWeather(city) {
    const response = await fetch(apiUrl + `&q=${city}&appid=${apiKey}`);
    console.log(response);
    if (!response.ok) {
        document.getElementById('error').style.display = "block";
    }
    else {
        document.getElementById('error').style.display = "none";
        document.getElementById('cityName').value = "";
        let data = await response.json();
        console.log(data);
        let city = document.querySelector(".city").innerHTML = data.name;
        let temp = document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        let humidity = document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        let wind = document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        let weather_status = document.querySelector(".weather_status").innerHTML = data.weather[0].main;
        addHistory(city, weather_status, temp, humidity, wind);
        switch (data.weather[0].main) {
            case 'Clouds':
                document.getElementById("weatherImg").src = "images/clouds.png";
                break;
            case 'Drizzle':
                document.getElementById("weatherImg").src = "images/drizzle.png";
                break;
            case 'Rain':
                document.getElementById("weatherImg").src = "images/rain.png";
                break;
            case 'Snow':
                document.getElementById("weatherImg").src = "images/snow.png";
                break;
            case 'Mist':
                document.getElementById("weatherImg").src = "images/mist.png";
                break;
            default:
                document.getElementById("weatherImg").src = "images/clear.png";
                break;
        }
    }
}


function searchWeather() {
    let cityName = document.getElementById('cityName').value;
    if (cityName) {
        checkWeather(cityName);
    }
    else
        alert('Enter City !');
}

function addHistory(city, weather_status, temp, humidity, wind) {

    let uniqueId = "id" + Math.random().toString(16).slice(2);
    let newObj = {
        city,
        weather_status,
        temp,
        humidity,
        wind,
        uniqueId
    }
    let newArray = [];
    newArray.push(newObj);
    let prevArray = localStorage.getItem('weatherHistory') ? JSON.parse(localStorage.getItem('weatherHistory')) : [];
    let data = prevArray.concat(newArray);
    localStorage.setItem('weatherHistory', JSON.stringify(data));
    prepareTable(data);
}

function prepareTable(bid) {
    let prevArray = localStorage.getItem('weatherHistory') ? JSON.parse(localStorage.getItem('weatherHistory')) : [];
    let row_num = 1;
    let table = document.getElementById('historyTable');
    for (var j = 1; j < table.rows.length;) {
        table.deleteRow(j);
    }
    for (let i = prevArray.length - 1; i >= 0; i--) {
        let row = table.insertRow(row_num);
        row.insertCell(0).innerHTML = prevArray[i].city;
        row.insertCell(1).innerHTML = prevArray[i].weather_status;
        row.insertCell(2).innerHTML = prevArray[i].temp;
        row.insertCell(3).innerHTML = prevArray[i].humidity;
        row.insertCell(4).innerHTML = prevArray[i].wind;
        // row.insertCell(3).innerHTML = '<input  type="button" id ="' + prevArray[i].uniqueId + '" onclick = "updateRow(this)" class ="btn-update-icon" value ="&#9998; "> <input  type="button" id ="' + prevArray[i].uniqueId + '" onclick = "removeRow(this)" class ="btn-symbol btn-delete" value ="&#10007;"> ';
        row_num++;
    }
    if (bid == 'prepareTable') {
        document.getElementById('weatherTable').style.display = 'block';
        document.getElementById('weatherInfo').style.display = 'none';
    }
    else {
        document.getElementById('weatherTable').style.display = 'none';
        document.getElementById('weatherInfo').style.display = 'block';
    }

}

function historyDelete()
{
    localStorage.removeItem("weatherHistory");
    prepareTable();
}