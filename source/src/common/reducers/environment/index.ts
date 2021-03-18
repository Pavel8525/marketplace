import { environmentSettingsService } from './environment-settings-service';
export { environmentSettingsService } from './environment-settings-service';

export const environmentSettings = environmentSettingsService.objectReducer;
