import i18n from "../core/translation/i18n";
import * as toastr from 'toastr';

export function getErrorMessage(error: string) {
    let odataErrorMessage = getOdataErrorMessage(error);
    if (odataErrorMessage) {
        return odataErrorMessage;
    }

    return error;
}

export function getOdataErrorMessage(error: string) {
    if (error) {
        const prettyError = error.trim().toLowerCase();
        if (prettyError.indexOf('(error code: 1000)') > -1) {
            return `${i18n.t('errors:common.title')} ${i18n.t('errors:database.concurrency')}`;
        }

        if (prettyError.indexOf('not found') > -1) {
            return `${i18n.t('errors:common.title')} ${i18n.t('errors:database.not-found')}`;
        }

        if (prettyError.indexOf('duplicate key') > -1 && prettyError.indexOf('IX_VendorCode') > -1) {
            return `${i18n.t('errors:common.title')} ${i18n.t('errors:database.product.duplicate-vendor-code')}`;
        }

        return error;
    }

    return null;
}

export function handleInvokeException(errors: any, showNotification: boolean) {
    console.error(errors);

    let errorMessage = errors;
    
    if (!errorMessage) {
        if (showNotification) {
            toastr.error(errorMessage as string, i18n.t('errors:common.something-error'), {
                escapeHtml: true
            });
        }
        return;    
    }

    if (typeof errors !== 'string') {
        errorMessage = errors._error
            ? getErrorMessage(errors._error)
            : JSON.stringify(errors, null, 2);
    } else {
        errorMessage = getErrorMessage(errorMessage as string);
    }

    console.error(errorMessage);
    if (showNotification) {
        toastr.error(errorMessage as string, i18n.t('notifications:rest.failed'), {
            escapeHtml: true
        });
    }
}