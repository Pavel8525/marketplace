import React, { FC, ReactElement, useState, useRef, MutableRefObject } from 'react';
import ReactDOM from 'react-dom';
import { OverlayTrigger, Popover as BSPopover } from 'react-bootstrap';
import classNames from 'classnames';
import { addLineBreaks, createSequence } from 'app/common/helpers/string-helper';
import { Placement, PlacementPosition, IRenderTooltipProps } from './entities';
import { OverlayTriggerType } from 'react-bootstrap/esm/OverlayTrigger';
import { RawHtml } from "app/common/components";

const popoverIdSequence = createSequence("popover-id-");

const isString = (item: IRenderTooltipProps['content']): item is string => {
    return typeof item === 'string'
}

const renderContent = (content: IRenderTooltipProps['content']) => {
    if(isString(content)) {
        return RawHtml({ content: addLineBreaks(content) })
    }
    return content
}

const renderTooltip = ({ childrenRef, content, ...rest }: IRenderTooltipProps) => (
    <BSPopover id={popoverIdSequence()} {...rest}>
        <BSPopover.Content className="popover-wrapper-container">
            <span className="tooltip-wrapper-content" ref={childrenRef}>
                { renderContent(content) }
            </span>
        </BSPopover.Content>
    </BSPopover>
);

const renderWrapper = (children: ReactElement, className?: string, wrapperStyle?: object) => (
    <button
        disabled
        style={wrapperStyle}
        className={classNames("empty-wrapper-component", className)}
    >
        {children}
    </button>
)

interface IProps {
    children: ReactElement;
    useWrapper?: boolean;
    wrapperClassName?: string;
    placement?: Placement;
    disabled?: boolean;
    onEnter?: () => void;
    onEntered?: () => void;
    onExited?: () => void;
    trigger?: OverlayTriggerType[];
    content: IRenderTooltipProps['content'];
    wrapperStyle?: object;
}

export const Popover: FC<IProps> = ({
    children,
    useWrapper,
    wrapperClassName,
    placement = 'right',
    trigger = ['hover', 'focus'],
    onEnter,
    onExited,
    disabled,
    content = 'content content content content content content content content content content content content',
    wrapperStyle,
}) => {
    const [placementPosition, setPlacementPosition] = useState(placement);
    const tooltipRef = useRef<HTMLSpanElement>()

    const onEntered = () => {
        setPlacementPosition(placement)
        const newPlacementPosition = popoverPositioning(tooltipRef.current, placementPosition)
        setPlacementPosition(newPlacementPosition);
        if (onEnter) {
            onEnter()
        }
    }

    return (
        <OverlayTrigger
            delay={{ hide: 1000, show: 100 }}
            placement={placementPosition}
            trigger={disabled ? null : trigger}
            overlay={(props) => !disabled && renderTooltip({
                ...props,
                childrenRef: tooltipRef,
                content,
            })}
            onEntered={onEntered}
            onExited={onExited}
            onEnter={onEnter}
        >
            { useWrapper ? renderWrapper(children, wrapperClassName, wrapperStyle) : children }
        </OverlayTrigger>
    )
}

const popoverPositioning = (
    current: MutableRefObject<HTMLSpanElement>['current'],
    placement: Placement
): Placement => {
    const popover = ReactDOM.findDOMNode(current) as HTMLElement;
    const popoverRect = popover.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (placement === PlacementPosition.TOP || placement === PlacementPosition.BOTTOM) {
        if (placement === PlacementPosition.BOTTOM && popoverRect.bottom > viewportHeight) {
            return PlacementPosition.TOP;
        }
        if (placement === PlacementPosition.TOP && popoverRect.top < 0) {
            return PlacementPosition.BOTTOM;
        }
    }

    if (placement === PlacementPosition.LEFT || placement === PlacementPosition.RIGHT) {
        if (placement === PlacementPosition.RIGHT && popoverRect.right > viewportWidth) {
            return PlacementPosition.LEFT;
        } else if (placement === PlacementPosition.LEFT && popoverRect.left < 0) {
            return PlacementPosition.RIGHT;
        }
    }

    return placement;
}
