const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGO_URI || `mongodb://127.0.0.1:27017/zablot`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, connected) => {
    if (!connected) {
      console.log("database failed to connect");
      process.exit(1);
    } else {
      console.log("database connected");
    }
  }
);
