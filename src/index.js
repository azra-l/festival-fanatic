import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Results from "./routes/results/results";
import TopArtists from "./routes/top-artists/top-artists";
import LogIn from "./routes/login/login";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LogIn/>}/>
      <Route path="results" element={<Results />} />
      <Route path="top-artists" element={<TopArtists />} />
    </Routes>
  </BrowserRouter>
);
