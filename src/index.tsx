import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {GlobalProvider} from "~/context/GlobalContext";
import {createRoot} from 'react-dom/client';
import App from "./App";

import './scss/custom-lib.scss';

const rootElement = document.getElementById('root')!;
const rootObj = createRoot(rootElement);


rootObj.render(
  <BrowserRouter>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </BrowserRouter>
);
