import { IEnvironmentSettings } from "app/common/contracts";
import { IPaginationState } from "app/common/core/data";

export interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    itemsState: IPaginationState<{ Id: string, Name: string }, {}>;
}