import axios from 'axios';
import { apiUrl } from 'app/common/constants';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import { authService } from '../auth';

axios.defaults.baseURL = `${apiUrl}/api`;

axios.interceptors.request.use(function (request) {
    const userAuthData = authService.getUserAuthData();
    if (userAuthData == null) {

        authService.logOut();

        return Promise.reject(authService.NOT_AUTHORIZED);
    }

    request.headers.common.Authorization = `${userAuthData.tokenType} ${userAuthData.accessToken}`;

    return request;
}, function (error) {

    return Promise.reject(error);
});

/*
// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    return Promise.reject(error);
});
*/

const refreshAuthLogic = (failedRequest: any) => authService.refreshToken().then(() => {
    const userAuthData = authService.getUserAuthData();
    if (userAuthData == null) {

        authService.logOut();

        return Promise.reject(authService.NOT_AUTHORIZED);
    }
    
    failedRequest.response.config.headers['Authorization'] = `${userAuthData.tokenType} ${userAuthData.accessToken}`;

    return Promise.resolve();
});

createAuthRefreshInterceptor(axios, refreshAuthLogic);
