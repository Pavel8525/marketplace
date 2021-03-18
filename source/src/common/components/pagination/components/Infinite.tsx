import * as React from "react";

import {
    ErrorLoading,
    Loading
} from "../../loaders";

import { InfiniteBase } from "./InfiniteBase";

interface IProps<TItem, TFilter> {
    fetching: boolean;
    failed?: boolean;
    filter: TFilter;
    pageNo: number;
    pageSize: number;
    items: TItem[];
    count: number;
    className?: string;
    itemViewProps?: {};
    ItemView: any;
    tagName?: string;
    EmptyPage(): JSX.Element;

    getNextPage(filter: TFilter, pageNo: number, pageSize: number): void;
    getScrollContainer?(): JQuery<Element | Text | Window>;
}

export class Infinite<TItem, TFilter> extends React.PureComponent<IProps<TItem, TFilter>> {
    public render() {
        const {
            fetching,
            failed,
            filter,
            pageNo,
            pageSize,
            items,
            count,
            className,
            getNextPage,
            getScrollContainer,
            EmptyPage,
            ItemView,
            itemViewProps,
            tagName
        } = this.props;

        if (failed) {
            return <ErrorLoading />;
        }
        const noData = items && items.length === 0;
        const showLoading = (fetching && ((pageNo * pageSize) < count || !count));
        const showEmptyPage = !fetching && noData && EmptyPage != null;

        return (
            <div>
                <InfiniteBase
                    fetching={fetching}
                    filter={filter}
                    pageNo={pageNo}
                    pageSize={pageSize}
                    items={items}
                    className={className}
                    count={count}
                    getNextPage={getNextPage}
                    getScrollContainer={getScrollContainer}
                    ItemView={ItemView}
                    itemViewProps={itemViewProps}
                    tagName={tagName}
                />

                {showLoading && <Loading />}

                {showEmptyPage && <EmptyPage />}
            </div>
        );
    }
}
