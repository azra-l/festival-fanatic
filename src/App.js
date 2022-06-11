import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <Navbar />
      <div className="description-container">
        <p>Find festivals based on your spotify listening with one click</p>
        <button className="get-started-btn" onClick={() => {navigate("/login")}}>Log in with Spotify</button>
      </div>
    </div>
  );
}

export default App;
