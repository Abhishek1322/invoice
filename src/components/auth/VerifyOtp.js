import React, { useState, useEffect, useRef } from "react";
import OTPInput from "react-otp-input";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  verifyOtp,
  resendVerifyOtp,
  onErrorStopLoad,
} from "../../redux/slices/auth";
import { toast } from "react-toastify";
import { useAuthSelector } from "../../redux/selector/auth";

const Verify_Otp = () => {
  const toastId = useRef(null);
  const authData = useAuthSelector();
  const location = useLocation();
  const dispatch = useDispatch();
  const { pathname } = location;
  const { search } = location;
  const searchParams = new URLSearchParams(search);
  const type = searchParams.get("type");
  const navigate = useNavigate();
  const email = localStorage.getItem("emailAddress");
  const [isLoading, setIsLoading] = useState("");
  const [otp, setOtp] = useState("");

  // show only one toast at one time
  const showToast = (msg) => {
    if (!toast.isActive(toastId.current)) {
      toastId.current = toast.error(msg);
    }
  };

  // submit otp
  const handleSubmitOtp = (e, status) => {
    e.preventDefault();
    setIsLoading(status);
    if (!otp) {
      showToast("Please enter your otp");
      return;
    }
    let params = {
      email: email,
      otp: otp,
      type: "1",
    };

    dispatch(
      verifyOtp({
        ...params,
        cb(res) {
          if (res.status === 200) {
            if (type === "reset-password") {
              navigate("/reset-password");
            } else {
              navigate("/");
            }
          }
        },
      })
    );
  };

  // resend otp
  const handleResendOtp = (e, status) => {
    e.preventDefault();
    setIsLoading(status);
    let params = {
      email: email,
    };
    dispatch(
      resendVerifyOtp({
        ...params,
        cb(res) {},
      })
    );
  };

  // stop loader on page load
  useEffect(() => {
    dispatch(onErrorStopLoad());
  }, [dispatch]);

  return (
    <>
      <div className="login-page authBg adminlgn">
        <div className="card card-outline card-primary cardTopOutline cardBg">
          <div className="card-header text-center">
            <h3 className="mb-0 logintext">Verify Your Accont</h3>
          </div>
          <div className="card-body login-card-body mt-4">
            <form onSubmit={(e) => handleSubmitOtp(e, "verify")}>
              <OTPInput
                value={otp}
                onChange={setOtp}
                placeholder="4"
                numInputs="4"
                renderInput={(props) => (
                  <input {...props} className="enterOtp" />
                )}
              />
              <p className="mb-3 mt-4 inner_Text">
                Customer not received the OTP?{" "}
                <Link
                  onClick={(e) => handleResendOtp(e, "resend")}
                  className="resendLink"
                  href=""
                >
                  <span className="insideText">
                    {authData?.loading && isLoading === "resend" && (
                      <span className="spinner-border spinner-border-sm me-1"></span>
                    )}
                    Resend
                  </span>
                </Link>{" "}
              </p>
              <div className="modalfooterbtn mb-4">
                <div className="orderItems_ flexBox ">
                  <button type="button" className="cancelOrder_ me-4">
                    Cancel
                  </button>
                  <button type="submit" className="submitOrder_">
                    {authData?.loading && isLoading === "verify" && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    Verify
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verify_Otp;
