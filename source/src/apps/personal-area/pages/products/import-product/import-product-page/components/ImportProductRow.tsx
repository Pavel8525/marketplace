import * as React from "react";
import i18n from "app/common/core/translation/i18n";

import { Bantikom } from "app/common/core/api/proxy";
import {
    FormState,
    autoformFactory,
    IFormRow,
    FieldType,
    IField,
    FormColumnLayout,
    FieldControl
} from "app/common/components";
import { any } from "app/common/helpers/array-helper";

type SearchImportedProduct = Bantikom.SearchImportedProduct;

interface IOwnProps {
    item: SearchImportedProduct;
    onChange: (item: SearchImportedProduct) => void;
}

const IMPORT_PRODUCT_ROW_FORM = 'IMPORT_PRODUCT_ROW_FORM';

const getFormRows = (): IFormRow[] => {
    const rows = [
        {
            fields: [
                {
                    name: 'IncludeInImport',
                    label: i18n.t('product:import-product.search.row.include-button'),
                    type: FieldType.boolean,
                    control: FieldControl.switch
                } as IField
            ],
            columntLayout: FormColumnLayout.trio
        },
    ];

    return rows;
}

type IProps = IOwnProps;

class ImportProductRow extends React.Component<IProps> {
    private form: any;
    private rows: IFormRow[];

    constructor(props: IOwnProps) {
        super(props);

        this.form = autoformFactory({
            formName: `${IMPORT_PRODUCT_ROW_FORM}_${props.item.Id}`
        }).getForm();
        this.rows = getFormRows();
    }

    public render() {
        const { item } = this.props;

        return (
            <>
                <li className="list-group-item py-1 px-1">
                    <this.form
                        formState={FormState.creating}
                        initialValues={{ ...item }}
                        submitTitle={i18n.t('product:import-product.search.row.add-button')}
                        rows={this.rows}
                        showSubmitButton={false}
                        onChange={this.onChange}
                    >
                        {item.Name && (<h2 className="fs-lg fw-500">{item.Name}</h2>)}

                        <div className="mt-2">
                            {item.ExternalVendorCode && (
                                <>
                                    <span className="text-muted">{i18n.t('product:import-product.search.row.external-vendor-code')}</span>
                                    {" "}
                                    <b>{item.ExternalVendorCode}</b>
                                </>
                            )}
                            <br />

                            {item.InternalVendorCode && (
                                <>
                                    <span className="text-muted">{i18n.t('product:import-product.search.row.internal-vendor-code')}</span>
                                    {" "}
                                    <b>{item.InternalVendorCode}</b>
                                </>
                            )}
                            <br />

                            {any(item.Images) && (
                                <span className="fs-sm d-flex align-items-center mt-3">
                                    {item.Images.map((url, key) => (
                                        <a key={key} className="mr-2 mt-1">
                                            <span
                                                className="d-block img-share"
                                                style={{ backgroundImage: "url('" + url + "')", backgroundSize: "cover", height: "96px", maxWidth: "76px", border: '2px solid #cb11ab' }}
                                            />
                                        </a>
                                    ))}
                                </span>
                            )}
                        </div>
                    </this.form>
                </li>
            </>
        )
    }

    private onChange = (item: SearchImportedProduct) =>
        this.props.onChange(item);

}

export {
    ImportProductRow
};
