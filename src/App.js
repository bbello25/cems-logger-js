/* eslint-disable no-console */
import CemsSession from './CemsSession.js';

let instance;

class CemsLogger {
    
	constructor(endPointURL, apiKey) {
		if (instance) {
			return instance;
		}
		instance = this;
		this.endPointUrl = `http://${endPointURL}/api/log/`;
		this.apiKey = apiKey;
		this.healthCheck();
		this._session = new CemsSession();
		this.registerGlobalErrorHandler();
	}

	registerGlobalErrorHandler() {
		window.onerror = (message, source, lineno, colno, error) => {
			this.sendLog(error);
			return false;
		};
	}

	healthCheck() {
		fetch(this.endPointUrl + 'healthCheck', {
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'api-key': this.apiKey
			},
		})
			.then(res => console.log(res))
			.catch(reason => console.log(reason));
	}

	sendLog(error, name) {
		const errorLog = CemsLogger.errorLogFromError(error, name);

		fetch(this.endPointUrl + 'browserError', {
			method: 'post',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'api-key': this.apiKey
			},
			body: JSON.stringify(errorLog)
		})
			.then(res => console.log(res))
			.catch(reason => console.log(reason));
	}

	errorLogFromError(error, name) {
		return {
			name: error.name,
			source: name | 'unknown',
			message: error.message,
			stacktrace: error.stack,
			timestamp: new Date().toLocaleString(),
			sessionData: this._session.getClientInfo()
		};
	}

}

export default CemsLogger;