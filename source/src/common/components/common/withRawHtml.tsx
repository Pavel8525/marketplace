import DOMPurify from "dompurify";
import React from "react";

const rawMarkup = (content: string) => {
    const config = {
        ADD_TAGS: ["highlight"]
    };
    const html = content && DOMPurify.sanitize(content, config);

    return { __html: html };
};

interface IProps {
    html: string;
}

function withRawHtml<TElement, T extends React.DOMAttributes<TElement>>(WrappedComponent: React.ComponentType<T>) {
    return class WithRawHtml<TProps extends IProps> extends React.Component<TProps> {
        public render() {
            this.replaceLinksTarget();

            const { html, ...rest } = this.props as IProps;
            const dangerouslySetInnerHTML = rawMarkup(html);
            return (
                <WrappedComponent
                    {...rest as T}
                    dangerouslySetInnerHTML={dangerouslySetInnerHTML}
                />
            );
        }

        private replaceLinksTarget = () => {
            DOMPurify.addHook("afterSanitizeAttributes", (node: HTMLAnchorElement) => {
                if ("target" in node) {
                    node.setAttribute("target", "_blank");
                }
            });
        }
    };
}

export { withRawHtml };
