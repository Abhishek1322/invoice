import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword, onErrorStopLoad } from "../../redux/slices/auth";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toastId = useRef(null);

  const email = localStorage.getItem("emailAddress");
  const [password, setPassword] = useState("");
  const [cNewPassword, setCnewPassword] = useState("");

  // show only one toast at one time
  const showToast = (msg) => {
    if (!toast.isActive(toastId.current)) {
      toastId.current = toast.error(msg);
    }
  };

  // submit password
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password) {
      showToast("Please enter your new password");
      return;
    } else if (!cNewPassword) {
      showToast("Please enter your confirm  password");
      return;
    }

    let params = {
      email: email,
      newPassword: password,
      confirmPassword: cNewPassword,
    };

    dispatch(
      resetPassword({
        ...params,
        cb(res) {
          if (res.status === 200) {
            navigate("/login");
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
            <h3 className="mb-0 logintext">Reset Password</h3>
          </div>
          <div className="card-body login-card-body mt-4">
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="input-container  ">
                <input
                  type="password"
                  className="form-control form-input borderinput"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <label for="username" className="form-label d-block inputBox">
                  New Password{" "}
                </label>
              </div>
              <div className="input-container mt-4 mb-2">
                <input
                  type="password"
                  className="form-control form-input borderinput"
                  placeholder="Confirm New Password"
                  value={cNewPassword}
                  onChange={(e) => {
                    setCnewPassword(e.target.value);
                  }}
                />
                <label for="username" className="form-label d-block inputBox">
                  Confirm New Password
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
                    {/* <span className="spinner-border spinner-border-sm"></span> */}
                    &nbsp;&nbsp; Reset Password
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

export default ResetPassword;
