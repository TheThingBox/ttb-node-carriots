module.exports = function(RED) {
  var request = require('request');

  function sendCarriots(topic, value, device, api_key, timestamp){
    timestamp = Math.round(timestamp/1000)+"";

    var msg = JSON.stringify({
      protocol: "v1",
      at: timestamp,
      device: device,
      data: {
        topic: value
      },
      checksum: ""
    }

    request.post({
      headers: {
        "carriots.apikey": api_key,
        "Content-Type": "application/json"
      },
      url: "http://api.carriots.com/streams",
      body: msg
    }, function(error, response, body) {});
  }

  function CarriotsNode(n) {
    RED.nodes.createNode(this,n);

    this.on("input", function(msg) {
      var topic = msg.topic||n.topic;
      var value = msg.payload;
      var device = msg.device||n.device;
      var api_key = msg.api_key||n.api_key;
      var timestamp = msg.timestamp || Date.now();
      sendCarriots(topic, value, device, api_key, timestamp);
    });
  }
  RED.nodes.registerType("carriots",CarriotsNode);
}
