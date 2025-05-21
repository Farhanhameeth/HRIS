import { logout } from './authSlice';
import {jwtDecode} from "jwt-decode";

export const setLogoutTimer = (dispatch, token) => {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = (decodedToken.exp - currentTime) * 1000;

    // Set a timeout to log the user out when the token expires or after 30 minutes of inactivity
    setTimeout(() => {
        dispatch(logout());
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('employeeId');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('department');
        sessionStorage.removeItem('role');

        alert("Session has expired. Please login again.");
    }, Math.min(timeUntilExpiry, 1800000));
};
