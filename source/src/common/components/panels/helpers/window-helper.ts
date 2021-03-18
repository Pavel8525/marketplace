import { ContainerHeightType } from "..";
import { headerHeight } from "app/common/constants";

interface IElementRect {
    left: number,
    top: number
}

const getElementOffset = (element: HTMLElement): IElementRect => {
    const rect = element.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

const getContentWindowHeight = (height: ContainerHeightType | number, heightOffset?: number, rect?: IElementRect) => {
    if (typeof height == 'number') {
        return `${height}px`;
    }

    switch (height) {
        case ContainerHeightType.All: {
            let header = headerHeight;

            if (heightOffset) {
                header += heightOffset;
            }

            const height = window.innerHeight - header;
            return height + 'px';
        }
        case ContainerHeightType.Auto: {
            const height = (window.innerHeight - (rect ? (rect.top + (heightOffset || 0) + 10) : 0));
            return height + 'px';
        }
        default: return null;
    }
}


export {
    IElementRect,
    getElementOffset,
    getContentWindowHeight
}