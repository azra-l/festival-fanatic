import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Results from "./routes/results/results";
import TopArtists from "./routes/top-artists/top-artists";
import LogIn from "./routes/login/login";
import DetailedResults from "./routes/detailed-results/detailed-results";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { CookiesProvider } from "react-cookie";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CookiesProvider>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="login" element={<LogIn />} />
          <Route path="results" element={<Results />} />
          <Route path="top-artists" element={<TopArtists />} />
          <Route
            path="results/detailed-results"
            element={<DetailedResults />}
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  </CookiesProvider>
);
