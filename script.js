const countriesAndCities = {
	Australia: ["Sydney", "Melbourne", "Brisbane"],
	"United States": ["New York", "Los Angeles", "Chicago"],
	Germany: ["Berlin", "Munich", "Hamburg"],
	"United Kingdom": ["London", "Manchester", "Liverpool"],
	Canada: ["Toronto", "Vancouver", "Montreal"],
	France: ["Paris", "Lyon", "Marseille"],
	India: ["Mumbai", "Delhi", "Bangalore"],
	China: ["Beijing", "Shanghai", "Guangzhou"],
	Japan: ["Tokyo", "Osaka", "Kyoto"],
};

document.addEventListener("DOMContentLoaded", () => {
	const map = L.map("map").setView([51.505, -0.09], 13);
	const destinationsList = document.getElementById("destinations-list");

	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution: "© OpenStreetMap",
	}).addTo(map);

	let route = [];
	const routeLayer = L.polyline(route, { color: "blue" }).addTo(map);

	map.on("click", async (e) => {
		const { lat, lng } = e.latlng;
		const point = [lat, lng];
		const locationName = await getLocationName(lat, lng);
		route.push({ point, name: locationName });
		routeLayer.setLatLngs(route.map((r) => r.point));

		const marker = L.marker(point).addTo(map);
		marker.on("click", () => {
			route = route.filter((r) => r.point[0] !== lat || r.point[1] !== lng);
			routeLayer.setLatLngs(route.map((r) => r.point));
			map.removeLayer(marker);
			updateDestinationsList();
		});

		updateDestinationsList();
	});

	document.getElementById("save-route").addEventListener("click", () => {
		if (route.length > 0) {
			const routeName = prompt("Enter a name for your route:");
			if (routeName) {
				const savedRoutes = JSON.parse(localStorage.getItem("savedRoutes")) || {};
				savedRoutes[routeName] = route;
				localStorage.setItem("savedRoutes", JSON.stringify(savedRoutes));
				alert("Route saved!");
			} else {
				alert("No name provided!");
			}
		} else {
			alert("No route to save!");
		}
	});

	document.getElementById("export-route").addEventListener("click", () => {
		if (route.length > 0) {
			const blob = new Blob([JSON.stringify(route)], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "route.json";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		} else {
			alert("No route to export!");
		}
	});

	document.getElementById("import-route").addEventListener("change", (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const importedRoute = JSON.parse(e.target.result);
				route = importedRoute;
				routeLayer.setLatLngs(route.map((r) => r.point));
				map.fitBounds(routeLayer.getBounds());
				updateDestinationsList();
			};
			reader.readAsText(file);
		}
	});

	document.getElementById("search").addEventListener("keypress", async (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			const query = event.target.value;
			const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
			const results = await response.json();
			if (results.length > 0) {
				const { lat, lon, display_name } = results[0];
				const point = [lat, lon];
				route.push({ point, name: getShortAddress(display_name) });
				routeLayer.setLatLngs(route.map((r) => r.point));
				map.setView(point, 13);

				const marker = L.marker(point).addTo(map);
				marker.on("click", () => {
					route = route.filter((r) => r.point[0] !== lat || r.point[1] !== lon);
					routeLayer.setLatLngs(route.map((r) => r.point));
					map.removeLayer(marker);
					updateDestinationsList();
				});

				updateDestinationsList();
			} else {
				alert("Location not found");
			}
		}
	});

	const updateDestinationsList = () => {
		destinationsList.innerHTML = "";
		route.forEach((r) => {
			const listItem = document.createElement("li");
			listItem.textContent = `${r.name}`;
			destinationsList.appendChild(listItem);
		});
	};

	const getLocationName = async (lat, lng) => {
		const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
		const data = await response.json();
		return getShortAddress(data.display_name);
	};

	const getShortAddress = (displayName) => {
		const parts = displayName.split(", ");
		return parts.slice(0, 3).join(", ");
	};

	const savedRouteString = localStorage.getItem("savedRoute");
	if (savedRouteString) {
		route = JSON.parse(savedRouteString);
		routeLayer.setLatLngs(route.map((r) => r.point));
		map.fitBounds(routeLayer.getBounds());
		updateDestinationsList();
	}
});
