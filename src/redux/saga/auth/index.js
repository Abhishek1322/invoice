import { all, call, put, takeLatest } from "redux-saga/effects";
import { ApiClient } from "../../../utilities/api";
import {
  onErrorStopLoad,
  setUploadImage,
  setResendVerifyOtp,
  setSignUp,
  setVerifyOtp,
  setSignIn,
  setResetPassword,
  setforgotPassword,
  setAddInvoice,
  setInVoiceList,
  setSingleInvoice,
  setUpdateInvoice,
  setDeleteInvoice,
} from "../../slices/auth";
import ApiPath from "../../../constants/apiPath";
import { toast } from "react-toastify";

// Worker saga will be fired on USER_FETCH_REQUESTED actions

function* deleteInvoice(action) {
  try {
    const resp = yield call(
      ApiClient.delete,
      (action.url = `${ApiPath.AuthApiPath.DELETE_INVOICE}/${action.payload.id}`),
      (action.payload = action.payload)
    );
    if (resp.status) {
      yield put(setDeleteInvoice(resp.data.payload));
      toast.success(resp.data.msg);
      yield call(action.payload.cb, (action.res = resp));
    } else {
      throw resp;
    }
  } catch (e) {
    yield put(onErrorStopLoad());
    toast.error(e.response.data.msg);
  }
}

function* updateInvoice(action) {
  try {
    const resp = yield call(
      ApiClient.put,
      (action.url = `${ApiPath.AuthApiPath.UPADTE_INVOICE}`),
      (action.payload = action.payload)
    );
    if (resp.status) {
      yield put(setUpdateInvoice(resp.data.payload));
      toast.success(resp.data.msg);
      yield call(action.payload.cb, (action.res = resp));
    } else {
      throw resp;
    }
  } catch (e) {
    yield put(onErrorStopLoad());
    toast.error(e.response.data.msg);
  }
}

function* singleInvoice(action) {
  try {
    const resp = yield call(
      ApiClient.get,
      (action.url = `${ApiPath.AuthApiPath.SINGLE_INVOICE}/${action.payload.id}`),
      (action.payload = action.payload)
    );
    if (resp.status) {
      yield put(setSingleInvoice(resp.data.payload));
      yield call(action.payload.cb, (action.res = resp));
    } else {
      throw resp;
    }
  } catch (e) {
    yield put(onErrorStopLoad());
    toast.error(e.response.data.msg);
  }
}

function* inVoiceList(action) {
  try {
    const resp = yield call(
      ApiClient.get,
      (action.url = ApiPath.AuthApiPath.ALL_INVOICE),
      (action.payload = action.payload)
    );
    if (resp.status) {
      yield put(setInVoiceList(resp.data.payload));
      yield call(action.payload.cb, (action.res = resp));
    } else {
      throw resp;
    }
  } catch (e) {
    yield put(onErrorStopLoad());
    toast.error(e.response.data.msg);
  }
}

function* addInvoice(action) {
  try {
    const resp = yield call(
      ApiClient.post,
      (action.url = ApiPath.AuthApiPath.ADD_INVOICE),
      (action.payload = action.payload)
    );
    if (resp.status) {
      yield put(setAddInvoice(resp.data.payload));
      toast.success(resp.data.msg);
      yield call(action.payload.cb, (action.res = resp));
    } else {
      throw resp;
    }
  } catch (e) {
    yield put(onErrorStopLoad());
    toast.error(e.response.data.msg);
  }
}

function* resetPassword(action) {
  try {
    const resp = yield call(
      ApiClient.put,
      (action.url = ApiPath.AuthApiPath.RESET_PASSWORD),
      (action.payload = action.payload)
    );
    if (resp.status) {
      yield put(setResetPassword(resp.data.payload));
      toast.success(resp.data.msg);
      yield call(action.payload.cb, (action.res = resp));
    } else {
      throw resp;
    }
  } catch (e) {
    yield put(onErrorStopLoad());
    toast.error(e.response.data.msg);
  }
}

