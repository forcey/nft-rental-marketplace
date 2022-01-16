import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import App from './App';
import BrowsePage from "./routes/browse";
import LendPage from "./routes/lend";
import ReturnPage from "./routes/return";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<BrowsePage />} />
          <Route path="lend" element={<LendPage />} />
          <Route path="return" element={<ReturnPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
