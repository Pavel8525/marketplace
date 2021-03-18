import axios, { AxiosInstance } from 'axios';

import { apiUrl, applicationPrefixKey, OAuthClientId } from 'app/common/constants';

import { IUserAuthData, ILoginRequest, IFailedLoginData } from '..';

const authService = (() => {
    const USER_AUTH_DATA_KEY = `${applicationPrefixKey}:auth:user-auth-data`;
    const NOT_AUTHORIZED = 'Not authorized';

    const getAuthClient = (): AxiosInstance => {
        const authHttpClient = axios.create({
            timeout: 30 * 1000,
            baseURL: 'token',
            headers: {
                contentType: "application/x-www-form-urlencoded"
            }
        });

        authHttpClient.interceptors.request.use((request) => {
            delete request.headers.common.Authorization;
            return request;
        });

        return authHttpClient;
    }

    const parseUserAuthData = (data: any): IUserAuthData => {
        const result: IUserAuthData = {
            accessToken: data.access_token,
            tokenType: data.token_type,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
            userName: data.user_name,
            roles: (data.roles as string).split(','),
            issued: new Date(Date.parse(data['.issued'])),
            expires: new Date(Date.parse(data['.expires']))
        }
        return result;
    }

    /**
     * Login to API services
     * @param loginData 
     */
    const login = (loginData: ILoginRequest): Promise<IUserAuthData> => {
        const authHttpClient = getAuthClient();
        const {
            login,
            password,
            staySigned
        } = loginData;

        localStorage.removeItem(USER_AUTH_DATA_KEY);

        let payload = "grant_type=password&client_id=" + OAuthClientId + "&username=" + encodeURIComponent(login) + "&password=" + encodeURIComponent(password);

        if (staySigned) {
            payload = payload + "&stay_signed=" + staySigned;
        }

        return new Promise<IUserAuthData>((resolve, reject) => {
            authHttpClient.post(`${apiUrl}/auth/token`, payload).then((response) => {
                const result = parseUserAuthData(response.data);
                localStorage.setItem(USER_AUTH_DATA_KEY, JSON.stringify(result));

                resolve(result);
            }).catch((reason) => {
                const result: IFailedLoginData = reason.response
                    ? {
                        error: reason.response.data.error,
                        errorDescription: reason.response.data.error_description
                    }
                    : {
                        error: reason.code,
                        errorDescription: reason.message
                    };

                reject(result);
            });
        });
    }

    const refreshToken = (): Promise<IUserAuthData> => {
        const authHttpClient = getAuthClient();
        const authData = getUserAuthData();
        if (authData === null) {
            logOut();
            return Promise.reject(NOT_AUTHORIZED);
        };

        let payload = "grant_type=refresh_token&client_id=" + OAuthClientId + "&refresh_token=" + authData.refreshToken;

        console.info('Start refresh authentication token');

        return new Promise<IUserAuthData>((resolve, reject) => {
            authHttpClient.post(`${apiUrl}/auth/token`, payload).then((response) => {
                const result = parseUserAuthData(response.data);
                localStorage.setItem(USER_AUTH_DATA_KEY, JSON.stringify(result));

                console.info('Finished refresh authentication token', result);

                resolve(result);
            }).catch((reason) => {
                const result: IFailedLoginData = reason.response
                    ? {
                        error: reason.response.data.error,
                        errorDescription: reason.response.data.error_description
                    }
                    : {
                        error: reason.code,
                        errorDescription: reason.message
                    };

                console.error('Failed refresh authentication token', result);

                logOut();
                reject(result);
            });
        });
    }

    /**
     * Log out
     */
    const logOut = () => {
        localStorage.removeItem(USER_AUTH_DATA_KEY);
        setTimeout(() => {
            window.location.href = '/login';
        }, 0);
    }

    /**
     * Get user auth data
     */
    const getUserAuthData = (): IUserAuthData => {
        const data = localStorage.getItem(USER_AUTH_DATA_KEY);
        if (data) {
            return JSON.parse(data) as IUserAuthData;
        }
        return null;
    }

    /**
     * Is user authenticated
     */
    const isAuthenticated = (): boolean => getUserAuthData() != null;

    return {
        NOT_AUTHORIZED,

        login,
        refreshToken,
        logOut,
        getUserAuthData,
        isAuthenticated
    }
})();

export { authService };