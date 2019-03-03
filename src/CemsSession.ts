import { BrowserInfo } from './BrowserInfo';

export class CemsSession {
  private sid: string = 'unknown';
  private sessionStartTime: Date;
  private browserProperties: BrowserInfo;
  private screenProperties: any;
  constructor() {
    if (document.cookie) {
      const res = document.cookie.match('sid=([^;]*)');
      if (res) {
        this.sid = res[1];
      }
    }
    this.sessionStartTime = new Date();
    // this.timezone = (new Date()).getTimezoneOffset() / 60;

    this.browserProperties = BrowserInfo.browserProperties();
    this.screenProperties = this.getscreenProperties();
  }

  public getscreenProperties(): any {
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

  public getClientInfo(): any {
    const currentTime = new Date();
    const sesionDuration =
      (currentTime.getTime() - this.sessionStartTime.getTime()) / 1000;
    return {
      sid: this.sid,
      sessionDuration: sesionDuration,
      browserProperties: this.browserProperties,
      screenProperties: this.screenProperties
    };
  }
}
