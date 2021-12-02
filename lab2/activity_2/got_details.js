// DOM #main div element
var main = document.getElementById('main');

// **** Your JavaScript code goes here ****
var characters = [{
	 "name": "Bran Stark",
	 "status": "Alive",
	 "current_location": "Fleeing White Walkers",
	 "power_ranking": 7,
	 "house": "stark",
	 "probability_of_survival": 98
},
{
	 "name": "Arya Stark",
	 "status": "Alive",
	 "current_location": "Back in Westeros",
	 "power_ranking": 8,
	 "house": "stark",
	 "probability_of_survival": 99
},
{
	 "name": "Sansa Stark",
	 "status": "Alive",
	 "current_location": "Winterfell",
	 "power_ranking": 10,
	 "house": "stark",
	 "probability_of_survival": 83
},
{
	 "name": "Robb Stark",
	 "status": "Dead - Red Wedding S3E9",
	 "current_location": "-",
	 "power_ranking": -1,
	 "house": "stark",
	 "probability_of_survival": 0
}]

function halfSurvival(character) {
	return character.probability_of_survival / 2
}

for(var i = 0; i < characters.length; i++){
	if(characters[i].name != "Sansa Stark"){
		characters[i].probability_of_survival = halfSurvival(characters[i])
	}
}

function debugCharacters(){
	for(var i = 0; i < characters.length; i++){
		console.log("Character name: " + characters[i].name + "probability_of_survival: " + characters[i].probability_of_survival)
	}
}
debugCharacters()



// document is the DOM, select the #main div
var main = document.getElementById("main");

// Create a new DOM element
var header = document.createElement("h3");
// Append the newly created <h3> element to #main
main.appendChild(header);
// Set the textContent to:
header.textContent = "My Favorite GoT Characters";

// Create a new <div> element	
var div1 = document.createElement("div");
// Append the newly created <div> element to #main
main.appendChild(div1);

function createDivs(){
	for(var i = 0; i < characters.length; i++){
		var div = document.createElement("div")
		var information = document.createElement("p")
		div.appendChild(information)
		main.appendChild(div)
		information.textContent = "Character name: " + characters[i].name + " Character house: " + characters[i].house + " Character probability_of_survival: " + characters[i].probability_of_survival + " Character status: " + characters[i].status
	}
}
createDivs()






