import i18n from "../translation/i18n";

export function getEnumLegalEntityKind() {
    return [
        {
            name: i18n.t('enums:LegalEntityKind.Nothing'),
            value: 'Nothing'
        },
        {
            name: i18n.t('enums:LegalEntityKind.IP'),
            value: 'IP'
        },
        {
            name: i18n.t('enums:LegalEntityKind.Company'),
            value: 'Company'
        },
        {
            name: i18n.t('enums:LegalEntityKind.SelfEmployed'),
            value: 'SelfEmployed'
        }
    ]
}

export function getEnumCustomerType() {
    return [
        {
            name: i18n.t('enums:CustomerType.Nothing'),
            value: 'Nothing'
        },
        {
            name: i18n.t('enums:CustomerType.Manufacturer'),
            value: 'Manufacturer'
        },
        {
            name: i18n.t('enums:CustomerType.Distributor'),
            value: 'Distributor'
        },
        {
            name: i18n.t('enums:CustomerType.Other'),
            value: 'Other'
        }
    ]
}

export function getEnumCountries() {
    return [
        { value: "Nothing", name: i18n.t('enums:Countries.Nothing') },
        { value: "AF", name: "Afghanistan" },
        { value: "AX", name: "Aland Islands" },
        { value: "AL", name: "Albania" },
        { value: "DZ", name: "Algeria" },
        { value: "AS", name: "American Samoa" },
        { value: "AD", name: "Andorra" },
        { value: "AO", name: "Angola" },
        { value: "AI", name: "Anguilla" },
        { value: "AQ", name: "Antarctica" },
        { value: "AG", name: "Antigua and Barbuda" },
        { value: "AR", name: "Argentina" },
        { value: "AM", name: "Armenia" },
        { value: "AW", name: "Aruba" },
        { value: "AU", name: "Australia" },
        { value: "AT", name: "Austria" },
        { value: "AZ", name: "Azerbaijan" },
        { value: "BS", name: "Bahamas" },
        { value: "BH", name: "Bahrain" },
        { value: "BD", name: "Bangladesh" },
        { value: "BB", name: "Barbados" },
        { value: "BY", name: "Belarus" },
        { value: "BE", name: "Belgium" },
        { value: "BZ", name: "Belize" },
        { value: "BJ", name: "Benin" },
        { value: "BM", name: "Bermuda" },
        { value: "BT", name: "Bhutan" },
        { value: "BO", name: "Bolivia" },
        { value: "BQ", name: "Bonaire, Sint Eustatius and Saba" },
        { value: "BA", name: "Bosnia and Herzegovina" },
        { value: "BW", name: "Botswana" },
        { value: "BV", name: "Bouvet Island" },
        { value: "BR", name: "Brazil" },
        { value: "IO", name: "British Indian Ocean Territory" },
        { value: "BN", name: "Brunei Darussalam" },
        { value: "BG", name: "Bulgaria" },
        { value: "BF", name: "Burkina Faso" },
        { value: "BI", name: "Burundi" },
        { value: "KH", name: "Cambodia" },
        { value: "CM", name: "Cameroon" },
        { value: "CA", name: "Canada" },
        { value: "CV", name: "Cape Verde" },
        { value: "KY", name: "Cayman Islands" },
        { value: "CF", name: "Central African Republic" },
        { value: "TD", name: "Chad" },
        { value: "CL", name: "Chile" },
        { value: "CN", name: "China" },
        { value: "CX", name: "Christmas Island" },
        { value: "CC", name: "Cocos (Keeling) Islands" },
        { value: "CO", name: "Colombia" },
        { value: "KM", name: "Comoros" },
        { value: "CG", name: "Congo" },
        { value: "CD", name: "Congo, the Democratic Republic of the" },
        { value: "CK", name: "Cook Islands" },
        { value: "CR", name: "Costa Rica" },
        { value: "CI", name: "Cote d'Ivoire" },
        { value: "HR", name: "Croatia" },
        { value: "CU", name: "Cuba" },
        { value: "CW", name: "Curaçao" },
        { value: "CY", name: "Cyprus" },
        { value: "CZ", name: "Czech Republic" },
        { value: "DK", name: "Denmark" },
        { value: "DJ", name: "Djibouti" },
        { value: "DM", name: "Dominica" },
        { value: "DO", name: "Dominican Republic" },
        { value: "EC", name: "Ecuador" },
        { value: "EG", name: "Egypt" },
        { value: "SV", name: "El Salvador" },
        { value: "GQ", name: "Equatorial Guinea" },
        { value: "ER", name: "Eritrea" },
        { value: "EE", name: "Estonia" },
        { value: "ET", name: "Ethiopia" },
        { value: "FK", name: "Falkland Islands (Malvinas)" },
        { value: "FO", name: "Faroe Islands" },
        { value: "FJ", name: "Fiji" },
        { value: "FI", name: "Finland" },
        { value: "FR", name: "France" },
        { value: "GF", name: "French Guiana" },
        { value: "PF", name: "French Polynesia" },
        { value: "TF", name: "French Southern Territories" },
        { value: "GA", name: "Gabon" },
        { value: "GM", name: "Gambia" },
        { value: "GE", name: "Georgia" },
        { value: "DE", name: "Germany" },
        { value: "GH", name: "Ghana" },
        { value: "GI", name: "Gibraltar" },
        { value: "GR", name: "Greece" },
        { value: "GL", name: "Greenland" },
        { value: "GD", name: "Grenada" },
        { value: "GP", name: "Guadeloupe" },
        { value: "GU", name: "Guam" },
        { value: "GT", name: "Guatemala" },
        { value: "GG", name: "Guernsey" },
        { value: "GN", name: "Guinea" },
        { value: "GW", name: "Guinea-Bissau" },
        { value: "GY", name: "Guyana" },
        { value: "HT", name: "Haiti" },
        { value: "HM", name: "Heard Island and McDonald Islands" },
        { value: "VA", name: "Holy See (Vatican City State)" },
        { value: "HN", name: "Honduras" },
        { value: "HK", name: "Hong Kong" },
        { value: "HU", name: "Hungary" },
        { value: "IS", name: "Iceland" },
        { value: "IN", name: "India" },
        { value: "ID", name: "Indonesia" },
        { value: "IR", name: "Iran" },
        { value: "IQ", name: "Iraq" },
        { value: "IE", name: "Ireland" },
        { value: "IM", name: "Isle of Man" },
        { value: "IL", name: "Israel" },
        { value: "IT", name: "Italy" },
        { value: "JM", name: "Jamaica" },
        { value: "JP", name: "Japan" },
        { value: "JE", name: "Jersey" },
        { value: "JO", name: "Jordan" },
        { value: "KZ", name: "Kazakhstan" },
        { value: "KE", name: "Kenya" },
        { value: "KI", name: "Kiribati" },
        { value: "KP", name: "Korea, Democratic People's Republic of" },
        { value: "KR", name: "Korea, Republic of" },
        { value: "KW", name: "Kuwait" },
        { value: "KG", name: "Kyrgyzstan" },
        { value: "LA", name: "Lao People's Democratic Republic" },
        { value: "LV", name: "Latvia" },
        { value: "LB", name: "Lebanon" },
        { value: "LS", name: "Lesotho" },
        { value: "LR", name: "Liberia" },
        { value: "LY", name: "Libya" },
        { value: "LI", name: "Liechtenstein" },
        { value: "LT", name: "Lithuania" },
        { value: "LU", name: "Luxembourg" },
        { value: "MO", name: "Macao" },
        { value: "MK", name: "Macedonia" },
        { value: "MG", name: "Madagascar" },
        { value: "MW", name: "Malawi" },
        { value: "MY", name: "Malaysia" },
        { value: "MV", name: "Maldives" },
        { value: "ML", name: "Mali" },
        { value: "MT", name: "Malta" },
        { value: "MH", name: "Marshall Islands" },
        { value: "MQ", name: "Martinique" },
        { value: "MR", name: "Mauritania" },
        { value: "MU", name: "Mauritius" },
        { value: "YT", name: "Mayotte" },
        { value: "MX", name: "Mexico" },
        { value: "FM", name: "Micronesia" },
        { value: "MD", name: "Moldova" },
        { value: "MC", name: "Monaco" },
        { value: "MN", name: "Mongolia" },
        { value: "ME", name: "Montenegro" },
        { value: "MS", name: "Montserrat" },
        { value: "MA", name: "Morocco" },
        { value: "MZ", name: "Mozambique" },
        { value: "MM", name: "Myanmar" },
        { value: "NA", name: "Namibia" },
        { value: "NR", name: "Nauru" },
        { value: "NP", name: "Nepal" },
        { value: "NL", name: "Netherlands" },
        { value: "NC", name: "New Caledonia" },
        { value: "NZ", name: "New Zealand" },
        { value: "NI", name: "Nicaragua" },
        { value: "NE", name: "Niger" },
        { value: "NG", name: "Nigeria" },
        { value: "NU", name: "Niue" },
        { value: "NF", name: "Norfolk Island" },
        { value: "MP", name: "Northern Mariana Islands" },
        { value: "NO", name: "Norway" },
        { value: "OM", name: "Oman" },
        { value: "PK", name: "Pakistan" },
        { value: "PW", name: "Palau" },
        { value: "PS", name: "Palestinian Territory" },
        { value: "PA", name: "Panama" },
        { value: "PG", name: "Papua New Guinea" },
        { value: "PY", name: "Paraguay" },
        { value: "PE", name: "Peru" },
        { value: "PH", name: "Philippines" },
        { value: "PN", name: "Pitcairn" },
        { value: "PL", name: "Poland" },
        { value: "PT", name: "Portugal" },
        { value: "PR", name: "Puerto Rico" },
        { value: "QA", name: "Qatar" },
        { value: "RE", name: "Reunion" },
        { value: "RO", name: "Romania" },
        { value: "RU", name: "Russian Federation" },
        { value: "RW", name: "Rwanda" },
        { value: "BL", name: "Saint Barthélemy" },
        { value: "SH", name: "Saint Helena, Ascension and Tristan da Cunha" },
        { value: "KN", name: "Saint Kitts and Nevis" },
        { value: "LC", name: "Saint Lucia" },
        { value: "MF", name: "Saint Martin (French part)" },
        { value: "PM", name: "Saint Pierre and Miquelon" },
        { value: "VC", name: "Saint Vincent and the Grenadines" },
        { value: "WS", name: "Samoa" },
        { value: "SM", name: "San Marino" },
        { value: "ST", name: "Sao Tome and Principe" },
        { value: "SA", name: "Saudi Arabia" },
        { value: "SN", name: "Senegal" },
        { value: "RS", name: "Serbia" },
        { value: "SC", name: "Seychelles" },
        { value: "SL", name: "Sierra Leone" },
        { value: "SG", name: "Singapore" },
        { value: "SX", name: "Sint Maarten (Dutch part)" },
        { value: "SK", name: "Slovakia" },
        { value: "SI", name: "Slovenia" },
        { value: "SB", name: "Solomon Islands" },
        { value: "SO", name: "Somalia" },
        { value: "ZA", name: "South Africa" },
        { value: "GS", name: "South Georgia and the South Sandwich Islands" },
        { value: "SS", name: "South Sudan" },
        { value: "ES", name: "Spain" },
        { value: "LK", name: "Sri Lanka" },
        { value: "SD", name: "Sudan" },
        { value: "SR", name: "Suriname" },
        { value: "SJ", name: "Svalbard and Jan Mayen" },
        { value: "SZ", name: "Swaziland" },
        { value: "SE", name: "Sweden" },
        { value: "CH", name: "Switzerland" },
        { value: "SY", name: "Syrian Arab Republic" },
        { value: "TW", name: "Taiwan" },
        { value: "TJ", name: "Tajikistan" },
        { value: "TZ", name: "Tanzania" },
        { value: "TH", name: "Thailand" },
        { value: "TL", name: "Timor-Leste" },
        { value: "TG", name: "Togo" },
        { value: "TK", name: "Tokelau" },
        { value: "TO", name: "Tonga" },
        { value: "TT", name: "Trinidad and Tobago" },
        { value: "TN", name: "Tunisia" },
        { value: "TR", name: "Turkey" },
        { value: "TM", name: "Turkmenistan" },
        { value: "TC", name: "Turks and Caicos Islands" },
        { value: "TV", name: "Tuvalu" },
        { value: "UG", name: "Uganda" },
        { value: "UA", name: "Ukraine" },
        { value: "AE", name: "United Arab Emirates" },
        { value: "GB", name: "United Kingdom" },
        { value: "US", name: "United States" },
        { value: "UM", name: "United States Minor Outlying Islands" },
        { value: "UY", name: "Uruguay" },
        { value: "UZ", name: "Uzbekistan" },
        { value: "VU", name: "Vanuatu" },
        { value: "VE", name: "Venezuela" },
        { value: "VN", name: "Viet Nam" },
        { value: "VG", name: "Virgin Islands, British" },
        { value: "VI", name: "Virgin Islands, U.S." },
        { value: "WF", name: "Wallis and Futuna" },
        { value: "EH", name: "Western Sahara" },
        { value: "YE", name: "Yemen" },
        { value: "ZM", name: "Zambia" },
        { value: "ZW", name: "Zimbabwe" }
    ]
}

