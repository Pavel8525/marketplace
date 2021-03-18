import { DataProcessLookupConfig, ISelectFieldProps } from ".";

export interface ILookupFieldProps extends ISelectFieldProps {
    count?: number;
    initFilter?: any;
    uniqueIdentifier?: string;
    typeIdString?: boolean;
    dataProcessConfig?: DataProcessLookupConfig;
    fetchOnLoad?: boolean;
    selectFields?: string[];
}
