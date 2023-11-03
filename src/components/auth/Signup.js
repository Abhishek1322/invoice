import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { signUp, onErrorStopLoad } from "../../redux/slices/auth";
import { useAuthSelector } from "../../redux/selector/auth";

const SignUp = () => {
  const toastId = useRef(null);
  const authData = useAuthSelector();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  // Getting values of input field
  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // show only one toast at one time
  const showToast = (msg) => {
    if (!toast.isActive(toastId.current)) {
      toastId.current = toast.error(msg);
    }
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.firstName) {
      showToast("Please enter your first name");
      return;
    } else if (!formData.lastName) {
      showToast("Please enter your last name");
      return;
    } else if (!formData.email) {
      showToast("Please enter your email address");
      return;
    } else if (
      formData.email &&
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        formData.email
      )
    ) {
      toastId.current = showToast("Please enter valid email address");
      return;
    } else if (!formData.password) {
      showToast("Please enter your password");
      return;
    }
    let params = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email.trim(),
      password: formData.password,
    };
    dispatch(
      signUp({
        ...params,
        cb(ress) {
          if (ress.status === 200) {
            navigate("/verify-otp");
            localStorage.setItem("emailAddress", formData.email);
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
            <h3 className="mb-0 logintext">Sign Up</h3>
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
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                <label for="username" className="form-label d-block inputBox">
                  First Name{" "}
                </label>
              </div>

              <div className="input-container mt-4">
                <input
                  type="text"
                  className="form-control form-input borderinput"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                <label for="username" className="form-label d-block inputBox">
                  Last Name{" "}
                </label>
              </div>

              <div className="input-container mt-4">
                <input
                  type="text"
                  className="form-control form-input borderinput"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                <label for="username" className="form-label d-block inputBox">
                  Email{" "}
                </label>
              </div>
              <div className="input-container mt-4 mb-2">
                <input
                  type="password"
                  className="form-control form-input borderinput"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                <label for="username" className="form-label d-block inputBox">
                  Password
                </label>
              </div>

              <div className="row">
                <div className="col-12 text-end">
                  <Link
                    to="/login"
                    className="
                         forgotheading"
                  >
                    Sign In
                  </Link>
                </div>

                <div className="col-12 text-center">
                  <button
                    disabled={authData?.loading}
                    className="loginBtnCommon btnYellow mt-5 mw-100 loginbtn"
                    type="submit"
                  >
                    {authData?.loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    &nbsp;&nbsp; Sign Up
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

export default SignUp;
