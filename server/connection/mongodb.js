const mongoose = require("mongoose");

mongoose.connect(
	process.env.MONGO_URI || `mongodb://localhost:27017/zablot`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
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
