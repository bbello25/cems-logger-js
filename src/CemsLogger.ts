import BrowserSession from './BrowserSession'
import { InitializationError } from './InitializationError'
import { JavascripLog } from './JavascriptLog.model';
import { BrowserInfo } from './BrowserInfo.model';

let instance: CemsLogger

const defaultOptions = {
  apiKey: '',
  appName: 'unknown',
  appVersion: "1.0.0",
  email: '',
  endPointUrl: 'http://localhost:5000/'
}

export class CemsLogger {
  public static getLogger(): CemsLogger {
    return instance
  }

  public static initLogger(options: any): CemsLogger {
    instance = new CemsLogger(options)
    return CemsLogger.getLogger()
  }
  private readonly endPointUrl: string
  private readonly apiKey: string
  private readonly appName: string
  private readonly appVersion: string
  private readonly email: string
  private ip: string
  private browserSession: BrowserSession

  private constructor(options: any) {
    this.endPointUrl = options.endPointUrl || defaultOptions
    this.endPointUrl += 'api/log/'
    if (!options.apiKey) {
      throw new InitializationError(`ApiKey must be defined`)
    }
    this.apiKey = options.apiKey
    this.appName = options.appName || defaultOptions.appName
    this.email = options.email || undefined
    this.browserSession = new BrowserSession()
    this.healthCheck()
  }

  public healthCheck(): void {
    this.getIp().then((ip: string) => {
      this.ip = ip
    })
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
    const log = this.logFromError(error)

    fetch(this.endPointUrl + 'browserError', {
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

  public logFromError(error: Error): JavascripLog {
    let log: JavascripLog = new JavascripLog();

    log.javascriptSessionInfo = this.browserSession.getCurrentBrowserSessionState();

    log.javascriptApplicationInfo.applicationName = this.appName;
    log.javascriptApplicationInfo.applicationVersion = this.appVersion;
    log.javascriptApplicationInfo.email = this.email;
    log.javascriptApplicationInfo.ipAddress = this.ip;

    log.exceptionDetails.message = error.message;
    log.exceptionDetails.rawStackTrace = error.stack;
    log.exceptionDetails.source = "wtf";
    log.exceptionDetails.type = error.name;

    return log;
  }

  private async getIp() {
    try {
      const res = await fetch('https://api.ipify.org/?format=json')
      const json = await res.json()
      return json.ip
    } catch (e) {
      console.error(e)
    }
  }
}