export function getEnumContactRole() {
    return [
        {
            name: i18n.t('enums:ContactRole.Nothing'),
            value: 'Nothing'
        },
        {
            name: i18n.t('enums:ContactRole.Manager'),
            value: 'Manager'
        },
        {
            name: i18n.t('enums:ContactRole.Owner'),
            value: 'Owner'
        }
    ]
}

export function getEnumProductState() {
    return [
        {
            name: i18n.t('enums:ProductState.Nothing'),
            value: 'Nothing'
        },
        {
            name: i18n.t('enums:ProductState.Editable'),
            value: 'Editable'
        },
        {
            name: i18n.t('enums:ProductState.Published'),
            value: 'Published'
        },
        {
            name: i18n.t('enums:ProductState.UnPublished'),
            value: 'UnPublished'
        },
        {
            name: i18n.t('enums:ProductState.Archived'),
            value: 'Archived'
        }
    ]
}

export function getEnumMarketplaceKind() {
    return [
        {
            name: i18n.t('enums:MarketPlaceKind.Internal'),
            value: 'Internal'
        },
        {
            name: i18n.t('enums:MarketPlaceKind.Ozon'),
            value: 'Ozon'
        },
        {
            name: i18n.t('enums:MarketPlaceKind.Beru'),
            value: 'Beru'
        },
        {
            name: i18n.t('enums:MarketPlaceKind.Wildberries'),
            value: 'Wildberries'
        },
        {
            name: i18n.t('enums:MarketPlaceKind.WildberriesFBS'),
            value: 'WildberriesFBS'
        },
        {
            name: i18n.t('enums:MarketPlaceKind.Goods'),
            value: 'Goods'
        },
        {
            name: i18n.t('enums:MarketPlaceKind.Lamoda'),
            value: 'Lamoda'
        }
    ]
}

