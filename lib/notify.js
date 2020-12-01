const notifier = require('node-notifier');

async function notify(title, message) {
	return notifier.notify({title: title, message: message, sound: true});
}

module.exports = notify;