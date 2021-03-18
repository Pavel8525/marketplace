import React, {FC, MutableRefObject, useEffect, useState} from 'react';
import { ShowBox } from 'app/common/components';
import { DrawerProps } from '@material-ui/core/Drawer';

const isLeftOrRightAnchor = (anchor: DrawerProps['anchor']): boolean => {
    return anchor === 'right' || anchor === 'left';
}

interface IProps {
    onClose(): void;
    anchor: DrawerProps['anchor'];
    parentRef: MutableRefObject<HTMLDivElement>;
    minWidth: number;
}

const CloseHandler: FC<IProps> = ({ anchor, onClose, parentRef, minWidth }) => {
    const [parentWidth, setParentWidth] = useState(minWidth);

    useEffect(() => {
        setParentWidth(parentRef.current.clientWidth);
    }, [parentRef])

    const horizontalOffset = parentWidth + 20;

    const styles = {
        right: { right: `${horizontalOffset}px` },
        left: { left: `${horizontalOffset}px` },
        bottom: {},
        top: {}
    }

    return (
        <ShowBox condition={isLeftOrRightAnchor(anchor)}>
            <button style={styles[anchor]} className="close-handler" type="button" onClick={onClose}>
                <i className="fal fa-times"/>
            </button>
        </ShowBox>
    )
}

export default CloseHandler;
