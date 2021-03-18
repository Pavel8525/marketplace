import React from "react";

import { withRawHtml } from "./withRawHtml";

const SpanWithRawHtml = withRawHtml((props: React.HTMLAttributes<HTMLElement>) => <span {...props} />);
const PreWithRawHtml = withRawHtml((props: React.HTMLAttributes<HTMLElement>) => <pre {...props} />);

const RawHtml = ({ content, className }: { content: string; className?: string }) => (
    <SpanWithRawHtml html={content} className={className} />
);

const RawHtmlPre = ({ content, className }: { content: string; className?: string }) => (
    <PreWithRawHtml html={content} className={className} />
);

export { RawHtml, RawHtmlPre };
