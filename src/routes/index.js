var express = require("express");
var router = express.Router();
const level = require("level");
const Attempt = require("../../data/mongo/models/Attempt");

const quranWordsLength = 14867;
const quranNumberedDB = level("data/once/quranNumber.list");
const quran = level("data/once/quran.list");

const ATTEMPT_MAX_TIMES = 6;
/* GET home page. */
router.get("/", function (req, res, next) {
	res.redirect("/home.html");
});

router.get("/quran/new", async function (req, res, next) {
	// will generate a new word
	let number = generateRandom();
	const value = await quranNumberedDB.get(number);

	const attempt = new Attempt({
		theWord: value,
		theWordLength: value.length,
	});
	let saved = await attempt.save();

	res.redirect(`/main.html?id=${saved.id}`);
	// a new uid(URL) for level db storage
});

router.get("/attempt/get/:id", async function (req, res, next) {
	let attempt = await Attempt.findOne({ _id: req.params.id });
	if (!(attempt.won || attempt.lost)) {
		attempt = attempt.toObject();
		delete attempt.theWord;
		attempt.ATTEMPT_MAX_TIMES = ATTEMPT_MAX_TIMES;
		console.log(attempt);
	}
	res.json(attempt);
});

router.get("/attempt/:id/:word", async function (req, res, next) {
	let word = req.params.word;
	let id = req.params.id;
	const attempt = await Attempt.findOne({ _id: id });
	let theWord = attempt.theWord;
	let result = [];
	let won = true;
	let element;

	// check number of attempts and won lost
	let theWordLength = attempt.theWordLength;

	if (theWord !== word) {
		won = false;
	}

	for (let i = 0; i < theWordLength; i++) {
		if (theWord[i] == word[i]) {
			element = { index: i, letter: word[i], position: "exact" };
			theWord = theWord.replace(word[i], "-");
			word = word.replace(word[i], "*");
			result[i] = element;
			await Attempt.updateOne({ _id: id }, { $push: { state: element } });
		}
	}

	if (!won)
		for (let i = 0; i < theWordLength; i++) {
			if (word[i] !== "*") {
				let index = theWord.indexOf(word[i]);
				if (index > -1) {
					element = { index: i, letter: word[i], position: "exist" };
					result[i] = element;
					theWord = theWord.replace(word[i], "-");
					word = word.replace(word[i], "*");
				} else {
					element = { index: i, letter: word[i], position: "notExist" };
					result[i] = element;
				}
				await Attempt.updateOne({ _id: id }, { $push: { state: element } });
			}
		}

	await Attempt.updateOne(
		{ _id: id },
		{
			$inc: {
				attempts: 1,
			},
			won: won,
		}
	);

	let revealWord;
	if (attempt.attempts + 1 == ATTEMPT_MAX_TIMES || won) {
		revealWord = attempt.theWord;
		if (!won)
			await Attempt.updateOne(
				{ _id: id },
				{
					lost: true,
				}
			);
	}

	res.json({ result: result, won, revealWord });
});

function incrementAttempt(gameId) {}

router.get("/isWord/:word", async function (req, res, next) {
	let word = req.params.word;
	try {
		const value = await quran.get(word);
		res.json("a_word");
	} catch (err) {
		console.error(err);
		res.json("not_a_word");
	}
});

function generateRandom(min = 0, max = quranWordsLength) {
	// find diff
	let difference = max - min;

	// generate random number
	let rand = Math.random();

	// multiply with difference
	rand = Math.floor(rand * difference);

	// add with min value
	rand = rand + min;

	return rand;
}

module.exports = router;
