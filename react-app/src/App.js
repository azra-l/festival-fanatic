import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { useSelector } from "react-redux";

function App() {

  const isAuth = useSelector((store) => store.auth.isAuthenticated);


  return (
    <div className="App">
      <Navbar />
      <div className="description-container">
        {isAuth ? <div>
          <h2>Your results are in!! See your matched festivals</h2>
          <button className="get-started-btn" onClick={(e) => {
            e.preventDefault();
            window.location.href = 'http://localhost:3000/results';
          }}>Results</button>

        </div> : <div>
          <h2>Find festivals based on your spotify listening with one click</h2>

          <button className="get-started-btn" onClick={(e) => {
            e.preventDefault();
            window.location.href = 'http://localhost:3001/login';

            // fetch("http://localhost:3001/login", {
            //   method: 'GET', credentials: 'same-origin', 'Access-Control-Allow-Origin': "*",
            // })
          }}
          >Log in with Spotify</button>
        </div>}
      </div>
    </div>
  );
}

export default App;
