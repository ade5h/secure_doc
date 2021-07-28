var key = "real secret keys should be long and random";

// Create an encryptor:
var encryptor = require("simple-encryptor")(key);

var anotherEncryptor = require("simple-encryptor")("this is a good password");

var obj = {
	foo: {
		bar: [1, "baz"],
	},
};

console.log(obj);
var objEnc = encryptor.encrypt(obj);
// Should print gibberish:
console.log("obj encrypted: %s", objEnc);
var objDec = anotherEncryptor.decrypt(objEnc);
// Should print: {"foo":{"bar":[1,"baz"]}}
console.log("obj decrypted: %j", objDec);

console.log(typeof objDec);
