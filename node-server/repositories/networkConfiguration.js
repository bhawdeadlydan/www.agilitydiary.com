var os = require('os');
var interfaces = os.networkInterfaces();
var addresses = [];

function scanIpAddresses() {
	var k, k2, address;

	for (k in interfaces) {
		for (k2 in interfaces[k]) {
			address = interfaces[k][k2];
			if (address.family == 'IPv4' && !address.internal) {
				addresses.push(address.address);
			}
		}
	}

}


exports.getIpAddresses = function () {
	return addresses;
};
