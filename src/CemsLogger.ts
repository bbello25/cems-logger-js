import BrowserSession from './BrowserSession'
import { InitializationError } from './InitializationError'

let instance: CemsLogger

const defaultOptions = {
  apiKey: '',
  appName: 'unknown',
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
  private readonly email: string
  private ip!: string
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

  /**
   *  healthCheck function
   */

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
    const errorLog = await this.errorLogFromError(error)

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
      body: JSON.stringify(errorLog)
    })
      .then(res => 1 === 1)
      .catch(reason => console.error(reason))
  }

  public async errorLogFromError(error: Error) {
    return {
      name: error.name,
      source: this.appName,
      email: this.email,
      ip: await this.getIp(),
      message: error.message,
      stackTrace: error.stack,
      timestamp: Math.floor(Date.now() /1000),
      sessionInfo: JSON.stringify(this.browserSession.getClientInfo()),
      progLanguage: "javascript"
    }
  }

  public throwError() {
    throw new Error('Erro in typescript file')
  }

  private async getIp() {
    try {
      const res = await fetch('https://api.ipify.org/?format=json')
      const json = await res.json()
      return json.ip
    } catch (e) {
      console.error(e)
    }
    /*
    const request = new XMLHttpRequest();
    request.open("GET", "https://api.ipify.org/?format=json", false); // `false` makes the request synchronous
    request.send(null);
    const json = JSON.parse(request.responseText);*/
  }
}
