import * as React from "react";
import i18n from "app/common/core/translation/i18n";

import {
    AlertPanel,
    IFormRow,
    FieldType,
    FieldControl,
    IField,
    FormColumnLayout,
    autoformFactory,
    FormState,
    Panel,
    EmailField,
    MaxLengthEmail
} from "app/common/components";
import { drawerWidth } from "app/common/constants";
import { IOperationState, Clear, InvokeSpecificUrl } from "app/common/core/data";
import { ISingleODataResponse } from "app/common/core/api/contracts/odata-response";
import { Bantikom } from "app/common/core/api/proxy";
import { any } from "app/common/helpers/array-helper";
import { authService } from "app/common/core/auth";
import { Guid } from "app/common/helpers/string-helper";

type ExportProductRequest = Bantikom.ExportProductRequest;
type ExportProductResponse = Bantikom.ExportProductResponse;
type Product = Bantikom.Product;

const EXPORT_PRODUCT_CONFIRMATION_FORM = 'EXPORT_PRODUCT_CONFIRMATION_FORM';

interface IValidationResult {
    Email?: string;
}

const validate = (request: ExportProductRequest) => {
    const result: IValidationResult = {};

    if (request.NotifyMeByEmail === true && (request.Email === null || request.Email === '')) {
        result.Email = i18n.t("product:export-product.drawer.form.validate.email-empty");
    }

    return result;
}

const getFormRows = (): IFormRow[] => {
    const rows = [
        {
            fields: [
                {
                    name: 'NotifyMeByEmail',
                    label: i18n.t('product:export-product.drawer.form.notify-me-by-email'),
                    type: FieldType.boolean
                } as IField,
                {
                    name: 'Email',
                    label: i18n.t('product:export-product.drawer.form.email'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    validate: [MaxLengthEmail, EmailField]
                } as IField
            ],
            columntLayout: FormColumnLayout.solo
        }
    ];

    return rows;
}

const defaultImportProductRequest: ExportProductRequest = {
    Id: null,
    NotifyMeByEmail: true,
    Email: authService.getUserAuthData() && authService.getUserAuthData().userName,
    Products: null
};

interface IStateProps {
    exportProductState: IOperationState<ISingleODataResponse<ExportProductResponse>>;
}

interface IDispatchProps {
    exportProduct: InvokeSpecificUrl<{}, {}>;
    clear: Clear;
}

interface IOwnProps {
    items: Product[];
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class ExportMarketplaceConfirmationForm extends React.Component<IProps> {
    private rows: IFormRow[] = null;
    private form: any;

    constructor(props: IProps) {
        super(props);

        this.form = autoformFactory({
            formName: EXPORT_PRODUCT_CONFIRMATION_FORM
        }).getForm();
        this.rows = getFormRows();
    }

    public render() {
        const {
            items
        } = this.props;

        if (!any(items)) {
            return null;
        }

        return (
            <div className="categories-chooser-page" style={{ width: drawerWidth }}>
                <div className="category-chooser-description">
                    <AlertPanel
                        message={i18n.t('product:export-product.drawer.description')}
                        type={'info'}
                    />
                    <p className="description">{i18n.t('product:export-product.drawer.items-included')} {" "} <b>{items.length}</b></p>

                    <Panel
                        uniqueIdentifier="confirmation-form-panel"
                        showHeader={false}
                    >
                        <this.form
                            formState={FormState.creating}
                            rows={this.rows}
                            initialValues={{ ...defaultImportProductRequest }}
                            onSubmit={this.onConfirmClick}
                            submitTitle={i18n.t('product:export-product.drawer.confirm')}
                            disableCheckDirty={true}
                            validate={validate}
                        />
                    </Panel>
                </div>
            </div >
        )
    }

    public componentWillUnmount() {
        this.props.clear();
    }

    private onConfirmClick = (formData: ExportProductRequest) => {
        const { items } = this.props;

        const request: ExportProductRequest = {
            Products: items.map(item => ({
                Id: item.Id,
                Name: item.Name,
                ConnectedMarketplaceId: item.ConnectedMarketplace && item.ConnectedMarketplace.Id
            })),
            Id: Guid.newGuid(),

            NotifyMeByEmail: formData.NotifyMeByEmail,
            Email: formData.Email
        };

        return this.props.exportProduct(
            { request },
            null,
            { func: 'ExportProduct' }
        );
    }
}

export {
    IStateProps,
    IDispatchProps,
    ExportMarketplaceConfirmationForm
};
