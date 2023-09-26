import axios from 'axios';
import { CONSTANTS } from '../../config/app-config';
import UserRoleGet from './get_userrole_api';

const OtpLoginApi = async (request: any) => {
  console.log('otp login req', request);
  let response: any;
  const version = CONSTANTS.VERSION;
  const method = 'signin';
  const entity = 'signin';
  const otpLogin = 'true';
  const params = `?version=${version}&method=${method}&entity=${entity}&usr=${request.values.email}&pwd=${request.values.password}&with_otp=${otpLogin}`;
  const config = {
    headers: {
      Accept: 'application/json',
    },
  };

  await axios
    .post(
      `${CONSTANTS.API_BASE_URL}/${CONSTANTS.API_MANDATE_PARAMS}${params}`,
      undefined,
      { ...config, timeout: 5000 }
    )
    .then((res: any) => {
      response = res?.data?.message?.data;
      if (res?.data?.message?.msg === 'success') {
        localStorage.setItem('isLoggedIn', 'true');
      }
      UserRoleGet(res?.data?.message?.data?.access_token);
    })
    .catch((err) => {
      if (err.code === 'ECONNABORTED') {
        response = 'Request timed out';
      } else if (err.code === 'ERR_BAD_REQUEST') {
        response = 'Bad Request';
      } else if (err.code === 'ERR_INVALID_URL') {
        response = 'Invalid URL';
      } else {
        response = err;
      }
    });
  return response;
};

export default OtpLoginApi;
