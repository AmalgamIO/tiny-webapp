import React, {createContext, ReactNode, FC, useState} from 'react';

type IMap = { [k: string | number]: any; }

// The lambda function endpoint is written to this file during deployment. Stored as 'httpApiUrl'.
const BASE_CONFIG_URI="/cfg/base_api.json";


// ******************************************************************
// A tool to chain i/o of Promises
// ******************************************************************

type ChainFunction<T, R> = (arg?: T) => any|Promise<any>;

const chain = <T, R>(list: Array<ChainFunction<any, any>>): (initialValue?: T) => Promise<R> => {
  return (initialValue?: T) => {
    return list.flat().reduce((acc: Promise<any>, fn: ChainFunction<any, any>) => {
      return acc.then(fn);
    }, Promise.resolve(initialValue));
  };
};
// ******************************************************************

export const GlobalProvider: FC<GlobalProviderProps> = ({ children }) => {

  const [apiConfig, setApiConfig] = useState<ISigV4Data>();

  const getSigV4Data = async (opts?: ISigV4Opts): Promise<ISigV4Data> => {

    let query = opts ? "?" + Object.entries(opts).map((pair) => pair.join("=")).join("&") : null;

    return chain<any,ISigV4Data>([

      // Get configuration
      () => getConfig()
        .then(cfg => cfg.httpApiUrl)
        .then((endpoint: string) => {

          return endpoint + query
        }),

      // Fetch the resolved endpoint
      // fetch,

      // Pass on the response
      // (response: Response) => {
      //   if (!response)
      //     throw new Error("Response is NULL");
      //   else if (response.status >= 400)
      //     throw new Error(`Unexpected response. Status: ${response.status}. Info: ${response.statusText}`)
      //   return response
      // },

      // Convert to JSON
      (res) => {},
      // (res) => res.json(),
    ])()

  };

  const getConfig = async (): Promise<IConfigData> => {
    // let cfg = await fetch(BASE_CONFIG_URI).then((resp: Response) => resp.json())
    // if (!cfg?.httpApiUrl || cfg?.httpApiUrl?.length == 0) throw new Error("Config does not contain 'httpApiUrl'.")
    // return cfg;
    return {
      "httpApiUrl": "https://fgpy3veuwa.execute-api.us-west-2.amazonaws.com"
    };
  };

  return (
    <GlobalContext.Provider value={{ getSigV4Data, getConfig }}>
      {children}
    </GlobalContext.Provider>
  )

};

export interface GlobalProviderProps {
  children: ReactNode;
}

// Defines properties in "/cfg/base_api.json"
export interface IConfigData {
  [k: string]: any;
  httpApiUrl: string;
}

// Defines properties expected from httpApiUrl. The fields required for 'AWS Signature Version 4' are in the 'form_fields' property.
export interface ISigV4Data {
  form_action: string;
  form_fields: IMap;
}

// Define the type for the context value
export interface GlobalContextType {
  getSigV4Data: (opts?: ISigV4Opts) => Promise<ISigV4Data>;
  getConfig: () => Promise<IConfigData>;
}

// Context with an initial value of null
export const GlobalContext = createContext<GlobalContextType | null>(null);

export interface ISigV4Opts { redir?: string; bucket?: string; upload_key?: string; };
