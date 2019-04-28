import { ExceptionDetails } from "./ExceptionDetails.model";
import { JavascriptApplicationInfo } from "./JavascriptApplicationInfo.model";
import { BrowserSessionState } from "./BrowserSession";
import { BrowserInfo } from "./BrowserInfo.model";
import {ApplicationInfo} from "./ApplicationInfo.model";

export class JavascriptLog {
    platform: number;
    timestamp: Date;
    exceptionDetails: ExceptionDetails;
    applicationInfo: ApplicationInfo;
    javascriptApplicationInfo: JavascriptApplicationInfo;
    javascriptSessionInfo: BrowserSessionState;
    JavascriptBrowserInfo: BrowserInfo;

    constructor() {
        this.platform = 2;
        this.timestamp = new Date();
        this.applicationInfo = new ApplicationInfo();
        this.JavascriptBrowserInfo = new BrowserInfo();
        this.exceptionDetails = new ExceptionDetails();
        this.javascriptApplicationInfo = new JavascriptApplicationInfo();
    }
}
