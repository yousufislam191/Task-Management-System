import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const showToast = (status, message) => {
  if (
    status === 500 ||
    status === 400 ||
    status === 401 ||
    status === 404 ||
    status === 409 ||
    status === 429
  ) {
    return toast.error(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  } else if (status === 200 || status === 201) {
    return toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }
};
export default showToast;
