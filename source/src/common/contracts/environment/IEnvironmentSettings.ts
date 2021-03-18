import { ILocalizationSettings } from "../";

export interface IEnvironmentSettings {
    currentLanguage: string;
    fixedHeader: boolean;
    localizationSettings: ILocalizationSettings;
}