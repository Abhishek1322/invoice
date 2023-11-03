import { Route, Routes } from "react-router-dom";
import * as Containers from "../container";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

const Router = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Containers.Home />} />
          <Route path="/invoice-list" element={<Containers.InvoiceList />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Containers.Login />} />
          <Route path="/sign-up" element={<Containers.SignUp />} />
          <Route path="/verify-otp" element={<Containers.Verify_Otp />} />
          <Route
            path="/forgot-password"
            element={<Containers.ForgotPassword />}
          />
          <Route
            path="/reset-password"
            element={<Containers.ResetPassword />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default Router;
