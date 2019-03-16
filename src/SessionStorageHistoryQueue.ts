export default class SessionStorageHistoryQueue<T> {
  private readonly maxQueueLength: number;
  private readonly queueName: string;

  constructor(queueLength: number, queueName: string, clear: boolean = false) {
    this.maxQueueLength = queueLength;
    this.queueName = queueName;
    if (clear) {
      sessionStorage.clear();
    }
  }

  public addItem(item: T): void {
    let queue: T[] = [];
    const queueFromStorage = sessionStorage.getItem(this.queueName);
    if (queueFromStorage) {
      queue = JSON.parse(queueFromStorage);
    }
    while (queue.length >= this.maxQueueLength) {
      queue.shift();
    }

    queue.push(item);
    const queueJson = JSON.stringify(queue);
    sessionStorage.setItem(this.queueName, queueJson);
    console.debug(queueJson);
  }

  public getHistory(): T[] {
    let history: T[] = [];
    const historyString = sessionStorage.getItem(this.queueName);
    if (historyString) {
      history = JSON.parse(historyString);
    }
    return history;
  }
}
