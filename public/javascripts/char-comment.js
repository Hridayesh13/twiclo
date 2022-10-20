let textArea = document.querySelector("#floatingTextarea2");
let characterCounter = document.querySelector("#character-counter");
const maxNumOfChars = 140;

document.getElementById("postButton").disabled = true;

textArea.addEventListener("keyup", (event) => {
	let typedCharacters = textArea.value.length;
	// console.log(typedCharacters);
	let counter = maxNumOfChars - typedCharacters;
	characterCounter.textContent = counter + "/140";

	if (counter < 0) {
		characterCounter.style.color = "red";
		document.getElementById("postButton").disabled = true;
	} else if (counter == 140) {
		characterCounter.style.color = "grey";
		document.getElementById("postButton").disabled = true;
	} else if (counter < 20 && counter > 0) {
		characterCounter.style.color = "orange";
		document.getElementById("postButton").disabled = false;
	} else {
		characterCounter.style.color = "white";
		document.getElementById("postButton").disabled = false;
	}
});
