export class BrowserInfo {
  public osName: string;
  public osVersion: any;
  public browserName: string;
  public browserVersion: any;
  public browserUserAgent: string;
  public browserLanguage: string;
  public browserIsOnline: boolean;
  public browserPlatform: string;
  public javaEnabled: boolean;
  public dataCookiesEnabled: boolean;
  public dataCookies: string;
  public dataStorage: string;

  public screenScreenW: number;
  public screenScreenH: number;
  public sizeInnerW: number;
  public sizeInnerH: number;
  public screenAvailW: number;
  public screenAvailH: number;
  public scrColorDepth: number;
  public scrPixelDepth: number;

  private header = [
    navigator.platform,
    navigator.userAgent,
    navigator.appVersion,
    navigator.vendor
  ];

  private databrowser = [
    { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
    { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
    { name: 'Safari', value: 'Safari', version: 'Version' },
    { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
    { name: 'Opera', value: 'Opera', version: 'Opera' },
    { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
    { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
  ];


  private dataos = [
    { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
    { name: 'Windows', value: 'Win', version: 'NT' },
    { name: 'iPhone', value: 'iPhone', version: 'OS' },
    { name: 'iPad', value: 'iPad', version: 'OS' },
    { name: 'Kindle', value: 'Silk', version: 'Silk' },
    { name: 'Android', value: 'Android', version: 'Android' },
    { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
    { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
    { name: 'Macintosh', value: 'Mac', version: 'OS X' },
    { name: 'Linux', value: 'Linux', version: 'rv' },
    { name: 'Palm', value: 'Palm', version: 'PalmOS' }
  ];


  constructor() {
    const agent = this.header.join(' ');
    const os = this.matchItem(agent, this.dataos);
    const browser = this.matchItem(agent, this.databrowser);
    this.osName = os.name;
    this.osVersion = os.version;
    this.browserName = browser.name;
    this.browserVersion = browser.version;
    this.browserUserAgent = navigator.userAgent;
    this.browserLanguage = navigator.language;
    this.browserIsOnline = navigator.onLine;
    this.browserPlatform = navigator.platform;
    this.javaEnabled = navigator.javaEnabled();
    this.dataCookiesEnabled = navigator.cookieEnabled;
    this.dataCookies = document.cookie;
    this.dataStorage = JSON.stringify(localStorage);

    this.screenScreenW = window.screen.width;
    this.screenScreenH = window.screen.height;
    this.sizeInnerW = window.innerWidth;
    this.sizeInnerH = window.innerHeight;
    this.screenAvailW = window.screen.availWidth;
    this.screenAvailH = window.screen.availHeight;
    this.scrColorDepth = window.screen.colorDepth;
    this.scrPixelDepth = window.screen.pixelDepth;
  }

  private matchItem(stringa: string, data: any) {
    let i = 0;
    let j = 0;
    let regex;
    let regexv;
    let match;
    let matches;
    let version;

    for (i = 0; i < data.length; i += 1) {
      regex = new RegExp(data[i].value, 'i');
      match = regex.test(stringa);
      if (match) {
        regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
        matches = stringa.match(regexv);
        version = '';
        if (matches) {
          if (matches[1]) {
            matches = matches[1];
          }
        }
        if (matches) {
          if (typeof matches === 'string') {
            matches = matches.split(/[._]+/);
          }
          for (j = 0; j < matches.length; j += 1) {
            if (j === 0) {
              version += matches[j] + '.';
            } else {
              version += matches[j];
            }
          }
        } else {
          version = '0';
        }
        return {
          name: data[i].name,
          version: parseFloat(version)
        };
      }
    }
    return { name: 'unknown', version: 0 };
  }
}
