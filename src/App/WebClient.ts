type ResponseHandler = (xhr: XMLHttpRequest, url: string) => string;

export interface InterceptionRule {
  urlPattern: RegExp;
  responseHandler: ResponseHandler;
}

export const { interceptXhrResponse } = (function () {
  let interceptionRules: InterceptionRule[] = [];

  /**
   * Function to intercept responses for given URL patterns
   * @param {RegExp} urlPattern - Regular expression to match the (canonicalized) URL
   * @param {Function} responseHandler - Function to handle the intercepted response
   */
  function interceptXhrResponse(urlPattern: RegExp, responseHandler: ResponseHandler) {
    interceptionRules.push({ urlPattern, responseHandler });
  }

  // Function to find specific handler for the URL and return modified response
  function handleInterceptedResponse(xhr: XMLHttpRequest, url: string): string {
    const interceptionRule = interceptionRules.find(({ urlPattern }) =>
      urlPattern.test(url)
    );

    if (interceptionRule) {
      const { responseHandler } = interceptionRule;
      return responseHandler(xhr, url);
    }

    return xhr.responseText;
  }
  // const windowObj: Window ;

  // const OriginalXMLHttpRequest = (window as Window)?.XMLHttpRequest || XMLHttpRequest;

  class CustomXMLHttpRequest extends XMLHttpRequest {
    constructor() {
      super();
      this.addEventListener('readystatechange', () => {
        if (this.readyState === 4 && (this.status >= 300 && this.status < 400)) {
          handleInterceptedResponse(this, this.responseURL);
        }
      });
    }

    get responseText(): string {
      // If the request is not done, return the original responseText
      if (this.readyState !== 4) {
        return super.responseText;
      }

      return handleInterceptedResponse(this, this.responseURL);
    }

    get response(): any {
      // If the request is not done, return the original response
      if (this.readyState !== 4) {
        return super.response;
      }

      return handleInterceptedResponse(this, this.responseURL);
    }
  }

  (window as any).XMLHttpRequest = CustomXMLHttpRequest;

  return { interceptXhrResponse };
})();
