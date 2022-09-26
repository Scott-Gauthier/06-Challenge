//Select needed parts of the html dom
var btnsubmit = document.querySelector("#btnsubmit");

var test = document.querySelector("#test");
var cityInput = document.querySelector("#cityInput");

//Clear list
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
  } 

//make the buttons active and able to function
document.querySelector("#btnsubmit").addEventListener("click", function(event) {
    event.preventDefault();
    let cityName;
    //array needed to store text entered in textboxes
    let textEntered = JSON.parse(localStorage.getItem("textEntered")) || [];

    //clear list to rebuild with new values
    const searchhistory = document.querySelector('#searchhistory');
    removeAllChildNodes(searchhistory);

    cityName = cityInput.value;
    const Object = {
        City: `${cityName}`,
        // Radius: selectedRadius,
        // MapItem: searchTerm,
      }

    //set initials and score to local storage.
    textEntered.push(Object);
    localStorage.setItem("textEntered", JSON.stringify(textEntered));

    test.textContent = cityInput.value;

    for (let i = 0; i < textEntered.length; i++) { 
        let btn = document.createElement("button");
        searchhistory.append(btn);
        btn.setAttribute("id", `btn${i}`);
    }
});


