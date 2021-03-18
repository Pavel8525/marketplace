import * as React from "react";
import ReactDOM from "react-dom";
import _ from "underscore";


import { IInfiniteBaseProps } from "../contracts";

export class InfiniteBase<TItem, TFilter> extends React.PureComponent<IInfiniteBaseProps<TItem, TFilter>> {
    private debouncedCheckScroll: () => void;
    private containerRef: React.ReactInstance;
    private scrollContainer: JQuery<Element | Text | Window>;
    private isDestroyed: boolean;

    constructor(props: IInfiniteBaseProps<TItem, TFilter>, context: any) {
        super(props, context);
        this.debouncedCheckScroll = _.debounce(() => this.checkScroll(), 500);
        this.isDestroyed = false;
    }

    public componentDidMount() {
        const {
            getScrollContainer
        } = this.props;

        this.scrollContainer = getScrollContainer && getScrollContainer() || $(".js-carousel-item.active");
        this.scrollContainer.on("resize scroll touchmove", this.debouncedCheckScroll);
        // tslint:disable-next-line:no-string-literal
        this.debouncedCheckScroll();
    }

    public render() {
        const {
            tagName,
            className,
            items,
            itemViewProps,
            ItemView
        } = this.props;

        const TagName = (tagName || "div") as React.ElementType;

        return (
            <TagName className={className} ref={this.setContainerRef}>
                {items && items.map((x, i) =>
                    <ItemView {...itemViewProps} data={x} index={i} items={items} key={i} />
                )}
            </TagName>
        );
    }

    public componentDidUpdate(prevProps: IInfiniteBaseProps<TItem, TFilter>) {
        const {
            items,
            onUpdated
        } = this.props;

        if (prevProps.items !== items) {
            this.debouncedCheckScroll();
        }

        if (onUpdated) {
            const containerWidth = $(ReactDOM.findDOMNode(this.containerRef) as Element).innerWidth();
            onUpdated({ containerWidth });
        }
    }

    public componentWillUnmount() {
        this.isDestroyed = true;
        if (this.scrollContainer) {
            this.scrollContainer.off("resize scroll", this.debouncedCheckScroll);
        }
    }

    private needNextPage() {
        const $items = $(ReactDOM.findDOMNode(this.containerRef) as Element);
        if (this.isDestroyed || $items.height == null) {
            return false;
        }

        let fullHeight = this.scrollContainer.height() + this.scrollContainer.scrollTop();
        if (this.scrollContainer.scrollTop() === 0) {
            const topOffset = $(".js-main-content").offset() ? Math.abs($(".js-main-content").offset().top) : 0;
            fullHeight = this.scrollContainer.height() + topOffset;
        }

        const contentHeight = $items.height();
        if (contentHeight === 0 && this.props.pageNo > 1) {
            return false;
        }

        return fullHeight > 0.8 * contentHeight;
    }

    private setContainerRef = (ref: React.ReactInstance) => {
        this.containerRef = ref;
    }

    private checkScroll() {
        const {
            fetching,

            filter,
            pageNo,
            pageSize,

            count,
            getNextPage
        } = this.props;

        if (fetching === false
            && count > (pageNo * pageSize)
            && this.needNextPage()) {
            getNextPage(filter, pageNo + 1, pageSize);
        }
    }
}
