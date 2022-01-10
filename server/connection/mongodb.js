const mongoose = require("mongoose");

mongoose.connect(
	process.env.MONGO_URI || `mongodb://localhost:27017/zablot`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		autoIndex: false, // Don't build indexes
		maxPoolSize: 10, // Maintain up to 10 socket connections
		serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
		socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
		family: 4, // Use IPv4, skip trying IPv6
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
