import React from "react";
import { Outlet, useLocation } from "react-router-dom";

const AuthLayout = () => {

  return (
    <>
      <div className="mainBox">
        <main className="main">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AuthLayout;
