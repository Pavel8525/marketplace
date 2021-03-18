import { AxiosRequestConfig } from "axios";
import { extend } from "underscore";

/**
 * Get GUID object for odata-query
 * @param value - value of GUID string 
 * @param operator - OData operator
 */
export const getGuid = function (value: string, operator: string): {} {
    const result: any = {};
    result[operator] = {
        type: 'guid',
        value: value
    };
    return result;
}

export const createReadWriteContext = function (contentType: any, dataServiceVersion: any, context: any, handler: any) {
    var rwContext = {};
    extend(rwContext, context);
    extend(rwContext, {
        contentType: contentType,
        dataServiceVersion: dataServiceVersion,
        handler: handler
    });

    return rwContext;
}

export const getBatchPayload = (requests: any): string => {
    const windowAsAny = window as any;
    const batchHandler = windowAsAny.odatajs.oData.batch.batchHandler;
    const batchSerializer = windowAsAny.odatajs.oData.batch.batchSerializer;

    const context: any = {
        metadata: [],
        recognizeDates: false,
        callbackParameterName: "$callback",
        formatQueryString: "$format=json",
        enableJsonpCallback: false
    };

    var writeContext = createReadWriteContext(null, undefined, context, batchHandler);

    const data = batchSerializer(
        batchHandler,
        {
            __batchRequests: [{ __changeRequests: requests }]
        },
        writeContext);

    return data;
}

export const getBatchHeaders = (batchId: string): AxiosRequestConfig => {
    return {
        headers: {
            'Content-Type': `multipart/mixed; boundary=${batchId}`,
            Accept: 'multipart/mixed',
            'Accept-Charset': 'UTF-8',
            'OData-Version': '4.0',
            'OData-MaxVersion': '4.0'
        },
    }
}