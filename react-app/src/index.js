import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Results from "./routes/results/results";
import TopArtists from "./routes/top-artists/top-artists";
import DetailedResults from "./routes/detailed-results/detailed-results";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ProtectedRoute from "./utilities/ProtectedRoute";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="login" element={<LogIn />} /> */}
        {/* <Route path="results" element={<Results />} /> */}
        <Route path="top-artists" element={<TopArtists />} />
        <Route
          path="results/detailed-results"
          element={<DetailedResults />}
        />
        <Route exact path="/results" element={<ProtectedRoute />} >
          <Route exact path="/results" element={<Results />} />
        </Route>


        {/* <ProtectedRoute exact path="results">
          <Results />
        </ProtectedRoute> */}

      </Routes>
    </BrowserRouter>
  </Provider>
);


