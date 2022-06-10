import "./App.css";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="description-container">
        <p>Find festivals based on your spotify listening with one click</p>
        <button className="get-started-btn">Log in with Spotify</button>
      </div>
    </div>
  );
}

export default App;
