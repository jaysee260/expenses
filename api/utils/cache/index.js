var redis = require("redis");
var config = require("../../config").redis;
var client = redis.createClient(config.port, config.host);

// client.on("connect", function() {
//     console.log("Redis client connected.");
// })

client.on("error", function(redisConnectionError) {
    console.log("Couldn't connect to Redis; something went wrong");
    throw redisConnectionError;
})

module.exports = client;