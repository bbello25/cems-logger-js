export class CemsLogger {
  private static instance: CemsLogger;

  private readonly endPointUrl: string | undefined;
  private readonly apiKey!: string;

  constructor(endPointURL: string, apiKey: string) {
    if (CemsLogger.instance) {
      return CemsLogger.instance;
    }
    CemsLogger.instance = this;
    this.endPointUrl = `http://${endPointURL}/api/log/`;
    this.apiKey = apiKey;
    this.healthCheck();
  }

  healthCheck(): void {
    fetch(this.endPointUrl + "healthCheck", {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "api-key": this.apiKey
      }
    })
      .then(res => console.log(res))
      .catch(reason => console.log(reason));
  }

  sendLog(error: Error, name: string): void {
    const errorLog = this.errorLogFromError(error, name);

    fetch(this.endPointUrl + "browserError", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "api-key": this.apiKey
      },
      body: JSON.stringify(errorLog)
    })
      .then(res => console.log(res))
      .catch(reason => console.log(reason));
  }

  errorLogFromError(error: Error, name: string) {
    return {
      name: error.name,
      source: name,
      message: error.message,
      stacktrace: error.stack,
      timestamp: new Date().toLocaleString()
      //sessionData: this._session.getClientInfo()
    };
  }
}
