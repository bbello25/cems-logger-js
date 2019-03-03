import SessionStorageHistoryQueue from './SessionStorageHistoryQueue';

export default class BrowserSession {
  private sessionId: string = 'unknown';
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
  }

  public get() {
    return {
      sessionId: this.sessionId,
      // urlsHistory: this.urlsHistory.getHistory(),
      eventsHistory: this.eventsHistory.getHistory()
    };
  }

  public updateSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  private registerClickEventHandler() {
    document.addEventListener('click', (event: MouseEvent) => {
      const e: IMouseEvent = {
        target: event.target ? event.target.toString() : null,
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
}

interface IMouseEvent {
  target: string | null;
  readonly altKey: boolean;
  readonly metaKey: boolean;
  readonly ctrlKey: boolean;
  readonly shiftKey: boolean;
  readonly detail: number;
  readonly timestamp: number;
}
