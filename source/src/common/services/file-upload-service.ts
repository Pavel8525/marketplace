import { AxiosRequestConfig } from 'axios';
import * as toastr from 'toastr';
import { AxiosClient } from 'app/common/core/transport/axios-client';

const baseUploadFileUrl = 'upload/product/attachments/photo?'
const api = new AxiosClient();

interface UploadResponse {
    Id: string;
    Uri: string;
}

interface FeedbackContent {
    successMessage: string;
    errorMessage?: string;
}

export const uploadProductFiles = async (
    files: File[],
    queryParams: AxiosRequestConfig['params'],
    feedbackContent?: FeedbackContent
): Promise<UploadResponse> => {
    const formData = new FormData();
    const file = files[0];

    // for (const file of files) {
        formData.append('files[]', file)
    // }

    const requestParams = { params: formData }
    const requestConfig: AxiosRequestConfig = {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: queryParams,
    }

    try {
        const result = await api.post(baseUploadFileUrl, requestParams, requestConfig)
        if (feedbackContent) {
            toastr.success(feedbackContent.successMessage)
        }
        return result as unknown as UploadResponse;
    } catch (e) {
        if (feedbackContent) {
            toastr.success(feedbackContent.errorMessage || e.message)
        }
    }
}
