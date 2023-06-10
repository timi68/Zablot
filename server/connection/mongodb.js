const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connection) => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log("database failed to connect");
    process.exit(1);
  });
