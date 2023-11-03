import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signIn, onErrorStopLoad } from "../../redux/slices/auth";
import { useAuthSelector } from "../../redux/selector/auth";
import { toast } from "react-toastify";

const Login = () => {
  const toastId = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authData = useAuthSelector();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email) {
      showToast("Please enter your email");
      return;
    } else if (!formData.password) {
      showToast("Please enter your password");
      return;
    }

    let params = {
      email: formData.email.trim(),
      password: formData.password,
    };
    dispatch(
      signIn({
        ...params,
        cb(ress) {
          if (ress.status === 200) {
            navigate("/");
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
            <h3 className="mb-0 logintext">Login</h3>
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
                  <Link to="/forgot-password" className="forgotheading">
                    Forgot password?
                  </Link>
                  <br />
                  <Link to="/" className="forgotheading mt-2">
                    Back Home
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
                    &nbsp;&nbsp; Sign In
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

export default Login;
