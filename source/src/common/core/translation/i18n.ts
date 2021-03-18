//https://react.i18next.com/latest/withtranslation-hoc
//https://github.com/Lemoncode/i18next-example-typescript/tree/master/04_namespaces
//https://dev.to/ksushiva/how-to-translate-your-react-js-app-with-i18next-12mn

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import XHR from 'i18next-xhr-backend';

import { applicationPrefixKey } from 'app/common/constants';

export const LOCAL_STORAGE_KEY_LANGUAGE = `${applicationPrefixKey}:environment-settings:language`;
export const ENGLISH_LANGUAGE = 'en';
export const RUSSIAN_LANGUAGE = 'ru';
export const DEFAULT_LANGUAGE = RUSSIAN_LANGUAGE;

export function getCurrentLanguage(): string {
    const currentLanguage = localStorage.getItem(LOCAL_STORAGE_KEY_LANGUAGE) || DEFAULT_LANGUAGE;
    return currentLanguage;
}

export function setCurrentLanguage(language: string) {
    i18n.changeLanguage(language, () => {
        localStorage.setItem(LOCAL_STORAGE_KEY_LANGUAGE, language);
        setTimeout(window.location.reload.bind(window.location), 0);
    });
}

export const currentLanguage = getCurrentLanguage();

i18n
    .use(XHR)
    .use(initReactI18next)
    .init({
        lng: currentLanguage,
        fallbackLng: ENGLISH_LANGUAGE || RUSSIAN_LANGUAGE,
        load: 'languageOnly',
        //debug: true,
        interpolation: {
            escapeValue: false
        },
        react: {
            wait: true
        },
        ns: [
            "app",
            "auth",
            "errors",
            "enums",
            "components",
            "notifications",
            "blank",
            "campaigns",
            "campaign",
            "left-menu",
            "user-menu",
            "phonecalls",
            "agent-tasks",
            "schemes",
            "research",
            "researches",
            "cases",
            "forms",
            "breadcrumb",
            "agent",
            "agents",
            "leads",
            "lead",
            "contacts",
            "contact",
            "products",
            "product",
            "watching-products",
            "watching-product",
            "marketplace",
            "marketplaces",
            "user-orders",
            "product-groups",
            "product-group",
            "product-card-toolbar",
            "abtest",
            "abtests",
            "monitoring"
        ]
    });
export default i18n;
