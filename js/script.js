//Select needed parts of the html dom
var btnsubmit = document.querySelector("#btnsubmit");
var cityInput = document.querySelector("#cityInput");
var temp = document.querySelector("#temp");
var wind = document.querySelector("#wind");
var humidity = document.querySelector("#humidity");
var UV = document.querySelector("#UV");
var citydisplay = document.querySelector("#citydisplay");
var inputObject = [];

//Clear list
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
  } 

//make the buttons active and able to function
function activeButtons() {
document.querySelector("#btnsubmit").addEventListener("click", function(event) {
    event.preventDefault();
    let cityName;
    //array needed to store text entered in textboxes
    let textEntered = JSON.parse(localStorage.getItem("textEntered")) || [];

    //clear list to rebuild with new values
    const searchhistory = document.querySelector('#searchhistory');
    removeAllChildNodes(searchhistory);

    cityName = cityInput.value.split(",");
    stateabbreviations = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA',"WA",'WV','WI','WY']

    if(stateabbreviations.includes(cityName[1].replace(" ",""))) {
      console.log("State abb works");
      inputObject = {
        City: `${cityName[0]}`,
        Statecode: `${cityName[1]+', USA'}`,
      }
    } else {
      console.log("Darn it!");
      inputObject = {
        City: `${cityName[0]}`,
        Statecode: `${cityName[1]}`,
      }
    }

    //set initials and score to local storage.
    textEntered.push(inputObject);
    localStorage.setItem("textEntered", JSON.stringify(textEntered));

      for (let i = 0; i < textEntered.length; i++) {
        let textEntered = JSON.parse(localStorage.getItem("textEntered")) || []; 
        let btn = document.createElement("button");
        searchhistory.append(btn);
        btn.setAttribute("id", `btn${i}`);
        btn.textContent = `${textEntered[i].City}, ${textEntered[i].Statecode}`;
        document.querySelector(`#btn${i}`).addEventListener("click", function(event) {
          inputObject = {
            City: `${textEntered[i].City}`,
            Statecode: `${textEntered[i].Statecode}`,
          }
          console.log(`Clicked ${i}`);
          openWeatherAPI();
        });
    }
    console.log(inputObject.City);
    console.log(inputObject.Statecode);
    openWeatherAPI();
   return inputObject;

});
}
activeButtons();
var APIKey = "bad1392b1c1d099b4617d052419cbc8d";
// var cityname = "Portland"; //London Portland
// var statecode = "OR, USA"; //GB OR,USA


function latlonAPI() {
  console.log(inputObject);
  console.log(inputObject.Statecode);
    var latlong = `https://api.openweathermap.org/data/2.5/weather?q=${inputObject.City},${inputObject.Statecode}&appid=${APIKey}`;
    var latlon = fetch(latlong)
    .then(function (response) {
      //console.log(response);
      if (response.status === 200) {
      }
      return response.json();
  })
    .then(function (data) {
        console.log(data);
        let lat = data.coord.lat;
        let lon = data.coord.lon;
        citydisplay.textContent = `${inputObject.City}, ${inputObject.Statecode} (Date)`
        temp.textContent = `Temp: ${data.main.temp}`;
        wind.textContent = `Wind: ${data.wind.speed}`;
        humidity.textContent = `Humidity: ${data.main.humidity}`;
        UV = document.querySelector("#UV");
        var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
        return requestUrl;
    })
    return latlon;
}
function openWeatherAPI() {
let requestUrl = latlonAPI()
    .then( function (requestUrl) {
    fetch(requestUrl)
    .then(function (response) {
        //console.log(response);
        if (response.status === 200) {

        }
        return response.json();
    })
        .then(function (data) {
        console.log(data);
        var temp5 = document.querySelectorAll(`#temp5`),i;
        var wind5 = document.querySelectorAll(`#wind5`),i;
        var humidity5 = document.querySelectorAll(`#humidity5`),i;
        var citydisplay5 = document.querySelectorAll(`#citydisplay5`),i;

    for (let i = 0; i < 5; i++) {
    
      // temp5[i] = document.querySelectorAll(`#temp5`);
      // var windi = document.querySelector(`#wind${i}`);
      // var humidityi = document.querySelector(`#humidity${i}`);
      
      citydisplay5[i].textContent = `Temp: ${data.list[i].dt_txt}.`;      
      temp5[i].textContent = `Temp: ${data.list[i].main.temp}.`;
      wind5[i].textContent = `Wind: ${data.list[i].wind.speed}.`;
      humidity5[i].textContent = `Humidity: ${data.list[i].main.humidity}.`;
    }

        })
    })


    return requestUrl;
  };

//console.log(latlon);  


