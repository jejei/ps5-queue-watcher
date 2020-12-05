# PS Direct Queue Watcher
A simple program that monitors Playstation Direct's queue for updates running on electron. It is ***not*** a bot that will automatically purchase anything for you, nor will it fill out captcha for you; rather, it assumes you are actively using your computer.

Obtaining a PS5 has been a hassle, with Sony's own Playstation Direct being the most reliable way of obtaining one. However, even that isn't without its own issues, as Sony's website puts up a queue at times that are unknown until the queue is already up. Coupled with that, manually refreshing itself won't work as intended, as the website's cookies may prevent you from entering the queue on time. This was made specifically to make the process easier, alerting you immediately when a new queue begins.

## Prerequisites
* [Git](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org)

## Installation
1. Clone the repo using the following command in a bash-like terminal (Git Bash, bundled with Git, works well):\
`git clone https://github.com/jejei/ps5-queue-watcher.git`

2. Navigate into the cloned repo's folder:\
`cd ps-direct-queue-watcher`

3. Install the required dependencies:\
`npm install`

## Usage
Run the program using the following command while in the repo's directory:\
`npm start`

Shortly after starting the program, you will likely be prompted via a notification and a pop-up to do a captcha check. Complete it, then close the pop-up. The program will then resume operating as normal. Captcha checks may continue to appear afterward, seemingly around every 24 hours.

![](https://i.imgur.com/xAcctmg.jpg)

After the queue goes up, you will receive some sort of notification like the following:

![](https://i.imgur.com/DkcRS3w.jpg)

After receiving a notification like this, you should go to the website on your own browser and join the queue. Make sure to also exit the program to avoid being bombarded by notifications, which can be done by hitting Ctrl+C.

## Configuration
Logging settings can be changed via the config.json file. [pino](https://github.com/pinojs/pino) is used for logging. By default, the log level is trace, i.e. all log messages are output, and prettyPrint is enabled. See pino's documentation for more info.

## Tips
* Sign-in to your Playstation account on your browser before it is your turn in the queue. To do this, go on Playstation's main website and login. Once you pass the queue, you can then just click the "Sign-in" button to automatically be signed in on the shop's website.
* Have your address on record in advance. This can be done by going to "My Account" on PS Direct's website when a queue isn't active.
* Have your payment info on record if possible. That being said, saving payment info on your account is more problematic than saving your address, as it seems to require purchasing something via Playstation Direct.

## Notes
* Has only been tested on Windows 10.
* Does not work outside of US. As far as I know, there are queues for other countries, however this program does not consider them.
* Needs better error handling. As is, I have not encountered many errors, and have failed to replicate the few I have.
* No unique way to identify notifications outside of reading them, perhaps add some unique sounds and images.
* Currently spams the user with notifications upon finding a queue; in my personal experience, I have missed the notification due to lack of attention, and thus have found this way to be more helpful.
