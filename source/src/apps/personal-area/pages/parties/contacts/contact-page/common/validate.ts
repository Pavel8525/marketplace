import i18n from "app/common/core/translation/i18n";

import { Bantikom } from "app/common/core/api/proxy";

interface IValidationResult {
    PhoneNumber?: string;
}

export const validate = (contact: Bantikom.Contact) => {
    const result: IValidationResult = {};

    if ((!contact.PhoneNumber && !contact.Email)) {
        result.PhoneNumber = i18n.t('forms:validation.required');
    }

    return result;
}