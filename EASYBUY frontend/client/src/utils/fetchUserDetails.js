// src/utils/fetchUserDetails.js
import Axios from './Axios';
import { SummaryApi } from '../common/SummaryApi';

const fetchUserDetails = async () => {
  try {
    const response = await Axios({
      ...SummaryApi.userDetails
    });
    // console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error.response?.data || error.message);
    return null;
  }
};

export default fetchUserDetails;