export function getEnumWatchingProductMarketplaceKind() {
    return [
        {
            name: i18n.t('enums:MarketPlaceKind.Wildberries'),
            value: 'Wildberries'
        },
        {
            name: i18n.t('enums:MarketPlaceKind.Ozon'),
            value: 'Ozon'
        }
    ]
}

export function getEnumConnectedState() {
    return [
        {
            name: i18n.t('enums:ConnectedState.Nothing'),
            value: 'Nothing'
        },
        {
            name: i18n.t('enums:ConnectedState.Connected'),
            value: 'Connected'
        },
        {
            name: i18n.t('enums:ConnectedState.Disconnected'),
            value: 'Disconnected'
        },
        {
            name: i18n.t('enums:ConnectedState.Error'),
            value: 'Error'
        }
    ]
}

export function getEnumExistProductAction() {
    return [
        /*{
            name: i18n.t('enums:ExistProductAction.AddNewWithSameIdentifier'),
            value: 'AddNewWithSameIdentifier'
        },
        {
            name: i18n.t('enums:ExistProductAction.ReplaceExistProduct'),
            value: 'ReplaceExistProduct'
        },
        */
        {
            name: i18n.t('enums:ExistProductAction.AddNewWithNewIdentifier'),
            value: 'AddNewWithNewIdentifier'
        },
        {
            name: i18n.t('enums:ExistProductAction.IgnoreImportedProduct'),
            value: 'IgnoreImportedProduct'
        }
    ]
}

