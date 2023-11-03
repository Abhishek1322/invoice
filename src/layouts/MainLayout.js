import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import MainNav from "../common/MainNav";

const MainLayout = () => {
  const location = useLocation();
  const pathName = location.pathname;

  return (
    <>
      <div className="mainBox">
        {/* <Sidebar /> */}
        <main className="main">
          <MainNav />
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default MainLayout;
