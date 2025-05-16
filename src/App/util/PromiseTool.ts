type ChainFunction<T, R> = (arg?: T) => any|Promise<any>
export type IMap = { [k: string | number]: any; }

const chain = <T, R>(list: Array<ChainFunction<any, any>>): (initialValue?: T) => Promise<R> => {
  return (initialValue?: T) => {
    return list.flat().reduce((acc: Promise<any>, fn: ChainFunction<any, any>) => {
      return acc.then(fn);
    }, Promise.resolve(initialValue));
  };
};

// import { Location } from "@remix-run/router";

import { Location } from 'react-router-dom';

export const isLocationPath = (location: Location) => (yes: string = 'active', no: string = 'inactive') => (ppath: string): string => {
  return location.pathname.indexOf(ppath) > 0 ? yes : no
}

//
// import { useEffect, useRef } from 'react';
// import { useLocation } from 'react-router-dom';
//
//
// function ScrollToAnchor() {
//   const location = useLocation();
//   const lastHash = useRef('');
//
//   // listen to location change using useEffect with location as dependency
//   // https://jasonwatmore.com/react-router-v6-listen-to-location-route-change-without-history-listen
//   useEffect(() => {
//     if (location.hash) {
//       lastHash.current = location.hash.slice(1); // safe hash for further use after navigation
//     }
//
//     if (lastHash.current && document.getElementById(lastHash.current)) {
//       setTimeout(() => {
//         document
//         .getElementById(lastHash.current)
//         ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         lastHash.current = '';
//       }, 100);
//     }
//   }, [location]);
//
//   return null;
// }
//
// export default ScrollToAnchor;

