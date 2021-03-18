import { objectReducerFactory } from 'app/common/core/data';
import { getCurrentLanguage } from "app/common/core/translation/i18n";
import { IEnvironmentSettings } from 'app/common/contracts';
import { getCurrentLocalizationSettings } from 'app/common/core/localization/localization-settings';

const environmentSettingsService = objectReducerFactory<IEnvironmentSettings>(
    {
        currentLanguage: getCurrentLanguage(),
        fixedHeader: true,
        localizationSettings: getCurrentLocalizationSettings()
    },
    "LAYOUTS/PAGE/ENVIRONMENT-SETTINGS/LANGUAGE/UPDATE"
);

export { environmentSettingsService };