const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const portfinder = require("portfinder");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/generate-itinerary", async (req, res) => {
	const { preferences } = req.body;

	try {
		const message = `${preferences}`;
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: "You are an assistant that generates travel itineraries ordered per day, with timestamps.",
				},
				{ role: "user", content: message },
			],
			temperature: 0.7,
			max_tokens: 1000,
		});
		const itinerary = response.data.choices[0].text;
		res.json({ itinerary });
	} catch (error) {
		console.error(error);
		res.status(500).send("Error generating itinerary");
	}
});

portfinder.getPort((err, port) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
});
