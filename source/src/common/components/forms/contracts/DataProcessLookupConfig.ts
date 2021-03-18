export interface DataProcessLookupConfig {
    apiUrl: string;
    request(filters: any): object;
}
