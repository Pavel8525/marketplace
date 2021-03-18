import * as React from 'react';

import { footerHeight } from 'app/common/constants';

import { VerticalScroll } from '../../scroll';
import { ContainerHeightType } from '..';
import { getContentWindowHeight, getElementOffset } from '../helpers/window-helper';

interface IProps {
    height?: ContainerHeightType | number;
    heightOffset?: number;
    useScrollbars?: boolean;
    autohideScroll?: boolean;
}

class FullHeightPanel extends React.PureComponent<IProps> {
    private ref = React.createRef<HTMLDivElement>();

    public render() {
        const {
            height = ContainerHeightType.All,
            heightOffset = footerHeight,
            useScrollbars = true,
            children,
            autohideScroll
        } = this.props;

        const calculateHeight = getContentWindowHeight(height, heightOffset, this.ref.current ? getElementOffset(this.ref.current) : null);
        const calculateHeightStyle = calculateHeight ? { height: calculateHeight } : null;

        return (
            <div
                style={calculateHeightStyle}
                className='full-height-panel'
                ref={this.ref}
            >
                {useScrollbars
                    ? (
                        <VerticalScroll
                            autoHide={autohideScroll}
                        >
                            {children}
                        </VerticalScroll>

                    ) : (
                        { children }
                    )}
            </div>
        )
    }

    public componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);
        this.forceUpdate();
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    private onWindowResize = () => this.forceUpdate();
}

export {
    FullHeightPanel
};
