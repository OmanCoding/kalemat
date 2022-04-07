const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const schema = mongoose.Schema({
	_id: { type: String, default: uuidv4 },
	won: { type: Boolean, default: false },
	lost: { type: Boolean, default: false },
	user: { type: String, default: null },
	attempts: { type: Number, default: 0 },
	state: Array,
	theWord: String,
	theWordLength: Number,
	// create date
	// won or lost date
});

module.exports = mongoose.model("Attempt", schema);
