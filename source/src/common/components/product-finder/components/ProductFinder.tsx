import * as React from 'react';
import { MarketplaceKind } from 'app/common/core/api/proxy-ext';

import { ProductsSelector } from '../..';
import { ISelectorResult } from '../../entities-selector/contracts';
import { Bantikom } from 'app/common/core/api/proxy';


interface IStateProps {
}

interface IDispatchProps {
}

interface IOwnProps {
    searchKind: Bantikom.SearchKind;
    marketplaceKind: MarketplaceKind;
    exactMatchMarketplaceKind?: boolean;

    onSave: (result: ISelectorResult) => Promise<{}>;
    onSumbitSuccess: (response: {}) => void;
    onClose: () => void;
}

interface IState {
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class ProductFinder extends React.Component<IProps, IState> {
    static getDerivedStateFromProps(state: IState): IState {

        return {
            ...state
        }
    }

    constructor(props: IProps) {
        super(props);

        this.state = {
        }
    }

    public render() {
        const {
            marketplaceKind,
            searchKind,
            exactMatchMarketplaceKind = false
        } = this.props;

        const renderContent = () => {
            switch (searchKind) {
                case 'ProductCatalog': {

                    let filters: any[] = [{
                        MarketplaceKind: marketplaceKind,
                        IsVariation: { in: [null, false] }
                    }];

                    if (!exactMatchMarketplaceKind && marketplaceKind == 'Wildberries') {
                        filters = [
                            {
                                MarketplaceKind: { in: ['Wildberries', 'WildberriesFBS'] },
                                IsVariation: { in: [null, false] }
                            }
                        ]
                    }

                    return (
                        <ProductsSelector
                            id="product-finder-products-selector"
                            filters={filters}
                            selectKind="multiple"

                            onSave={this.productSelector_onSave}
                            onSumbitSuccess={this.productSelector_onSubmitSuccess}
                            onClose={this.productSelector_onClose}
                        />
                    );
                }

                case 'ProductGroup': {
                    return (<h1>FROM GROUP</h1>);
                }
                default: {
                    return (<h1>NOT IMPLEMENTED</h1>)
                }
            }
        }

        return renderContent();
    }

    productSelector_onClose = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    productSelector_onSubmitSuccess = (response: {}) => {
        if (this.props.onSumbitSuccess) {
            this.props.onSumbitSuccess(response);
        }
    }

    productSelector_onSave = (result: ISelectorResult): Promise<{}> => {
        const { searchKind, onSave } = this.props;
        const fixedResult: ISelectorResult = {
            ...result,
            tag: searchKind,
            items: result.items.map((item) => {
                switch (searchKind) {
                    case 'ProductGroup':
                    case 'ProductCatalog': {
                        return {
                            Id: (item as any).Id,
                            EntityName: 'Product'
                        }
                    }
                    default: return item;
                }
            })
        }

        if (onSave) {
            return onSave(fixedResult);
        }

        return new Promise<{}>((resolve) => resolve(fixedResult));
    }
}

export {
    IStateProps,
    IDispatchProps,
    ProductFinder
}
