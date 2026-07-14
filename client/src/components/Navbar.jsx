import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Invalid user data in localStorage:", error);
    localStorage.removeItem("user");
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  
  if (user && user.role && user.role.toLowerCase() === "organizer") {
    return null; 
  }

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">🛕 DarshanEase</Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/temples">Temples</Link></li>

        {user ? (
          <>
            {/* ROLE FILTER: Only show Bookings and Profile to normal user/devotee accounts */}
            {(user.role?.toLowerCase() === "user" || user.role?.toLowerCase() === "devotee") && (
              <>
                <li><Link to="/bookings">My Bookings</Link></li>
                <li><Link to="/profile">Profile</Link></li>
              </>
            )}

            {/* ADMIN ROUTE LINK */}
            {user.role && user.role.toLowerCase() === "admin" && (
              <li><Link to="/dashboard/admin">Admin Dashboard</Link></li>
            )}

            <li>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;