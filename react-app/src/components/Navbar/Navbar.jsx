import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">
        Home
      </Link>
      <Link to="/login" className="nav-link">
        Log in
      </Link>
      {/* Logout of spotify AKA invalidate the tokens: https://stackoverflow.com/questions/24408444/how-to-logout-user-from-spotify-after-authorization-and-web-api-call-is-over */}
      <a href="http://localhost:3001/logout" className="nav-link" rel="noreferrer">
        Log out
      </a>
    </nav>
  );
}
