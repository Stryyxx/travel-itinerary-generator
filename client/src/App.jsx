import React, { useState, useEffect } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";

function App() {
	const [preferences, setPreferences] = useState("");
	const [countries, setCountries] = useState([]);
	const [cities, setCities] = useState([]);
	const [selectedCountry, setSelectedCountry] = useState("");
	const [selectedCity, setSelectedCity] = useState("");
	const [days, setDays] = useState("");
	const [itinerary, setItinerary] = useState("");

	useEffect(() => {
		// Fetch country data (You can replace this with an actual API call)
		setCountries(["Australia", "United States", "Germany"]);
	}, []);

	useEffect(() => {
		// Fetch city data based on selected country (You can replace this with an actual API call)
		if (selectedCountry === "Australia") {
			setCities(["Sydney", "Melbourne", "Brisbane"]);
		} else if (selectedCountry === "United States") {
			setCities(["New York", "Los Angeles", "Chicago"]);
		} else if (selectedCountry === "Germany") {
			setCities(["Berlin", "Munich", "Hamburg"]);
		}
	}, [selectedCountry]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const message = `Generate a travel itinerary for ${selectedCity}, ${selectedCountry} for ${days} days based on these preferences: ${preferences}`;
			const response = await axios.post("http://localhost:5000/api/generate-itinerary", { preferences: message });
			setItinerary(response.data.itinerary);
		} catch (error) {
			console.error("Error generating itinerary:", error);
			setItinerary("Error generating itinerary. Please try again.");
		}
	};

	return (
		<div className="bg-gray-100 font-sans leading-normal tracking-normal min-h-screen">
			<nav className="bg-blue-800 p-4 text-white">
				<div className="container mx-auto flex justify-between items-center">
					<a href="/" className="text-xl font-bold">
						Travel Guide
					</a>
					<div>
						<a href="#planner" className="ml-4">
							Itinerary Planner
						</a>
					</div>
				</div>
			</nav>

			<header className="bg-cover bg-center h-screen" style={{ backgroundImage: "url(your-image-url.jpg)" }}>
				<div className="flex items-center justify-center h-full bg-gray-900 bg-opacity-50">
					<div className="text-center text-white">
						<h1 className="text-4xl font-bold mb-4">Explore the World</h1>
						<p className="text-xl mb-8">Discover amazing places with our interactive travel guide</p>
						<a href="#planner" className="bg-blue-500 px-6 py-3 text-lg rounded-full hover:bg-blue-700 transition">
							Get Started
						</a>
					</div>
				</div>
			</header>

			<section id="planner" className="bg-gray-200 py-16">
				<div className="container mx-auto">
					<h2 className="text-3xl font-bold text-center mb-8">Itinerary Planner</h2>
					<form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
						<div className="mb-4">
							<label className="block text-gray-700 font-bold mb-2" htmlFor="country">
								Country
							</label>
							<select
								id="country"
								className="w-full p-2 border border-gray-300 rounded-lg"
								value={selectedCountry}
								onChange={(e) => setSelectedCountry(e.target.value)}
							>
								<option value="" disabled>
									Select a country
								</option>
								{countries.map((country, index) => (
									<option key={index} value={country}>
										{country}
									</option>
								))}
							</select>
						</div>
						<div className="mb-4">
							<label className="block text-gray-700 font-bold mb-2" htmlFor="city">
								City
							</label>
							<select
								id="city"
								className="w-full p-2 border border-gray-300 rounded-lg"
								value={selectedCity}
								onChange={(e) => setSelectedCity(e.target.value)}
								disabled={!selectedCountry}
							>
								<option value="" disabled>
									Select a city
								</option>
								{cities.map((city, index) => (
									<option key={index} value={city}>
										{city}
									</option>
								))}
							</select>
						</div>
						<div className="mb-4">
							<label className="block text-gray-700 font-bold mb-2" htmlFor="days">
								Number of Days
							</label>
							<input
								type="number"
								id="days"
								className="w-full p-2 border border-gray-300 rounded-lg"
								placeholder="Enter number of days"
								value={days}
								onChange={(e) => setDays(e.target.value)}
							/>
						</div>
						<div className="mb-4">
							<label className="block text-gray-700 font-bold mb-2" htmlFor="preferences">
								Travel Preferences
							</label>
							<input
								type="text"
								id="preferences"
								className="w-full p-2 border border-gray-300 rounded-lg"
								placeholder="Enter your preferences"
								value={preferences}
								onChange={(e) => setPreferences(e.target.value)}
							/>
						</div>
						<button
							type="submit"
							className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
						>
							Get Itinerary
						</button>
					</form>
					{itinerary && (
						<div id="itinerary-result" className="mt-8 p-4 bg-white rounded-lg shadow-md">
							<h3 className="text-2xl font-bold mb-4">Your Itinerary:</h3>
							<p>{itinerary}</p>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}

export default App;
