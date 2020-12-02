# PS Direct Queue Watcher
A simple human-assisted program that monitors Playstation Direct's queue for updates running on electron. It is ***not*** a bot that will automatically purchase anything for you, nor will it fill out captcha for you.

Obtaining a PS5 has been a hassle, with Sony's own Playstation Direct being the most reliable way of obtaining one. However, even that isn't without its own issues, as Sony's website puts up a queue at times that are unknown until the queue is already up. Coupled with that, manually refreshing itself won't work as intended, as the website's cookies may prevent you from entering the queue on time. This was made specifically to make it easier, alerting you immediately when a new queue begins.

## Prerequisites
* [Git](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org)

## Installation
1. Clone the repo using the following command in a bash-like terminal (Git Bash, bundled with Git, works well):\
`git clone https://github.com/jejei/ps-direct-queue-watcher.git`

2. Navigate into the cloned repo's folder:\
`cd ps-direct-queue-watcher`

3. Install the required dependencies:\
`npm install`

## Usage
Run the program using the following command:\
`npm start`

Shortly after starting the program, you will likely be prompted via a notification and a pop-up to do a captcha check. Complete it, then close the pop-up. The program will then resume operating as normal. Captcha checks may continue to appear afterward, seemingly around every 24 hours.

## Configuration
Logging settings can be changed via the config.json file. [pino](https://github.com/pinojs/pino) is used for logging. By default, the log level is trace, i.e. all log messages are output, and prettyPrint is enabled. See pino's documentation for more info.

## Notes
* Does not work outside of US. As far as I know, there are queues for other countries, however this program does not consider them.
* Needs better error handling. As is, I have not encountered many errors, and have failed to replicate the few I have.