export function getEnumOrderState() {
    return [
        {
            name: i18n.t('enums:OrderState.Nothing'),
            value: 'Nothing'
        },
        {
            name: i18n.t('enums:OrderState.New'),
            value: 'New'
        },
        {
            name: i18n.t('enums:OrderState.InProgress'),
            value: 'InProgress'
        },
        {
            name: i18n.t('enums:OrderState.Stopped'),
            value: 'Stopped'
        },
        {
            name: i18n.t('enums:OrderState.Canceled'),
            value: 'Canceled'
        },
        {
            name: i18n.t('enums:OrderState.Done'),
            value: 'Done'
        }
    ]
}

export function getEnumAttributesFormFilter() {
    return [
        {
            name: i18n.t('enums:AttributesFormFilter.All'),
            value: 'All'
        },
        {
            name: i18n.t('enums:AttributesFormFilter.Required'),
            value: 'Required'
        },
        {
            name: i18n.t('enums:AttributesFormFilter.NotRequired'),
            value: 'NotRequired'
        },
        {
            name: i18n.t('enums:AttributesFormFilter.Empty'),
            value: 'Empty'
        },
        {
            name: i18n.t('enums:AttributesFormFilter.Filled'),
            value: 'Filled'
        },
        {
            name: i18n.t('enums:AttributesFormFilter.Bad'),
            value: 'Bad'
        }
    ]
}

