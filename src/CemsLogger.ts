import * as Convert from "convert-source-map";
import * as StackTrace from "stacktrace-js";
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

  public async sendLog(error: Error) {
    const errorLog = await this.errorLogFromError(error);

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

  public async errorLogFromError(error: Error) {
    return {
      name: error.name,
      source: this.appName,
      email: this.email,
      ip: await this.getIp(),
      message: error.message,
      stacktrace: error.stack,
      timestamp: new Date().toLocaleString(),
      sessionInfo: this.session.getClientInfo()
    };
  }

  private async getIp() {
    try {
      const res = await fetch("https://api.ipify.org/?format=json");
      const json = await res.json();
      return json.ip;
    } catch (e) {
      console.error(e);
    }
    /*
    const request = new XMLHttpRequest();
    request.open("GET", "https://api.ipify.org/?format=json", false); // `false` makes the request synchronous
    request.send(null);
    const json = JSON.parse(request.responseText);*/
  }

  private async stackTraceFromError(error: Error) {
    const stackFrames = await StackTrace.fromError(error);
    stackFrames.forEach(element => {
      console.log(element);
    });
    return stackFrames;
  }
}
