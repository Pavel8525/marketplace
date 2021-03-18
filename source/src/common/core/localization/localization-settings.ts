import { ILocalizationSettings } from "app/common/contracts";

const dateFormat = 'dd.MM.yy HH:mm'

export function getCurrentLocalizationSettings (): ILocalizationSettings {
    return {
        dateFormat : `{0:${dateFormat}}`,
        calendarDateFormat: dateFormat,
        currencyFormat: "{0:c2}",
        number2Format: "n2",
        number2FormatFull: "{0:n2}"
    };
}
