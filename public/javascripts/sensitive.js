function sensitive(checkbox, i) {
	if (checkbox.checked) {
		document.getElementById(`postContent${i}`).removeAttribute("style");
	} else {
		document.getElementById(`postContent${i}`).style.filter = "blur(10px)";
	}
}

for (let i = 0; i < 5; i++) {
	let checkbox = document.querySelector(`#showBtn${i}`);
	if (typeof checkbox !== null) {
		checkbox.addEventListener("change", sensitive.bind(this, checkbox, i));
	}
}
