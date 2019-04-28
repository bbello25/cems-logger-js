import BrowserSession from './BrowserSession'
import { InitializationError } from './InitializationError'
import { JavascriptLog } from './JavascriptLog.model';

let instance: CemsLogger;

const defaultOptions = {
  apiKey: '',
  appName: '',
  appVersion: '',
  email: '',
  endPointUrl: 'http://localhost:5000/',
  environment: ''
};

export class CemsLogger {
  public static getLogger(): CemsLogger {
    return instance
  }

  public static initLogger(options: any): CemsLogger {
    instance = new CemsLogger(options);
    return CemsLogger.getLogger()
  }
  private readonly endPointUrl: string;
  private readonly apiKey: string;
  private readonly appName: string;
  private readonly appVersion: string;
  private readonly environment: string;
  private readonly email: string;
  private ip: string;
  private browserSession: BrowserSession;

  private constructor(options: any) {
    this.endPointUrl = options.endPointUrl || defaultOptions;
    this.endPointUrl += 'api/log/';
    if (!options.apiKey) {
      throw new InitializationError(`ApiKey must be defined`)
    }
    this.apiKey = options.apiKey;
    this.appName = options.appName || defaultOptions.appName;
    this.appVersion = options.appVersion || defaultOptions.appVersion;
    this.email = options.email || undefined;
    this.environment = options.environment || defaultOptions.environment;
    this.browserSession = new BrowserSession();
    this.healthCheck()
  }

  public healthCheck(): void {
    this.getIp().then((ip: string) => {
      this.ip = ip
    });
    fetch(this.endPointUrl + 'healthCheck', {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'api-key': this.apiKey
      }
    })
      .then(response => response.text())
      .then((body: string) => {
        this.browserSession.updateSessionId(body)
      })
      .catch(reason => console.error(reason))
  }

  public async sendLog(error: Error) {
    const log = this.logFromError(error);

    fetch(this.endPointUrl + 'javascript', {
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'api-key': this.apiKey,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
      },
      body: JSON.stringify(log)
    })
      .then()
      .catch(reason => console.error(reason))
  }

  public logFromError(error: Error): JavascriptLog {
    let log: JavascriptLog = new JavascriptLog();

    log.javascriptSessionInfo = this.browserSession.getCurrentBrowserSessionState();

    log.applicationInfo.name = this.appName;
    log.applicationInfo.version = this.appVersion;
    log.javascriptApplicationInfo.email = this.email;
    log.javascriptApplicationInfo.ipAddress = this.ip;

    log.exceptionDetails.message = error.message;
    log.exceptionDetails.rawStackTrace = error.stack;
    log.exceptionDetails.source = "";
    log.exceptionDetails.type = error.name;

    return log;
  }

  private async getIp() {
    try {
      const res = await fetch('https://api.ipify.org/?format=json');
      const json = await res.json();
      return json.ip
    } catch (e) {
      console.error(e)
    }
  }
}
