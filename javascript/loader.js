document.DOMContentLoaded(function () {
	setTimeout(function () {
		document.querySelector(".loader").classList.add("hidden");
		document.querySelector(".loader-container").classList.add("hidden");
		document.querySelector(".content").classList.remove("hidden");
		AOS.init({
			duration: 750,
		});
	}, 1500);
});
