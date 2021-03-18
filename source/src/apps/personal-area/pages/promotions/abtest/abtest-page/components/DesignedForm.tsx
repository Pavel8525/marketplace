import * as React from 'react';
import * as toastr from 'toastr';
import i18n from 'i18next';
import { getFormNames, isDirty, isInvalid } from 'redux-form';

import { PageHeader } from 'app/common/layouts/page/components';
import { IEnvironmentSettings } from 'app/common/contracts';
import { IFetchState, Invoke, InvokeSpecificUrl, IOperationState } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { AbTest, AbTestVariation } from 'app/common/core/api/proxy-ext';
import { autoformFactory, Button, Panel } from 'app/common/components';
import { mapIfAny } from 'app/common/helpers/array-helper';

import { VariationForm } from '../containers/VariationForm';

const MaxCountVariations = 5;

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    state: any;
    itemState: IFetchState<ISingleODataResponse<AbTest>>;
    createAbTestVariationState: IOperationState<ISingleODataResponse<AbTestVariation>>;
}

interface IDispatchProps {
    saveItem: InvokeSpecificUrl<{}, {}>;
    updateLocallyItem: (data: any) => void;

    createAbTestVariation: Invoke<{}, {}>;
    publish: InvokeSpecificUrl<{}, {}>;
}

interface IState {
    variations: AbTestVariation[];
}

interface IOwnProps {
    item: AbTest;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class DesignedForm extends React.Component<IProps, IState> {
    private publishForm: any;

    constructor(props: IProps) {
        super(props);

        this.state = {
            variations: [...this.props.item.Variations]
        };

        this.publishForm = autoformFactory({
            formName: 'ABTEST_EDIT_FORM'
        }).getForm();
    }

    public render() {
        const { createAbTestVariationState, item } = this.props;
        const { variations } = this.state;
        const maxCountCreated = variations.length >= MaxCountVariations;
        const disableAddNewVariation = maxCountCreated || createAbTestVariationState.performing;

        return (
            <>
                <PageHeader
                    title={i18n.t("abtest:designed.title")}
                    portalName="portal-page-header"
                    iconClassName="fa-cubes"
                />

                <div className="row">
                    <div className="col-xl-12">
                        <Panel
                            uniqueIdentifier="abtest-designed-form"
                            showHeader={false}
                        >
                            {mapIfAny(variations, (item, index) => (
                                <VariationForm
                                    key={index}
                                    title={item.Name}
                                    initItem={item}
                                />
                            ))}

                            {!maxCountCreated && (
                                <>
                                    <h3>
                                        {i18n.t("abtest:designed.variation.must-be-max-countr-variations-1", { count: MaxCountVariations })}
                                    </h3>
                                    <Button
                                        name={i18n.t("abtest:designed.variation.add-new-variation")}
                                        buttonOnClick={this.addNewVariation}
                                        disabled={disableAddNewVariation}
                                    />
                                </>
                            )}

                            {maxCountCreated && (
                                <h3>
                                    {i18n.t("abtest:designed.variation.must-be-max-countr-variations-2", { count: MaxCountVariations })}
                                </h3>
                            )}

                            <hr />

                            <this.publishForm
                                onSubmit={this.publish}
                                initialValues={{ ...item }}
                                submitTitle={i18n.t("abtest:designed.variation.publish")}
                                renderRows={false}
                                disableCheckDirty={true}
                                cancelButtonTitle={i18n.t("abtest:designed.variation.save-and-publish-later")}
                                showCancelButton={true}
                                onClickCancelButton={this.saveAndPublishLater}
                            />

                        </Panel>
                    </div>
                </div>
            </>
        )
    }

    public componentDidMount() {
    }

    public componentWillUnmount() {
    }

    private addNewVariation = () => {
        const { item } = this.props;

        const newVariation: Partial<AbTestVariation> = {
            AbTestId: item.Id,
            Name: item.Name
        };

        const promise = this.props.createAbTestVariation(newVariation).then((response: any) => {
            this.setState(() => ({
                variations: [...this.state.variations, response.data]
            }))
        });
        return promise;
    }

    private checkIsBad = (): boolean => {
        const { state } = this.props;
        const names = getFormNames()(state);
        let hasDirty = false;
        let hasInvalid = false;
        names.forEach(name => {
            if (!name.startsWith('VARIATION_FORM_FOR')) {
                return;
            }
            const dirty = isDirty(name)(state);
            const invalid = isInvalid(name)(state);

            if (dirty) {
                hasDirty = true;
            }

            if (invalid) {
                hasInvalid = true;
            }
        });

        return hasDirty || hasInvalid;
    }

    private publish = (formData: AbTest) => {
        const { variations } = this.state;

        if (variations.length < 2) {
            toastr.error(i18n.t('abtest:designed.validation.variation-less-2'));
            return;
        }

        if (this.checkIsBad()) {
            toastr.error(i18n.t('abtest:designed.validation.need-save-variation'));
            return;
        }

        const promise = this.props.publish(
            null,
            this.props.item.Id,
            { func: 'Publish' }
        );
        return promise;
    }

    private saveAndPublishLater = () => {
        const { variations } = this.state;

        if (variations.length < 2) {
            toastr.error(i18n.t('abtest:designed.validation.variation-less-2'));
            return;
        }

        if (this.checkIsBad()) {
            toastr.error(i18n.t('abtest:designed.validation.need-save-variation'));
            return;
        }
    }
}

export { IDispatchProps, IStateProps, DesignedForm };