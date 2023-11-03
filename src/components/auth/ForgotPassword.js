import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword, onErrorStopLoad } from "../../redux/slices/auth";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuthSelector } from "../../redux/selector/auth";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authData = useAuthSelector();
  const toastId = useRef(null);
  const [email, setEmail] = useState("");

  // show only one toast at one time
  const showToast = (msg) => {
    if (!toast.isActive(toastId.current)) {
      toastId.current = toast.error(msg);
    }
  };

  // submit data
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      showToast("Please enter your email");
      return;
    }
    let params = {
      email: email,
    };
    dispatch(
      forgotPassword({
        ...params,
        cb(res) {
          if (res.status === 200) {
            navigate("/verify-otp?type=reset-password");
          }
        },
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
            <h3 className="mb-0 logintext">Forgot Password</h3>
          </div>
          <div className="card-body login-card-body mt-4">
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="input-container  ">
                <input
                  type="text"
                  className="form-control form-input borderinput"
                  name="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <label for="username" className="form-label d-block inputBox">
                  Email{" "}
                </label>
              </div>

              <div className="row">
                <div className="col-12 text-end">
                  <Link
                    to="/login"
                    className="
                         forgotheading"
                  >
                    Login
                  </Link>
                </div>

                <div className="col-12 text-center">
                  <button
                    className="loginBtnCommon btnYellow mt-5 mw-100 loginbtn"
                    type="submit"
                  >
                    {authData?.loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    &nbsp;&nbsp; Forgot Password
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

export default ForgotPassword;
