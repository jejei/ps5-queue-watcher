const { app, BrowserWindow, session } = require('electron');
const fetch = require('electron-fetch').default;
const sleep = require('./lib/sleep');
const notify = require('./lib/notify');
const cons = require('./constants');
const config = require('./config.json');
const logger = require('pino')({ prettyPrint: config.prettyPrint });

logger.level = config.logLevel;

let ses;

async function generateID() {
	// calculate scaling values
	let timestamp = new Date().getTime();
	let requestLength = cons.baseRespEnd - cons.baseReqStart;
	let latency = cons.baseRespStart - cons.baseReqStart;
	let processTime = cons.baseRespEnd - cons.baseRespStart;
	
	// generate simulated timestamp info
	let idBody = [{
		...cons.idBodyTemp[0], 
		requestStart: (timestamp - requestLength), 
		responseStart: (timestamp - requestLength) + latency,
		responseEnd: ((timestamp - requestLength) + latency) + processTime
	}]
	
	let res = await fetch(cons.idURL, {
		method: "post",
		body:	JSON.stringify(idBody),
		session: ses,
		useSessionCookies: true,
	});
	
	if (res.ok) return res.headers.get(cons.queueIDHdr);
	else return 0;
}

async function checkStatus(queueID) {
	let statusURL = cons.baseStatusURL.replace(cons.baseID, queueID);
	let res = await fetch(statusURL, {
		method: "post",
		body:	JSON.stringify(cons.statusBody),
		headers: { 'Content-Type': 'application/json' },
		session: ses,
		useSessionCookies: true,
	});

	if (!res.ok) return await res.text();
	try {
		let json = await res.json();
		let redir = json.redirectUrl;
		let msg = json.message;
		let ticket = json.ticket;
		
		if (redir) return {status: cons.errors.CAPTCHA, redir: redir};
		if (msg) {
			logger.trace(msg);
			let text = msg.text.toLowerCase();
			if (!text.includes(cons.oosMsg)) return {status: cons.errors.MESSAGE, msg: text};
		}
		if (ticket) {
			logger.trace(ticket);
			if (ticket.whichIsIn != "less than a minute" || ticket.usersInQueue > 0) return {status: cons.errors.QUEUE};
		}
		return {status: cons.errors.OK};
	} catch (e) {
		return e;
	}
}

async function doCaptcha(redir) {
	return new Promise(resolve => {
		const win = new BrowserWindow({
			width: 800,
			height: 600,
			webPreferences: {
				session: ses,
				contextIsolation: true,
				nodeIntegration: false,
			}
		});
		win.on('closed', _ => {
			resolve();
		});
		win.loadURL(cons.captchaPrefix + redir);
	});
}

async function queue() {
	ses = session.fromPartition('persist:playstation');
	let queueID = "";
	while (!queueID) {
		queueID = await generateID();
		if (!queueID) {
			logger.debug(`failed to generate queue ID, retrying in ${cons.refreshTime} seconds`);
			await sleep(cons.refreshTime * 1000);
		};
	}
	
	let err;
	while (true) {
		err = await checkStatus(queueID);
		switch (err.status) {
		case cons.errors.OK:
			break;
		case cons.errors.CAPTCHA:
			logger.info("need to do captcha!");
			notify("Captcha required", "Go do the captcha!");
			await doCaptcha(err.redir);
			logger.info("captcha window closed");
			break;
		case cons.errors.MESSAGE:
			logger.info("message found!");
			notify("Queue message found!", "Go to the site!")
			break;
		case cons.errors.QUEUE:
			logger.info("updated queue info found!");
			notify("Queue info changed!", "Go to the site!");
			break;
		default:
			logger.info("encountered error, restarting session");
			logger.error(err);
			await ses.clearStorageData();
			queueID = "";
			while (!queueID) {
				queueID = await generateID();
				if (!queueID) {
					logger.debug(`failed to generate queue ID, retrying in ${cons.refreshTime} seconds`);
					await sleep(cons.refreshTime * 1000)
				};
			}
			logger.info("new queue id generated");
		}
		await sleep(cons.queueRefresh * 1000);
	}
}

app.on('window-all-closed', () => {
  //logger.debug("dont stop");
})

app.whenReady().then(queue).then(app.quit);