export function getEnumTestSubject() {
    return [
        {
            name: i18n.t('enums:TestSubject.Nothing'),
            value: 'Nothing'
        },
        {
            name: i18n.t('enums:TestSubject.Title'),
            value: 'Title'
        },
        {
            name: i18n.t('enums:TestSubject.Description'),
            value: 'Description'
        },
        {
            name: i18n.t('enums:TestSubject.Option'),
            value: 'Option'
        },
        {
            name: i18n.t('enums:TestSubject.Photo'),
            value: 'Photo'
        },
        {
            name: i18n.t('enums:TestSubject.Price'),
            value: 'Price'
        },
        {
            name: i18n.t('enums:TestSubject.Complex'),
            value: 'Complex'
        }
    ]
}

export function getEnumSearchMethod() {
    return [
        {
            name: i18n.t('enums:SearchMethod.Nothing'),
            value: 'Nothing'
        },
        {
            name: i18n.t('enums:SearchMethod.Category'),
            value: 'Category'
        },
        {
            name: i18n.t('enums:SearchMethod.Keyword'),
            value: 'Keyword'
        }
    ]
}

export function getEnumRefreshRateType() {
    return [
        {
            name: i18n.t('enums:RefreshRateType.Nothing'),
            value: 'Nothing'
        },
        {
            name: i18n.t('enums:RefreshRateType.Minute'),
            value: 'Minute'
        },
        {
            name: i18n.t('enums:RefreshRateType.Hourly'),
            value: 'Hourly'
        },
        {
            name: i18n.t('enums:RefreshRateType.Day'),
            value: 'Day'
        },
        {
            name: i18n.t('enums:RefreshRateType.Week'),
            value: 'Week'
        },
        {
            name: i18n.t('enums:RefreshRateType.Month'),
            value: 'Month'
        }
    ]
}