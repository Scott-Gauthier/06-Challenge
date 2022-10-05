//Select needed parts of the html dom
var btnsubmit = document.querySelector("#btnsubmit");
var cityInput = document.querySelector("#cityInput");
var temp = document.querySelector("#temp");
var wind = document.querySelector("#wind");
var humidity = document.querySelector("#humidity");
var citydisplay = document.querySelector("#citydisplay");
var return_message = document.querySelector("#return_message");
var inputObject = [];
var APIKey = "bad1392b1c1d099b4617d052419cbc8d";

//Clear list
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
  } 

function buildDOM() {
  //clear list to rebuild with new values
  const searchhistory = document.querySelector('#searchhistory');
  removeAllChildNodes(searchhistory);

// here

//array needed to store text entered in textboxes
let textEntered = JSON.parse(localStorage.getItem("textEntered")) || [];
  for (let i = 0; i < textEntered.length; i++) {
    let textEntered = JSON.parse(localStorage.getItem("textEntered")) || []; 
    let btn = document.createElement("button");
    searchhistory.append(btn);
    btn.setAttribute("id", `btn${i}`);
    btn.setAttribute("class", `lightgray`);
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
  
}
buildDOM();

//make the buttons active and able to function
function activeButtons() {
document.querySelector("#btnsubmit").addEventListener("click", function(event) {
    event.preventDefault();
    let cityName;
    //array needed to store text entered in textboxes
    let textEntered = JSON.parse(localStorage.getItem("textEntered")) || [];

    cityName = cityInput.value.split(",");
    stateabbreviations = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA',"WA",'WV','WI','WY']

    if (!cityName[1]) {
      return_message.textContent = `Please enter city data including state or country code. Examples: Seattle, WA or London, GB.`
    } else {
    if(stateabbreviations.includes(cityName[1].toUpperCase().replace(" ",""))) {
      return_message.textContent = ``
      inputObject = {
        City: `${cityName[0]}`,
        Statecode: `${cityName[1].toUpperCase().replace(" ","")+', USA'}`,
      }
    } else {
      inputObject = {
        City: `${cityName[0]}`,
        Statecode: `${cityName[1].toUpperCase().replace(" ","")}`,
      }
    }
    //set initials and score to local storage.
    localStorage.setItem("textEntered", JSON.stringify(textEntered));
    
  
    function searchObject(a) {
      return a.City === inputObject.City && a.Statecode === inputObject.Statecode;
    }
    if (textEntered.find(searchObject)) {
    } else {
    textEntered.push(inputObject);
    localStorage.setItem("textEntered", JSON.stringify(textEntered));
    }
    buildDOM();

    openWeatherAPI();
   return inputObject;

}});
}
activeButtons();

function latlonAPI() {
    var latlong = `https://api.openweathermap.org/data/2.5/weather?q=${inputObject.City},${inputObject.Statecode}&appid=${APIKey}&units=imperial`;
    var latlon = fetch(latlong)
    .then(function (response) {
      if (response.status === 200) {
      }
      return response.json();
  })
    .then(function (data) {
        let lat = data.coord.lat;
        let lon = data.coord.lon;
        var iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        var img = document.createElement('img');

        citydisplay.textContent = `${inputObject.City}, ${inputObject.Statecode} (${moment().format('L')})`
        citydisplay.append(img);
        img.setAttribute('src',iconUrl);
        temp.textContent = `Temp: ${data.main.temp} °F`;
        wind.textContent = `Wind: ${data.wind.speed} MPH`;
        humidity.textContent = `Humidity: ${data.main.humidity} %`;
        var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;
        return requestUrl;
    })
    return latlon;
}
function openWeatherAPI() {
let requestUrl = latlonAPI()
    .then( function (requestUrl) {
    fetch(requestUrl)
    .then(function (response) {
        if (response.status === 200) {

        }
        return response.json();
    })
        .then(function (data) {
        var icon5 = document.querySelectorAll(`#icon5`),i;
        var temp5 = document.querySelectorAll(`#temp5`),i;
        var wind5 = document.querySelectorAll(`#wind5`),i;
        var humidity5 = document.querySelectorAll(`#humidity5`),i;
        var citydisplay5 = document.querySelectorAll(`#citydisplay5`),i;

    for (let i = 0; i < 5; i++) {
      var iconUrl5 = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;      
      citydisplay5[i].textContent = `${moment(data.list[i].dt_txt).add(i, 'days').format('L')}`;
      icon5[i].setAttribute('src',iconUrl5);
      temp5[i].textContent = `Temp: ${data.list[i].main.temp} °F`;
      wind5[i].textContent = `Wind: ${data.list[i].wind.speed} MPH`;
      humidity5[i].textContent = `Humidity: ${data.list[i].main.humidity} %`;
    }
        })
    })
    return requestUrl;
  };