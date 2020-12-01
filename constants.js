const idURL = "https://us-west-2-perf-api.queue-it.net/perf/timings";
const baseStatusURL = "https://direct-queue.playstation.com/spa-api/queue/sonyied/psdirectprodku1/00000000-0000-0000-0000-000000000000/status"
const url = "http://direct.playstation.com/";
const queueRefresh = 2; // seconds
const refreshTime = 2; // seconds to refresh id if expired
const baseReqStart = 1605743184552;
const baseRespStart = 1605743184732;
const baseRespEnd = 1605743184831;
const queueIDHdr = "x-amzn-requestid";
const baseID = "00000000-0000-0000-0000-000000000000";
const oosMsg = "out of stock";
const captchaPrefix = "https://direct-queue.playstation.com";

const errors = {
	OK: 0,
	CAPTCHA: 1,
	MESSAGE: 2,
	QUEUE: 3,
	ERR: 4
}

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

module.exports = {
	idURL: idURL,
	baseStatusURL: baseStatusURL,
	queueRefresh: queueRefresh,
	refreshTime: refreshTime,
	baseReqStart: baseReqStart,
	baseRespStart: baseRespStart,
	baseRespEnd: baseRespEnd,
	queueIDHdr: queueIDHdr,
	baseID: baseID,
	oosMsg: oosMsg,
	captchaPrefix: captchaPrefix,
	errors: errors,
	idBodyTemp: idBodyTemp,
	statusBody: statusBody
};