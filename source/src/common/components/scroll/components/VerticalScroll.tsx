import "../styles/scroll.less";

import classNames from "classnames";
import * as React from "react";
import Scrollbars, { positionValues } from "react-custom-scrollbars";


const Cursor = ({ style, props }: any) => <div {...props} className="sp-scroll__thumb-vertical" style={{ ...style }} />;
const TrackVertical = ({ style, props }: any) => <div {...props} className="sp-scroll__track-vertical" style={{ ...style }} />;

interface IProps {
    scrollTop?: number;
    className?: string;
    autoHide?: boolean;
}

export class VerticalScroll extends React.PureComponent<IProps> {

    private _ref: Scrollbars;

    public render(): JSX.Element {
        const {
            children,
            className,
            autoHide = true
        } = this.props;
        
        return (
            <Scrollbars
                className={classNames("sp-scroll", className)}
                renderThumbVertical={Cursor}
                renderTrackVertical={TrackVertical}
                autoHide={autoHide}
                autoHideTimeout={400}
                ref={this.setRef}
            >
                {children}
            </Scrollbars>
        );
    }

    public scrollTop = (top?: number) => {
        if (isNaN(parseFloat(`${top}`))) {
            return this._ref.getScrollTop();
        }
        this._ref.scrollTop(top);
    }

    public getClientHeight = () => this._ref.getClientHeight();

    public getScrollHeight = () => this._ref.getScrollHeight();

    public getPositionValues = () => this._ref.getValues();

    public componentDidMount() {
        this.scrollTop(this.props.scrollTop);
    }

    public componentDidUpdate(prevProps: IProps) {
        if (prevProps.scrollTop !== this.props.scrollTop) {
            this.scrollTop(this.props.scrollTop);
        }
    }

    private setRef = (ref: Scrollbars) => {
        this._ref = ref;
    }
}
