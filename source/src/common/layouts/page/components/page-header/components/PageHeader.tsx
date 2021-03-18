
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import classNames from 'classnames';

interface IProps {
    title: string;
    portalName?: string;
    description?: string;
    badgeTitle?: string;
    rightContent?: JSX.Element;
    iconClassName?: string;
}

class PageHeader extends React.PureComponent<IProps> {
    public render() {
        const {
            title,
            portalName = "portal-page-header",
            badgeTitle,
            description,
            rightContent,
            iconClassName
        } = this.props;
        const node = document.getElementById(portalName);

        if (!node) {
            return (<h1>{`NOT FOUND PORTAL DOM ELEMENT BY NAME ${portalName} (MAY BE NEED USED HOOK withTranslation IN PAGE)`}</h1>)
        };

        return ReactDOM.createPortal(
            <div className="subheader">
                <h1 className="subheader-title">
                    {iconClassName && (<><i className={classNames("fal text-primary", iconClassName)} />{" "}</>)}
                    {title}
                    {badgeTitle && (<sup className='badge badge-primary fw-500'>{badgeTitle}</sup>)}
                    {description && (<small>{description}</small>)}
                </h1>

                {rightContent && (
                    <div className="subheader-block">
                        {rightContent}
                    </div>
                )}
            </div>,
            node
        )
    }
}

export { PageHeader };