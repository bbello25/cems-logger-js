import { CemsSession } from "./CemsSession";
import { InitializationError } from "./InitializationError";

let instance: CemsLogger;

const defaultOptions = {
  apiKey: "",
  appName: "unknown",
  email: "",
  endPointUrl: "http://localhost:5000/"
};

export class CemsLogger {
  public static getLogger(): CemsLogger {
    return instance;
  }

  public static initLogger(options: any): CemsLogger {
    instance = new CemsLogger(options);
    return CemsLogger.getLogger();
  }
  private readonly endPointUrl: string;
  private readonly apiKey: string;
  private readonly appName: string;
  private readonly email: string;
  private ip!: string;
  private session: CemsSession;

  private constructor(options: any) {
    this.endPointUrl = options.endPointUrl || defaultOptions;
    this.endPointUrl += "api/log/";
    if (!options.apiKey) {
      throw new InitializationError(`ApiKey must be defined`);
    }
    this.apiKey = options.apiKey;
    this.appName = options.appName || defaultOptions.appName;
    this.email = options.email || undefined;
    this.session = new CemsSession();
    this.ip = this.getIp();
    this.healthCheck();
  }

  /**
   *  healthCheck function
   */

  public healthCheck(): void {
    fetch(this.endPointUrl + "healthCheck", {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "api-key": this.apiKey
      }
    })
      .then(res => console.log("Logger is running"))
      .catch(reason => console.error(reason));
  }

  public sendLog(error: Error): void {
    const errorLog = this.errorLogFromError(error);

    fetch(this.endPointUrl + "browserError", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "api-key": this.apiKey
      },
      body: JSON.stringify(errorLog)
    })
      .then(res => console.log("Logger is running"))
      .catch(reason => console.error(reason));
  }

  public errorLogFromError(error: Error) {
    return {
      name: error.name,
      source: this.appName,
      email: this.email,
      ip: this.ip,
      message: error.message,
      stacktrace: error.stack,
      timestamp: new Date().toLocaleString(),
      sessionInfo: this.session.getClientInfo()
    };
  }

  private getIp(): string {
    const request = new XMLHttpRequest();
    request.open("GET", "https://api.ipify.org/?format=json", false); // `false` makes the request synchronous
    request.send(null);
    const json = JSON.parse(request.responseText);
    return json.ip;
  }
}