function* forgotPassword(action) {
  try {
    const resp = yield call(
      ApiClient.post,
      (action.url = ApiPath.AuthApiPath.FORGOT_PASSWORD),
      (action.payload = action.payload)
    );
    if (resp.status) {
      yield put(setforgotPassword(resp.data.payload));
      toast.success(resp.data.msg);
      yield call(action.payload.cb, (action.res = resp));
    } else {
      throw resp;
    }
  } catch (e) {
    yield put(onErrorStopLoad());
    toast.error(e.response.data.msg);
  }
}

function* signIn(action) {
  try {
    const resp = yield call(
      ApiClient.post,
      (action.url = ApiPath.AuthApiPath.SIGN_IN),
      (action.payload = action.payload)
    );
    if (resp.status) {
      localStorage.setItem("invoiceAuthToken", resp?.data?.data?.token);
      yield put(setSignIn(resp.data.payload));
      toast.success(resp.data.msg);
      yield call(action.payload.cb, (action.res = resp));
    } else {
      throw resp;
    }
  } catch (e) {
    yield put(onErrorStopLoad());
    toast.error(e.response.data.msg);
  }
}

function* resendVerifyOtp(action) {
  try {
    const resp = yield call(
      ApiClient.post,
      (action.url = ApiPath.AuthApiPath.RESEND_OTP),
      (action.payload = action.payload)
    );
    if (resp.status) {
      yield put(setResendVerifyOtp(resp.data.payload));
      toast.success(resp.data.data.msg);
      yield call(action.payload.cb, (action.res = resp));
    } else {
      throw resp;
    }
  } catch (e) {
    yield put(onErrorStopLoad());
    toast.error(e.response.data.msg);
  }
}

function* verifyOtp(action) {
  try {
    const resp = yield call(
      ApiClient.post,
      (action.url = ApiPath.AuthApiPath.VERIFY_OTP),
      (action.payload = action.payload)
    );
    if (resp.status) {
      localStorage.setItem("invoiceAuthToken", resp?.data?.data?.token);
      yield put(setVerifyOtp(resp.data.payload));
      toast.success(resp.data.msg);
      yield call(action.payload.cb, (action.res = resp));
    } else {
      throw resp;
    }
  } catch (e) {
    yield put(onErrorStopLoad());
    toast.error(e.response.data.msg);
  }
}

function* signUp(action) {
  try {
    const resp = yield call(
      ApiClient.post,
      (action.url = ApiPath.AuthApiPath.SIGN_UP),
      (action.payload = action.payload)
    );
    if (resp.status) {
      yield put(setSignUp(resp.data.payload));
      yield call(action.payload.cb, (action.res = resp));
      toast.success(resp.data.msg);
    } else {
      throw resp;
    }
  } catch (e) {
    yield put(onErrorStopLoad());
    toast.error(e.response.data.msg);
  }
}

function* uploadImage(action) {
  try {
    const resp = yield call(
      ApiClient.postFormData,
      (action.url = ApiPath.AuthApiPath.UPLOAD_IMAGE),
      (action.payload = action.payload)
    );
    if (resp.status) {
      yield put(setUploadImage(resp.data.payload));
      yield call(action.payload.cb, (action.res = resp));
    } else {
      throw resp;
    }
  } catch (e) {
    yield put(onErrorStopLoad());
    toast.error(e.response.data.msg);
  }
}

function* authSaga() {
  yield all([takeLatest("auth/uploadImage", uploadImage)]);
  yield all([takeLatest("auth/signUp", signUp)]);
  yield all([takeLatest("auth/verifyOtp", verifyOtp)]);
  yield all([takeLatest("auth/resendVerifyOtp", resendVerifyOtp)]);
  yield all([takeLatest("auth/signIn", signIn)]);
  yield all([takeLatest("auth/forgotPassword", forgotPassword)]);
  yield all([takeLatest("auth/resetPassword", resetPassword)]);
  yield all([takeLatest("auth/addInvoice", addInvoice)]);
  yield all([takeLatest("auth/inVoiceList", inVoiceList)]);
  yield all([takeLatest("auth/singleInvoice", singleInvoice)]);
  yield all([takeLatest("auth/updateInvoice", updateInvoice)]);
  yield all([takeLatest("auth/deleteInvoice", deleteInvoice)]);
}

export default authSaga;
