document.addEventListener("DOMContentLoaded", () => {
	const activitiesContainer = document.getElementById("activities-container");
	let route = [];

	document.getElementById("import-route").addEventListener("change", (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				route = JSON.parse(e.target.result);
				displayActivities();
			};
			reader.readAsText(file);
		}
	});

	document.getElementById("export-activities").addEventListener("click", () => {
		const activities = route.map((location, index) => {
			const activityElements = document.querySelectorAll(`#activities-${index} .activity`);
			const dateElements = document.querySelectorAll(`#activities-${index} .date-picker`);
			const activityList = Array.from(activityElements).map((el, i) => {
				return `${el.value} (Date and Time: ${dateElements[i].value})`;
			});
			return { ...location, activities: activityList };
		});

		let textFileContent = activities
			.map((activity) => {
				return `${activity.address}, ${activity.country}:\n${activity.activities.join("\n")}`;
			})
			.join("\n\n");

		const blob = new Blob([textFileContent], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "activities.txt";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	});

	const displayActivities = () => {
		activitiesContainer.innerHTML = "";
		route.forEach((location, index) => {
			const locationDiv = document.createElement("div");
			locationDiv.className = "bg-white rounded-lg shadow-md p-6 mb-4 w-full";
			locationDiv.innerHTML = `
    <h3 class="text-2xl font-bold mb-4">${location.address}, ${location.country}</h3>
    <div id="activities-${index}" class="activities-list">
        <input type="text" class="activity w-full p-2 mb-2 border border-gray-300 rounded-lg" placeholder="Activity">
        <input type="text" class="date-picker w-full p-2 mb-2 border border-gray-300 rounded-lg" placeholder="Select date and time">
    </div>
    <button class="add-activity bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition" data-index="${index}">Add Activity</button>
`;
			activitiesContainer.appendChild(locationDiv);

			// Initialize date picker
			flatpickr(`.date-picker`, {
				enableTime: true,
				dateFormat: "Y-m-d H:i",
			});
		});

		document.querySelectorAll(".add-activity").forEach((button) => {
			button.addEventListener("click", (event) => {
				const index = event.target.getAttribute("data-index");
				const activitiesList = document.getElementById(`activities-${index}`);
				const newActivityInput = document.createElement("input");
				newActivityInput.type = "text";
				newActivityInput.className = "activity w-full p-2 mb-2 border border-gray-300 rounded-lg";
				newActivityInput.placeholder = "Activity";
				const newDatePicker = document.createElement("input");
				newDatePicker.type = "text";
				newDatePicker.className = "date-picker w-full p-2 mb-2 border border-gray-300 rounded-lg";
				newDatePicker.placeholder = "Select date and time";
				activitiesList.appendChild(newActivityInput);
				activitiesList.appendChild(newDatePicker);

				// Reinitialize date picker
				flatpickr(newDatePicker, {
					enableTime: true,
					dateFormat: "Y-m-d H:i",
				});
			});
		});
	};
});
