import * as React from 'react';
import classNames from 'classnames';

import { any, mapIfAny } from 'app/common/helpers/array-helper';

import { IBreadcrumbItem } from '../contracts/IBreadcrumbItem';

interface IProps {
    items: IBreadcrumbItem[];
    selected: string | number;

    className?: string;
    onClick?: (item: IBreadcrumbItem) => void;
}

const WizardBreadcrumbs = (props: IProps) => {
    const { items, selected, className, onClick } = props;

    if (!any(items)) {
        return null;
    }

    return (
        <>
            <ol className={classNames("breadcrumb breadcrumb-arrow mb-0", className)}>
                {mapIfAny(items, (item, key) => (
                    <li
                        key={key}
                        className={classNames({ "active": item.value == selected, "can-be-selected": item.canBeSelected })}
                        onClick={() => onClick && onClick(item)}
                    >
                        <a href="#">
                            {item.iconClassName && (<i className={classNames("fal", item.iconClassName)} />)}
                            <span>{item.title}</span>
                        </a>
                    </li>
                ))}
            </ol>
        </>

    )
}

export { WizardBreadcrumbs };