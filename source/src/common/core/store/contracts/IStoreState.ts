import { IEnvironmentSettings } from "app/common/contracts";

export interface IStoreState {
    environmentSettings: IEnvironmentSettings,
    odataService: any,
    form: any 
}