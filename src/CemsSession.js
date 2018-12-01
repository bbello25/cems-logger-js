import BrowserInfo from './BrowserInfo';

export default class CemsSession {
	constructor() {
		if (document.cookie) {
			this.sid = document.cookie.match('sid=([^;]*)')[1];
		}
		this.sessionStartTime = new Date();
		this.timezone = (new Date()).getTimezoneOffset() / 60;

		this.browserProperties = BrowserInfo.browserProperties();
		this.screenProperties = CemsSession.screenProperties();
	}

	static screenProperties() {
		return {
			screenScreenW: window.screen.width,
			screenScreenH: window.screen.height,
			sizeDocumentW: document.width,
			sizeDocumentH: document.height,
			sizeInnerW: window.innerWidth,
			sizeInnerH: window.innerHeight,
			screenAvailW: window.screen.availWidth,
			screenAvailH: window.screen.availHeight,
			scrColorDepth: window.screen.colorDepth,
			scrPixelDepth: window.screen.pixelDepth
		};
	}

	getClientInfo() {
		return {
			sid: this.sid,
			sessionStartTime: this.sessionStartTime,
			timezone: this.timezone,
			browserProperties: this.browserProperties,
			screenProperties: this.screenProperties
		};
	}

	static getBrowserName() {
		let sBrowser, sUsrAg = navigator.userAgent;

		//The order matters here, and this may report false positives for unlisted browsers.
		if (sUsrAg.indexOf('Firefox') > -1) {
			sBrowser = 'Mozilla Firefox';
		} else if (sUsrAg.indexOf('Opera') > -1) {
			sBrowser = 'Opera';
		} else if (sUsrAg.indexOf('Trident') > -1) {
			sBrowser = 'Microsoft Internet Explorer';
		} else if (sUsrAg.indexOf('Edge') > -1) {
			sBrowser = 'Microsoft Edge';
		} else if (sUsrAg.indexOf('Chrome') > -1) {
			sBrowser = 'Google Chrome or Chromium';
		} else if (sUsrAg.indexOf('Safari') > -1) {
			sBrowser = 'Apple Safari';
		} else {
			sBrowser = 'unknown';
		}
		return sBrowser;
	}

}
