const { app, BrowserWindow, session } = require('electron');
const notifier = require('node-notifier');
const fetch = require('electron-fetch').default;

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function notify(title, message) {
	notifier.notify({title: title, message: message, sound: true});
}

const idURL = "https://us-west-2-perf-api.queue-it.net/perf/timings";
const baseStatusURL = "https://direct-queue.playstation.com/spa-api/queue/sonyied/psdirectprodku1/00000000-0000-0000-0000-000000000000/status"
const url = "http://direct.playstation.com/";
const waitTime = 10; // seconds
const queueRefresh = 2; // seconds
const refreshTime = 2; // seconds to refresh id if expired
const baseReqStart = 1605743184552;
const baseRespStart = 1605743184732;
const baseRespEnd = 1605743184831;
const queueIDHdr = "x-amzn-requestid";
const baseID = "00000000-0000-0000-0000-000000000000";
const oosMsg = "out of stock";

const errors = {
	OK: 0,
	CAPTCHA: 1,
	MESSAGE: 2,
	QUEUE: 3,
	ERR: 4
}

let ses;

let idBodyTemp = [
    {"method":"GET","requestType":"PAGE","pageUrl":"https://direct-queue.playstation.com/",
     "userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
     "requestStart":1605743184552,"responseStart":1605743184732,"responseEnd":1605743184831,"customerId":"sonyied","tags":
     [
         {"key":"eventid","value":"psdirectprodku1"},{"key":"queueid","value":"00000000-0000-0000-0000-000000000000"},
         {"key":"queueit","value":"queue"}
     ]
    }
];
let statusBody = {
    "targetUrl":"https://direct.playstation.com/en-us","customUrlParams":"",
    "layoutVersion":162173827357,"layoutName":"SafetyNet - v20200622",
    "isClientRedayToRedirect":true,"isBeforeOrIdle":false
};

async function generateID() {
	// calculate scaling values
	let timestamp = new Date().getTime();
	let requestLength = baseRespEnd - baseReqStart;
	let latency = baseRespStart - baseReqStart;
	let processTime = baseRespEnd - baseRespStart;
	
	// generate simulated timestamp info
	let idBody = [{
		...idBodyTemp[0], 
		requestStart: (timestamp - requestLength), 
		responseStart: (timestamp - requestLength) + latency,
		responseEnd: ((timestamp - requestLength) + latency) + processTime
	}]
	
	let res = await fetch(idURL, {
		method: "post",
		body:	JSON.stringify(idBody),
		session: ses,
		useSessionCookies: true,
	});
	
	if (res.ok) return res.headers.get(queueIDHdr);
	else return 0;
}

async function checkStatus(queueID) {
	let statusURL = baseStatusURL.replace(baseID, queueID);
	let res = await fetch(statusURL, {
		method: "post",
		body:	JSON.stringify(statusBody),
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
		
		if (redir) return errors.CAPTCHA;
		if (msg) {
			console.log(msg);
			let text = msg.text.toLowerCase();
			if (!text.includes(oosMsg)) return errors.MESSAGE;
		}
		if (ticket) {
			console.log(ticket);
			if (ticket.whichIsIn != "less than a minute" || ticket.usersInQueue > 0) return errors.QUEUE;
		}
		return errors.OK;
	} catch (e) {
		return e;
	}
}

async function doCaptcha() {
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
		win.loadURL(url);
		win.on('closed', _ => {
			resolve();
		});
	});
}

async function createWindow() {
	ses = session.fromPartition('persist:playstation');

	let queueID = await generateID();
	if (queueID) {
		let err;
		while (true) {
			err = await checkStatus(queueID);
			switch (err) {
			case errors.OK:
				break;
			case errors.CAPTCHA:
				console.log("need to do captcha!");
				notify("Captcha required", "Go do the captcha!");
				await doCaptcha();
				console.log("captcha window closed");
				break;
			case errors.MESSAGE:
				console.log("message found!");
				notify("Queue message found!", "Go to the site!")
				return;
			case errors.QUEUE:
				console.log("updated queue info found!");
				notify("Queue info changed!", "Go to the site!");
				return;
			default:
				console.log(err);
			}
			await sleep(queueRefresh * 1000);
		}
	}
}

app.on('window-all-closed', () => {
  //console.log("dont stop");
})

app.whenReady().then(createWindow);