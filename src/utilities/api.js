import axios from "axios";
import BaseUrl from "../constants/baseUrl";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: BaseUrl.API_URL,
  headers: {
    Accept: "application/json",
  },
});

//axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

// Set the AUTH token for any request
axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("invoiceAuthToken");
  config.headers.Authorization = token ? token : "";
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      // handle 401 errors here
      console.log("Unauthorized access");
      localStorage.clear();
      window.location.href("/");

      toast.warning("Session expired");
    }
    return Promise.reject(error);
  }
);

const axiosGet = (url, params = {}) => {
  return axiosInstance
    .get(url, params)
    .then((response) => {
      return { status: response.status, data: response.data };
    })
    .catch((err) => {
      throw err;
    });
};

const axiosPut = (url, params = {}) => {
  return axiosInstance
    .put(url, params)
    .then((response) => {
      return { status: response.status, data: response.data };
    })
    .catch((err) => {
      throw err;
    });
};

const axiosPost = (url, params = {}) => {
  return axiosInstance
    .post(url, params)
    .then((response) => {
      return { status: response.status, data: response.data };
    })
    .catch((err) => {
      throw err;
    });
};

const axiosPatch = (url, params = {}) => {
  return axiosInstance
    .patch(url, params)
    .then((response) => {
      return { status: response.status, data: response.data };
    })
    .catch((err) => {
      throw err;
    });
};

const postDelete = (url, params = {}) => {
  return axiosInstance
    .delete(url, params)
    .then((response) => {
      return { status: response.status, data: response.data };
    })
    .catch((err) => {
      throw err;
    });
};

const axiosPostFormData = (url, params) => {
  if (params.document) {
    var formData = new FormData();
    formData.append("document", params?.document);
  } else if (params.file) {
    let files = params?.file;
    var formData = new FormData();
    files.forEach((val, index) => {
      formData.append("photo", val);
    });
  } else {
    var formData = new FormData();
    formData.append("image", params?.photo);
  }
  return axiosInstance
    .post(url, formData)
    .then((response) => {
      return { status: response.status, data: response.data };
    })
    .catch((err) => {
      throw err;
    });
};

export const ApiClient = {
  get: axiosGet,
  put: axiosPut,
  post: axiosPost,
  patch: axiosPatch,
  delete: postDelete,
  postFormData: axiosPostFormData,
};
