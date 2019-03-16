import SessionStorageHistoryQueue from './SessionStorageHistoryQueue';
import BrowserInfo  from './BrowserInfo';

export default class BrowserSession {
  private sessionId: string = 'unknown';
  private sessionStartTime: Date;
  private browserProperties: BrowserInfo;
  private screenProperties: any;
  
  // private readonly urlsHistory: SessionStorageHistoryQueue<PopStateEvent>;
  private readonly eventsHistory: SessionStorageHistoryQueue<IMouseEvent>;

  constructor(urlHistoryLimit: number = 5, eventHistoryLimit: number = 10) {
    // this.urlsHistory = new SessionStorageHistoryQueue(
    //   urlHistoryLimit,
    //   'urlsHistory'
    // );
    this.eventsHistory = new SessionStorageHistoryQueue(
      eventHistoryLimit,
      'eventsHistory'
    );
    this.registerClickEventHandler();
    // this.registerHistoryCHangeEventHandler();

    this.sessionStartTime = new Date();
    this.browserProperties = BrowserInfo.browserProperties();
    this.screenProperties = this.getscreenProperties();
  }

  public updateSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  private registerClickEventHandler() {
    document.addEventListener('click', (event: MouseEvent) => {

      const targetElement = event.target as any;
      const e: IMouseEvent = {
        target: {
          elementName:targetElement.localName,
          id: targetElement.id,
          name: targetElement.name,
      },
        timestamp: Date.now(),
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey,
        detail: event.detail
      };
      this.eventsHistory.addItem(e);
    });
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
    const sesionDuration = (currentTime.getTime() - this.sessionStartTime.getTime()) / 1000;
    return {
      sessionId: this.sessionId,
      sessionDuration: sesionDuration,
      browserProperties: this.browserProperties,
      screenProperties: this.screenProperties,
      eventsHistory: this.eventsHistory.getHistory()
    };
  }
}

interface IMouseEvent {
  target: object;
  readonly altKey: boolean;
  readonly metaKey: boolean;
  readonly ctrlKey: boolean;
  readonly shiftKey: boolean;
  readonly detail: number;
  readonly timestamp: number;
}
