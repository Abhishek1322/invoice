const ApiPath = {
  AuthApiPath: {
    UPLOAD_IMAGE: "/api/v1/users/upload-single-image",
    SIGN_UP: "/api/v1/users/signup",
    VERIFY_OTP: "/api/v1/users/verify-email",
    RESEND_OTP: "/api/v1/users/send-otp",
    SIGN_IN: "/api/v1/users/login",
    FORGOT_PASSWORD: "/api/v1/users/forgot-password",
    RESET_PASSWORD: "/api/v1/users/reset-password",
    ADD_INVOICE: "/api/v1/forms/add-invoice",
    ALL_INVOICE: "/api/v1/forms/get-all-invoice",
    SINGLE_INVOICE:"/api/v1/forms/get-single-invoice/",
    UPADTE_INVOICE:"/api/v1/forms/update-invoice",
    DELETE_INVOICE:"/api/v1/forms/delete-invoice/"
  },
};

export default ApiPath;
