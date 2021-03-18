import {MutableRefObject, ReactNode} from "react";

export type Placement = 'top' | 'right' | 'bottom' | 'left'

export enum PlacementPosition {
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM= 'bottom',
    LEFT = 'left'
}

export interface IRenderTooltipProps {
    childrenRef: MutableRefObject<HTMLSpanElement>;
    content: string | ReactNode;
}
