import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: {},
  userSignUp: {},
  isLoggedIn: false,
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    deleteInvoice: (state) => {
      state.loading = true;
    },
    setDeleteInvoice: (state, action) => {
      state.loading = false;
    },

    updateInvoice: (state) => {
      state.loading = true;
    },
    setUpdateInvoice: (state, action) => {
      state.loading = false;
    },

    singleInvoice: (state) => {
      state.loading = true;
    },
    setSingleInvoice: (state, action) => {
      state.loading = false;
    },
    inVoiceList: (state) => {
      state.loading = true;
    },
    setInVoiceList: (state, action) => {
      state.loading = false;
    },
    addInvoice: (state) => {
      state.loading = true;
    },
    setAddInvoice: (state, action) => {
      state.loading = false;
    },
    resetPassword: (state) => {
      state.loading = true;
    },
    setResetPassword: (state, action) => {
      state.loading = false;
    },
    forgotPassword: (state) => {
      state.loading = true;
    },
    setforgotPassword: (state, action) => {
      state.loading = false;
    },
    signIn: (state) => {
      state.loading = true;
    },
    setSignIn: (state, action) => {
      state.loading = false;
    },
    resendVerifyOtp: (state) => {
      state.loading = true;
    },
    setResendVerifyOtp: (state, action) => {
      state.loading = false;
    },
    verifyOtp: (state) => {
      state.loading = true;
    },
    setVerifyOtp: (state, action) => {
      state.loading = false;
    },
    signUp: (state, action) => {
      state.loading = true;
    },
    setSignUp: (state, action) => {
      state.loading = false;
    },
    uploadImage: (state) => {
      state.loading = true;
    },
    setUploadImage: (state, action) => {
      state.loading = false;
    },
    onErrorStopLoad: (state) => {
      state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  uploadImage,
  setUploadImage,
  signUp,
  setSignUp,
  verifyOtp,
  setVerifyOtp,
  resendVerifyOtp,
  setResendVerifyOtp,
  signIn,
  setSignIn,
  forgotPassword,
  setforgotPassword,
  resetPassword,
  setResetPassword,
  addInvoice,
  setAddInvoice,
  inVoiceList,
  setInVoiceList,
  singleInvoice,
  setSingleInvoice,
  updateInvoice,
  setUpdateInvoice,
  deleteInvoice,
  setDeleteInvoice,
  onErrorStopLoad,
} = authSlice.actions;

export default authSlice.reducer;
