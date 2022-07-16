import { Link } from "react-router-dom";
import "./Navbar.css";
import { useSelector } from "react-redux";

export default function Navbar() {

  const isAuth = useSelector((store) => store.auth.isAuthenticated);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">
        Home
      </Link>
      {isAuth ? <Link to="/results" className="nav-link">
        Results
      </Link> : <div></div>}
      {/* Logout of spotify AKA invalidate the tokens: https://stackoverflow.com/questions/24408444/how-to-logout-user-from-spotify-after-authorization-and-web-api-call-is-over */}
      {isAuth ? <a href="http://localhost:3001/logout" className="nav-link" rel="noreferrer">
        Log out
      </a> : <div></div>}
    </nav>
  );
}
