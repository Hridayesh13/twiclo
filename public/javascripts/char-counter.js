const textAreaElement = document.querySelector("#floatingTextarea2");
console.log(textAreaElement);

const characterCounterElement = document.querySelector("#character-counter");

const typedCharactersElement = document.querySelector("#typed-characters");

const maximumCharacters = 280;

textAreaElement.addEventListener("keydown", (event) => {
	const typedCharacters = textAreaElement.value.length;

	typedCharactersElement.textContent = typedCharacters;

	if (typedCharacters >= 220 && typedCharacters <= 280) {
		characterCounterElement.classList = "text-warning";
		document.getElementById("postButton").disabled = false;
	} else if (typedCharacters > 280) {
		characterCounterElement.classList = "text-danger";
		document.getElementById("postButton").disabled = true;
		// document.getElementById("postButtonSpan").title =
		// 	"at most 280 characters";
	}
});
