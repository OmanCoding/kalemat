const fs = require("fs");

const level = require("level");
let quranWordsLength = 14867;
const db = level("quranNumber.list");

(async function () {
	/* */
	try {
		const data = fs.readFileSync("quran.wordlist.txt", "utf8");
		let lines = data.split("\n");
		//let entries = Object.entries(lines);
		let length = lines.length;
		//for (var line of lines) {
		for (i = 0; i < length; i++) {
			await db.put(i, lines[i]);
			const value = await db.get(i);
			console.log(i, value);
		}
	} catch (err) {
		console.error(err);
	}
	let words = [];
	db.createKeyStream()
		.on("data", function (data) {
			words.push(data);
		})
		.on("end", function () {
			console.log(words, words.length);
		});
})();
