document.addEventListener("DOMContentLoaded", () => {
	const map = L.map("map").setView([-33.8688, 151.2093], 12);
	const destinationsList = document.getElementById("destinations-list");

	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution: "© OpenStreetMap",
	}).addTo(map);

	let route = [];
	let markers = [];
	const routeLayer = L.polyline(route, { color: "blue" }).addTo(map);

	const clearMarkers = () => {
		markers.forEach((marker) => map.removeLayer(marker));
		markers = [];
	};

	map.on("click", async (e) => {
		const { lat, lng } = e.latlng;
		const point = [lat, lng];
		const locationData = await getLocationData(lat, lng);
		route.push({ point, ...locationData });
		routeLayer.setLatLngs(route.map((r) => r.point));

		const marker = L.marker(point).addTo(map);
		markers.push(marker);
		marker.on("click", () => {
			route = route.filter((r) => r.point[0] !== lat || r.point[1] !== lng);
			routeLayer.setLatLngs(route.map((r) => r.point));
			map.removeLayer(marker);
			markers = markers.filter((m) => m !== marker);
			updateDestinationsList();
		});

		updateDestinationsList();
	});

	document.getElementById("clear-route").addEventListener("click", () => {
		route = [];
		routeLayer.setLatLngs(route);
		clearMarkers();
		updateDestinationsList();
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
				clearMarkers();
				route.forEach((r) => {
					const marker = L.marker(r.point).addTo(map);
					markers.push(marker);
					marker.on("click", () => {
						route = route.filter((point) => point[0] !== r.point[0] || point[1] !== r.point[1]);
						routeLayer.setLatLngs(route.map((point) => point));
						map.removeLayer(marker);
						markers = markers.filter((m) => m !== marker);
						updateDestinationsList();
					});
				});
				updateDestinationsList();
			};
			reader.readAsText(file);
		}
	});

	document.getElementById("search").addEventListener("keypress", async (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			const query = event.target.value;
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${query}&accept-language=en`
			);
			const results = await response.json();
			if (results.length > 0) {
				const { lat, lon, display_name } = results[0];
				const point = [lat, lon];
				const locationData = getShortAddress(display_name);
				route.push({ point, ...locationData });
				routeLayer.setLatLngs(route.map((r) => r.point));
				map.setView(point, 13);

				const marker = L.marker(point).addTo(map);
				markers.push(marker);
				marker.on("click", () => {
					route = route.filter((r) => r.point[0] !== lat || r.point[1] !== lon);
					routeLayer.setLatLngs(route.map((r) => r.point));
					map.removeLayer(marker);
					markers = markers.filter((m) => m !== marker);
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
		route.forEach((r, index) => {
			const listItem = document.createElement("li");
			listItem.textContent = `${r.address}, ${r.country}`;
			destinationsList.appendChild(listItem);
		});
	};

	const getLocationData = async (lat, lng) => {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
		);
		const data = await response.json();
		const address = getShortAddress(data.display_name);
		return address;
	};

	const getShortAddress = (displayName) => {
		const parts = displayName.split(", ");
		return {
			name: parts[0],
			address: parts.slice(1, parts.length - 1).join(", "),
			country: parts[parts.length - 1],
		};
	};

	const savedRouteString = localStorage.getItem("savedRoute");
	if (savedRouteString) {
		route = JSON.parse(savedRouteString);
		routeLayer.setLatLngs(route.map((r) => r.point));
		map.fitBounds(routeLayer.getBounds());
		route.forEach((r) => {
			const marker = L.marker(r.point).addTo(map);
			markers.push(marker);
			marker.on("click", () => {
				route = route.filter((point) => point[0] !== r.point[0] || point[1] !== r.point[1]);
				routeLayer.setLatLngs(route.map((point) => point));
				map.removeLayer(marker);
				markers = markers.filter((m) => m !== marker);
				updateDestinationsList();
			});
		});
		updateDestinationsList();
	}
});
