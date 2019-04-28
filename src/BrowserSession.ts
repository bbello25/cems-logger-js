import SessionStorageHistoryQueue from './SessionStorageHistoryQueue';

export default class BrowserSession {
  public sessionId: string = 'unknown';

  private eventsHistory: SessionStorageHistoryQueue<IMouseEvent>;
  private sessionStartTime: Date;

  constructor(eventHistoryLimit: number = 10) {
    this.eventsHistory = new SessionStorageHistoryQueue(
      eventHistoryLimit,
      'eventsHistory'
    );
    this.registerClickEventHandler();
    this.sessionStartTime = new Date();
  }

  public updateSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  private registerClickEventHandler() {
    // @ts-ignore 
    document.addEventListener('click', (event: IMouseEvent) => {

      const targetElement = event.target as any;
      const e: IMouseEvent = {
        target: {
          elementName: targetElement.localName,
          id: targetElement.id,
          name: targetElement.name,
        },
        timestamp: new Date(),
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey,
        detail: event.detail
      };
      this.eventsHistory.addItem(e);
    });
  }

  public getSessionDuration(): number {
    const currentTime = new Date();
    return (currentTime.getTime() - this.sessionStartTime.getTime()) / 1000;
  }

  public getSessionEventHistory(): IMouseEvent[] {
    return this.eventsHistory.getHistory();
  }

  public getCurrentBrowserSessionState() {
    let state: BrowserSessionState = new BrowserSessionState();
    state.sessionId = this.sessionId;
    state.sessionDuration = this.getSessionDuration();
    state.eventHistory = this.getSessionEventHistory();
    return state;
  }
}

export class BrowserSessionState {
  sessionId: string;
  eventHistory: IMouseEvent[];
  sessionDuration: number;
}

export interface IEventTarget {
  elementName: string
  id: string
  name: string
}

export interface IMouseEvent {
  target: IEventTarget;
  readonly altKey: boolean;
  readonly metaKey: boolean;
  readonly ctrlKey: boolean;
  readonly shiftKey: boolean;
  readonly detail: number;
  readonly timestamp: Date;
}
