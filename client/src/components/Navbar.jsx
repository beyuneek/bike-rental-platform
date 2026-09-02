import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";

/** Conditional statement added to only display create bike listing for the admin */
const Navbar = () => {
    const [dropdownMenu, setDropdownMenu] = useState(false);

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();


    return (
      <div className="navbar">
        <a href="/">
          <img src="/assets/logo.png" alt="logo" />
        </a>
  
       
  
        <div className="navbar_right">

  
          <button
            className="navbar_right_account"
            onClick={() => setDropdownMenu(!dropdownMenu)}
          >
            <Menu sx={{ color: variables.darkgrey }} />
            {!user ? (
              <Person sx={{ color: variables.darkgrey }} />
            ) : (
              <img
                src={`http://localhost:3001/${user.profileImagePath.replace(
                  "public",
                  ""
                )}`}
                alt="profile photo"
                style={{ objectFit: "cover", borderRadius: "50%" }}
              />
            )}
          </button>
  
          {dropdownMenu && !user && (
            <div className="navbar_right_accountmenu">
              <Link to="/login">Log In</Link>
              <Link to="/register">Sign Up</Link>
            </div>
          )}
          
          {dropdownMenu && user && (
            <div className="navbar_right_accountmenu">
              <Link to={`/${user._id}/rentals`}>Rental List</Link>
              <Link to={`/${user._id}/profile`}>Profile</Link>
              <Link to={`/${user._id}/myreviews`}>My Reviews</Link>
              <Link to={`/${user._id}/reviews`}>Reviews</Link>
              <Link to={`/${user._id}/createticket`}>Create Ticket</Link>
              <Link to={`/${user._id}/tickets`}>Tickets</Link>
              <Link to={`/${user._id}/mapservice`}>Locate a Bike </Link>

              
              {user.isAdmin === "Yes" && (
                <Link to="/create-ebike-listing">Create E-bike Listing</Link>
                
              )}

                {user.isAdmin === "Yes" && (
                
                <Link to="/qr-code">Create QR Code</Link>
              )}

              {user.isSupportStaff && (
                <Link to="/managetickets">Manage Tickets</Link>
              )}
              
              <Link
                to="/login"
                onClick={() => {
                  dispatch(setLogout());
                }}
              >
                Log Out
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default Navbar;