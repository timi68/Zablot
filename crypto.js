// Nodejs encryption with CTR
const {
	scrypt,
	randomFill,
	randomFillSync,
	scryptSync,
	createCipheriv,
	createDecipheriv,
} = require("crypto");
const algorithm = "aes-256-cbc";

function encrypt(text) {
	scrypt("1234", "salt", 24, (err, key) => {
		if (err) throw err;

		randomFill(new Uint8Array(16), (err, iv) => {
			if (err) throw err;

			let cipher = createCipheriv("aes-192-cbc", key, iv);

			// let encrypted = "";
			// cipher.on("data", (chunk) => (encrypted += chunk));
			// cipher.on("end", () => console.log(encrypted));
			// cipher.write(text);
			// cipher.end();
			let en = cipher.update(text, "utf8", "hex");
			en += cipher.final("hex");
			console.log(en);
		});
	});
}

function decrypt(text) {
	let iv = randomFillSync(new Uint8Array(16));
	let key = scryptSync("1234", "salt", 24);

	let decipher = createDecipheriv("aes-192-cbc", key, iv);
	let decrypted = decipher.update(text, "hex", "utf8");

	decrypted += decipher.final("utf8");

	console.log(decrypted);
}

encrypt("Some serious stuff");
decrypt("ea908738a5e7b47ab42dbeb13d623b438f00a345181eb9fd4c163061db6a74f2");
