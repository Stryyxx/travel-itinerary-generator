document.addEventListener("DOMContentLoaded", () => {
	var loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
	if (loadTime <= 2000) {
		setTimeout(() => {
			document.querySelector(".loader").classList.add("hidden");
			document.querySelector(".loader-container").classList.add("hidden");
			document.querySelector(".content").classList.remove("hidden");
		}, 2000);
	} else {
		window.onload = () => {
			document.querySelector(".loader").classList.add("hidden");
			document.querySelector(".loader-container").classList.add("hidden");
			document.querySelector(".content").classList.remove("hidden");
		};
	}
});
