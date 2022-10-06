let checkbox = document.querySelectorAll(
	"#showBtn0",
	"#showBtn1",
	"#showBtn2",
	"#showBtn3",
	"#showBtn4"
);

for (let i = 0; i < checkbox.length; i++) {
	checkbox[i].addEventListener("change", (event) => {
		if (checkbox[i].checked) {
			document.getElementById("postContent").removeAttribute("style");
		} else {
			document.getElementById("postContent").style.filter = "blur(10px)";
		}
	});
}
