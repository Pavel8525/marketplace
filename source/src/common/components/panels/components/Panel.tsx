import * as React from 'react';
import classNames from 'classnames';
import { withTranslation, WithTranslation } from 'react-i18next';

import { DataGridLoader } from 'app/common/components';


interface IOwnProps {
    uniqueIdentifier: string;
    title?: string;
    description?: string;
    iconClassName?: string;
    hidePadding?: boolean;

    showHeader?: boolean;
    showIcon?: boolean;
    canCollapse?: boolean;
    canMaximize?: boolean;
    canClose?: boolean;

    fetching?: boolean;

    headerPortalId?: string;
}

type IProps = IOwnProps & WithTranslation;

class Panel extends React.PureComponent<IProps> {

    public render() {
        const {
            uniqueIdentifier,
            title,
            description,
            iconClassName = 'fa-cog',
            showHeader = true,
            showIcon = false,
            canCollapse = true,
            canMaximize = true,
            canClose = false,
            fetching = false,
            hidePadding = false,
            headerPortalId
        } = this.props;

        return (
            <div id={uniqueIdentifier} className="panel">
                {showHeader && (
                    <div className="panel-hdr">
                        <h2 id={headerPortalId}>
                            {showIcon && (
                                <>
                                    <span className="icon-stack fs-xxl mr-2">
                                        <i className="base base-7 icon-stack-3x opacity-100 color-primary-500"></i>
                                        <i className={classNames("fal icon-stack-1x opacity-100 color-white", iconClassName, { 'fa-spin': fetching })}></i>
                                    </span>
                                </>
                            )}

                            {title && (
                                <>
                                    {title}
                                    <span className="fw-300">
                                        <i>{description}</i>
                                    </span>
                                </>
                            )}
                        </h2>

                        <div className="panel-toolbar">
                            {canCollapse && (
                                <button className="btn btn-panel bg-transparent fs-xl w-auto h-auto rounded-0" data-action="panel-collapse" data-toggle="tooltip" data-offset="0,10" data-original-title="Collapse">
                                    <i className="fal fa-window-minimize" />
                                </button>
                            )}

                            {canMaximize && (
                                <button className="btn btn-panel bg-transparent fs-xl w-auto h-auto rounded-0" data-action="panel-fullscreen" data-toggle="tooltip" data-offset="0,10" data-original-title="Fullscreen">
                                    <i className="fal fa-expand" />
                                </button>
                            )}

                            {canClose && (
                                <button className="btn btn-panel bg-transparent fs-xl w-auto h-auto rounded-0" data-action="panel-close" data-toggle="tooltip" data-offset="0,10" data-original-title="Close">
                                    <i className="fal fa-times" />
                                </button>
                            )}

                        </div>
                    </div>
                )}

                <div className="panel-container show">
                    {fetching && <DataGridLoader />}

                    <div className="panel-content" style={{ padding: hidePadding ? 0 : '1rem 1rem' }}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

const PanelWithTranslation = withTranslation()(Panel);
export { PanelWithTranslation as Panel };