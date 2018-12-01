import { BrowserInfo } from "./BrowserInfo";

export class name {
  private sid: string = "unknown";
  private sessionStartTime: Date;
  private browserProperties: BrowserInfo;
  private screenProperties: any;
  constructor() {
    if (document.cookie) {
      const res = document.cookie.match("sid=([^;]*)");
      if (res) {
        this.sid = res[1];
      }
    }
    this.sessionStartTime = new Date();
    // this.timezone = (new Date()).getTimezoneOffset() / 60;

    this.browserProperties = BrowserInfo.browserProperties();
    this.screenProperties = this.getscreenProperties();
  }

  getscreenProperties(): any {
    return {
      screenScreenW: window.screen.width,
      screenScreenH: window.screen.height,
      sizeInnerW: window.innerWidth,
      sizeInnerH: window.innerHeight,
      screenAvailW: window.screen.availWidth,
      screenAvailH: window.screen.availHeight,
      scrColorDepth: window.screen.colorDepth,
      scrPixelDepth: window.screen.pixelDepth
    };
  }

  getClientInfo(): any {
    return {
      sid: this.sid,
      sessionStartTime: this.sessionStartTime,
      browserProperties: this.browserProperties,
      screenProperties: this.screenProperties
    };
  }
}
