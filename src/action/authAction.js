import { toast } from "react-toastify";
import { postRequest } from "../utils/api";

export const loginUser = (user, navigate) => async (dispatch) => {
  dispatch({ type: "LOGIN_REQUEST" });

  try {
    const response = await postRequest ("users/Login", user);
    
    if (response.statusCode === 200) {
      dispatch({ 
        type: "LOGIN_SUCCESS", 
        payload: { user: response.data, token: response.data.token } 
      });

      toast.success(response.message);
      navigate(`/${response?.data?.role}/dashboard`);
    } else {
      dispatch({ type: "LOGIN_FAILURE", payload: "Invalid Credentials" });
      toast.info(response.message);
    }
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error.message });
    console.error(error);
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch({ type: "LOGOUT" });
};
