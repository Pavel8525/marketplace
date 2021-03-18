import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import buildQuery from 'odata-query';
import { SubmissionError } from 'redux-form';
import { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status-codes';

import { debugMode } from 'app/common/constants';
import { any } from 'app/common/helpers/array-helper';
import { ModelStateErrors, FieldError } from './ModelStateErrors';

class AxiosClient {

    public get(url: string, request: any) {
        let endpoint = url;
        if (request.params) {
            if (request.params.url !== undefined) {
                let appendCount = (request.params.url as string).toLowerCase().indexOf('count=true') <= -1;
                endpoint = `${url}?${request.params.url}${appendCount ? '&$count=true' : ''}`;
            } else {
                const query = buildQuery(request.params);
                endpoint = `${url}${query}`;
            }
        }

        if (debugMode) {
            const url = `${axios.defaults.baseURL}${endpoint}`.replace(/ /g, '%20');
            // tslint:disable-next-line
            console.info(`ODATA endpoint url: ${url}`);
        }

        return axios
            .get(endpoint)
            .catch(this.handleSubmitException);
    }

    public getPage(url: string, request: any) {
        const { pageNo, pageSize, params }: { pageNo: number, pageSize: number, params: {} } = request.data;
        const top = pageSize;
        const skip = pageNo ? (pageNo - 1) * top : 0;
        const newRequest = { ...params, skip, top, count: true };

        const responsePath = (response: AxiosResponse<any>) => {
            (response as any).pageSize = pageSize;
            (response as any).pageNo = pageNo;
            return response;
        };

        return this
            .get(url, { params: newRequest })
            .then(responsePath)
            .catch(this.handleSubmitException);
    }

    public post(url: string, request: any, requestConfig?: AxiosRequestConfig) {
        const endpoint = this.getEndpoint(url, request);

        return axios
            .post(endpoint, request.params, requestConfig)
            .catch(this.handleSubmitException);
    }

    public patch(url: string, request: any) {
        const endpoint = this.getEndpoint(url, request);
        const config = {
            headers: { 'Prefer': 'return=representation' }
        };

        return axios
            .patch(endpoint, request.params, config)
            .catch(this.handleSubmitException);
    }

    private getEndpoint(url: string, request: any): string {
        let endpoint = url;
        if (request && request.query) {
            const queryString = buildQuery(request.query);
            endpoint = `${url}${queryString}`;
        }

        return endpoint;
    }

    private handleSubmitException(axiosError: AxiosError<any>) {
        if (axiosError instanceof SubmissionError) {
            throw axiosError;
        }

        const { response } = axiosError;

        if (response.status == BAD_REQUEST && response.data && response.data.error) {
            const error = JSON.parse(response.data.error.message);

            let firstFieldName = null;
            let firstErrorMessage = null;
            let commonErrorMessage = null;
            for (const key in error) {
                firstFieldName = key.startsWith('entity.') ? key.substring('entity.'.length) : key;
                firstErrorMessage = any(error[key].Errors) && error[key].Errors[0].ErrorMessage || error[key].Errors[0].Exception;
            }

            if (firstFieldName && firstErrorMessage) {
                let submissionError: any = {};
                submissionError[firstFieldName] = firstErrorMessage;
                if (commonErrorMessage) {
                    submissionError['_error'] = commonErrorMessage;
                }

                throw new SubmissionError(submissionError);
            }
        }

        if (response.data.error) {
            if (response.data.error.innererror) {
                throw new SubmissionError({
                    '_error': `${response.data.error.innererror.message} (Error code: ${response.data.error.code})`
                });
            }
            else {
                throw new SubmissionError({
                    '_error': `${response.data.error.message} (Error code: ${response.data.error.code})`
                });
            }
        }

        if (response.data.Message && response.data.Message.indexOf('IsModelStateErrors') > -1) {
            const modelStateErrors = JSON.parse(response.data.Message) as ModelStateErrors;
            if (modelStateErrors.IsModelStateErrors == true) {
                let submissionError: any = {};

                if (modelStateErrors.Message) {
                    submissionError['_error'] = modelStateErrors.Message;
                }

                if (any(modelStateErrors.FieldErrors)) {
                    modelStateErrors.FieldErrors.forEach((fieldError: FieldError) => {
                        submissionError[fieldError.Field] = fieldError.Error;
                    });
                }

                throw new SubmissionError(submissionError);
            }
        }

        if ((response.status == INTERNAL_SERVER_ERROR || response.status == BAD_REQUEST)
            && response.data
            && response.data.Message) {

            throw new SubmissionError({
                '_error': response.data.Message
            });
        }

        throw new SubmissionError({
            '_error': `${response.status} ${response.statusText}`
        });
    }
}

export { AxiosClient }
