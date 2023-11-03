import React, { useState } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";

const MainNav = () => {
  const authToken = localStorage.getItem("invoiceAuthToken");
  const [showSignOut, setShowSignOut] = useState(false);
  console.log("authToken", authToken);

  // sign out
  const handleSignOut = () => {
    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to sign out",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal("Deleted!", "Your account  has been sign out!", "success");
        localStorage.removeItem("invoiceAuthToken");
        setShowSignOut(true);
      }
    });
  };

  return (
    <div className="main-nav">
      <div className="menu-barDIv">
        <img
          className="menu-img"
          src="https://www.zoho.com/invoice/images/menu.svg"
          alt="menu-bar"
        />
        <div>
          <div class="title">
            <h1 class="tool-name">Free Invoice Generator</h1>
            <p>by Zoho Invoice</p>
          </div>
        </div>
      </div>

      <div className="button-invoice">
        {authToken && !showSignOut ? (
          <button onClick={() => handleSignOut()} className="sign-up">
            Sign out
          </button>
        ) : (
          <Link to="/sign-up">
            <button className="sign-up">Sign up. It's Free!</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MainNav;
