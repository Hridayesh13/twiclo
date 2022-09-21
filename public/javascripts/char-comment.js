let textArea = document.querySelector("#floatingTextarea2");
let characterCounter = document.querySelector("#character-counter");
const maxNumOfChars = 280;

document.getElementById("postButton").disabled = true;

textAreaElement.addEventListener("keydown", (event) => {
	let numOfEnteredChars = textArea.value.length;
	console.log(numOfEnteredChars);
	let counter = maxNumOfChars - numOfEnteredChars;
	characterCounter.textContent = counter + "/280";

	if (counter < 0) {
		characterCounter.style.color = "red";
		document.getElementById("postButton").disabled = true;
	} else if (counter == 280) {
		characterCounter.style.color = "grey";
		document.getElementById("postButton").disabled = true;
	} else if (counter < 20 && counter > 0) {
		characterCounter.style.color = "orange";
		document.getElementById("postButton").disabled = false;
	} else {
		characterCounter.style.color = "black";
		document.getElementById("postButton").disabled = false;
	}
});
