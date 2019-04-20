import { ExceptionDetails } from "./ExceptionDetails.model";
import { JavascriptApplicationInfo } from "./JavascriptApplicationInfo.model";
import { BrowserSessionState } from "./BrowserSession";
import { BrowserInfo } from "./BrowserInfo.model";

export class JavascripLog {
    platform: number
    timestamp: Date
    exceptionDetails: ExceptionDetails;
    javascriptApplicationInfo: JavascriptApplicationInfo
    javascriptSessionInfo: BrowserSessionState
    JavascriptBrowserInfo: BrowserInfo

    constructor() {
        this.platform = 2;
        this.timestamp = new Date();
        this.JavascriptBrowserInfo = new BrowserInfo();
        this.exceptionDetails = new ExceptionDetails();
        this.javascriptApplicationInfo = new JavascriptApplicationInfo();
    }
}