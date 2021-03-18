import * as React from 'react';
import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';

import { any } from 'app/common/helpers/array-helper';
import i18n from 'app/common/core/translation/i18n';

const SKIP_ITEMS: string[] = [
    '/',
    '/personal',
    '/personal/managers',
    '/personal/development',
    '/personal/development/agents'
];

interface IProps {
    skipItems?: string[];
    currentTitle?: string;
}

const Breadcrumb = (props?: IProps) => {
    const location = useLocation();
    const { skipItems = [...SKIP_ITEMS, ...props.skipItems || []], currentTitle } = props;

    let paths = location.pathname.split('/').map((p, i, arr) => {
        const active = (i === arr.length - 1);
        const path = arr.slice(0, i + 1).join("/") || '/';
        const localizationPart = `routes.${path}`;
        const localizationPath = `breadcrumb:${localizationPart}`;
        const localization = i18n.t(localizationPath);
        const localizationFound = localization !== localizationPart;
        const title = active && currentTitle
            ? currentTitle
            : localizationFound ? localization : p;

        // Root
        //
        if (i === 0) return {
            key: i,
            content: (<Link to={'/'}>{title}</Link>),
            active,
            link: (i < arr.length - 1),
            to: '/'
        };

        // Current
        //
        if (i === arr.length - 1) return {
            key: i,
            content: (<span title={`${title} ${p}`.trim()}>{title || p}</span>),
            active
        };

        return {
            key: i,
            to: `${arr.slice(0, i + 1).join('/')}`,
            content: (
                <Link to={`${arr.slice(0, i + 1).join('/')}`}>{title}</Link>
            ),
            active,
            link: (i < arr.length - 1)
        }
    });

    if (any(skipItems)) {
        paths = paths.filter(p => !skipItems.find(s => s === p.to));
    }

    if (paths.length === 1) {
        return null;
    }

    return (
        <>
            {any(paths) && (
                <ol className="breadcrumb page-breadcrumb">
                    {paths.map((path: any, key: number) =>
                        <li key={key} className={classNames("breadcrumb-item", { "active": path.active })}>{path.content}</li>
                    )}
                </ol>
            )}
        </>
    )
}

export { Breadcrumb };