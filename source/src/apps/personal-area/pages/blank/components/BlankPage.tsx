import * as React from 'react';
import i18n from 'i18next';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Bantikom } from 'app/common/core/api/proxy';
import { any } from 'app/common/helpers/array-helper';
import { IFetchState, Fetch } from 'app/common/core/data/reducers/fetch-reducer-factory';
import { IMultipleODataResponse, ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';

import { PageHeader } from 'app/common/layouts/page/components';
import { IEnvironmentSettings } from 'app/common/contracts';

interface IDispatchProps {
    fetchProducts: Fetch<{}>;
    fetchProduct: Fetch<{}>;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    products: IFetchState<IMultipleODataResponse<Bantikom.Product>>;
    product: IFetchState<ISingleODataResponse<Bantikom.Product>>;
}

const PageHeaderRightContent = () => (
    <div>Some right content</div>
);

type IProps = IStateProps & IDispatchProps & WithTranslation;

class BlankPage extends React.Component<IProps> {
    public render() {
        const { currentLanguage } = this.props.environmentSettings;
        const { products: researches, product: research } = this.props;

        return (
            <>
                <PageHeader
                    title={i18n.t("blank:title")}
                    portalName="portal-page-header"
                    description="some description"
                    badgeTitle="NEW"
                    rightContent={<PageHeaderRightContent />}
                />
                <h1>Current language: {currentLanguage}</h1>

                <h1>Функционал платформы</h1>
                <ul>
                    <li>Каталог товара</li>
                    <li>Общения с клиентом</li>
                    <li>Товараоборот</li>
                    <li>Обработка заказов</li>
                    <li>Аналитика продаж, конкурентов</li>
                    <li>Продвижения</li>
                    <li>Сертификация товара</li>
                    <li>Торговая марка</li>
                    <li>Поиск поставщика товара</li>
                </ul>

                {researches.fetching && <span>Loading</span>}
                {researches.failed && <span>Some error</span>}
                {researches.data && any(researches.data.items) && (
                    <ul>
                        {
                            researches.data.items.map((item, key) => (
                                <li key={key}>{item.Name}</li>
                            ))
                        }
                    </ul>

                )}
                {research.data && <h1>{research.data.item.Id}</h1>}
                <button onClick={this.fetch}>up</button>

                <div className="alert alert-primary">
                    <div className="d-flex flex-start w-100">
                        <div className="mr-2 hidden-md-down">
                            <span className="icon-stack icon-stack-lg">
                                <i className="base base-6 icon-stack-3x opacity-100 color-primary-500" />
                                <i className="base base-10 icon-stack-2x opacity-100 color-primary-300 fa-flip-vertical" />
                                <i className="ni ni-blog-read icon-stack-1x opacity-100 color-white" />
                            </span>
                        </div>
                        <div className="d-flex flex-fill">
                            <div className="flex-fill">
                                <span className="h5">About</span>
                                <p>Points.</p>
                                <p className="m-0">
                                    Find in-depth, guidelines, tutorials and more on Addon's <a href="#" target="_blank">Official Documentation</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-12">
                        <div id="panel-1" className="panel">
                            <div className="panel-hdr">
                                <h2>
                                    Panel <span className="fw-300"><i>Title</i></span>
                                </h2>
                                <div className="panel-toolbar">
                                    <button className="btn btn-panel" data-action="panel-collapse" data-toggle="tooltip" data-offset="0,10" data-original-title="Collapse" />
                                    <button className="btn btn-panel" data-action="panel-fullscreen" data-toggle="tooltip" data-offset="0,10" data-original-title="Fullscreen" />
                                    <button className="btn btn-panel" data-action="panel-close" data-toggle="tooltip" data-offset="0,10" data-original-title="Close" />
                                </div>
                            </div>
                            <div className="panel-container show">
                                <div className="panel-content">
                                    <div className="panel-tag">
                                        Panel tag <code>code</code>
                                    </div>
                                    Text
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    public componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        const multilpleRequest = { top: 10, skip: 0 };
        this.props.fetchProducts(multilpleRequest);
    }
}

const BlankPageWithTranslation = withTranslation()(BlankPage);

const BlankPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            products: state.odataService.ProductItems,
            product: state.odataService.ProductItem
        };
    },
    {
        fetchProducts: Bantikom.ProductService.getProductItems.fetch as Fetch<{}>,
        fetchProduct: Bantikom.ProductService.getProductItem.fetch as Fetch<{}>
    }
)(BlankPageWithTranslation);

export { BlankPageConnected as BlankPage };