import React, { FC, ReactNode, useRef } from 'react';
import MaterialDrawer, { DrawerProps } from '@material-ui/core/Drawer';
import CloseHandler from './components/CloseHandler';
import Header from './components/Header';
import Main from './components/Main';
import './styles.css'

interface IProps {
    headerComponent: ReactNode;
    mainComponent: ReactNode;
    anchor?: DrawerProps['anchor'];
    isOpen: boolean;
    onClose(): void;
    minWidth?: number;
    minHeight?: number;
}

const Drawer: FC<IProps> = (props) => {
    const drawerRef = useRef<HTMLDivElement>();
    const { anchor, isOpen, onClose, headerComponent, mainComponent, minWidth, minHeight } = props;

    return (
        <MaterialDrawer anchor={anchor} open={isOpen} onClose={onClose}>
            <div className="drawer-wrapper" style={{ minWidth, minHeight }} ref={drawerRef}>
                <CloseHandler minWidth={minWidth} parentRef={drawerRef} onClose={onClose} anchor={anchor}/>
                <Header>
                    { headerComponent }
                </Header>
                <Main>
                    { mainComponent }
                </Main>
            </div>
        </MaterialDrawer>
    )
}

Drawer.defaultProps = {
    anchor: 'right',
    minWidth: 300,
    minHeight: 300,
}

export { Drawer }
