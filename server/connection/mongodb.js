const mongoose = require("mongoose");

mongoose.connect(
	`mongodb://localhost:27017/zablot`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	(err, connected) => {
		if (!connected) {
			console.log("database failed to conect");
			process.exit(1);
		} else {
			console.log("database connected");
		}
	}
);
