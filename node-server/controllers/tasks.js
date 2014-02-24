// tasks
var secrets = require('../config/secrets');
var amqplib = require('amqplib');


exports.colorific = function (data) {
	open = amqplib.connect(secrets.amqp);

	// Publisher
	open.then(function (conn) {
		var ok = conn.createChannel();

		ok = ok.then(function (ch) {
			//var commonOptions = {durable: false, noAck: false};
			//ch.assertQueue('colorific');
			//
			ch.assertExchange('amq.direct', 'direct');
			var serialized = JSON.stringify(data);
			ch.sendToQueue('colorific', new Buffer(serialized));
		});

		return ok;
	}).then(null, console.warn);

};
