

import { toast } from "react-toastify";

const AxiosToastError = (error) => {
  if (!error) return toast.error("Something went wrong!");

  // ✅ Case 1: Backend responded with error
  if (error.response) {
    const message =
      error.response.data?.message ||
      `Server error (${error.response.status})`;
    toast.error(message);
  }

  // ✅ Case 2: No response from backend
  else if (error.request) {
    toast.error("No response from server. Please check your connection.");
  }

  // ✅ Case 3: Other runtime errors
  else {
    toast.error(error.message || "Unexpected error occurred");
  }
};

export default AxiosToastError;

