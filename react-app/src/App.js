import "./App.css";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="description-container">
        <p>Find festivals based on your spotify listening with one click</p>
        <button className="get-started-btn" onClick={(e) => {
          e.preventDefault();
          window.location.href = 'http://localhost:3001/login';

          // fetch("http://localhost:3001/login", {
          //   method: 'GET', credentials: 'same-origin', 'Access-Control-Allow-Origin': "*",
          // })
        }}
        >Log in with Spotify</button>
      </div>
    </div>
  );
}

export default App;
