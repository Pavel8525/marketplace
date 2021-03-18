import * as React from 'react';
import classNames from 'classnames';

interface IOwnProps {
    title: string;
    subTitle?: string;

    srcImage?: string;
    selected?: boolean;
    id?: number;
    children?: React.ReactNode;
    onSelect?: (id: number) => void;
}

type ITabProps = IOwnProps;

class Tab extends React.PureComponent<ITabProps> {

    public render() {
        const {
            selected,
            srcImage,
            title,
            id,
            subTitle
        } = this.props;
        const href = `#tab-${id}`;

        return (
            <li className="nav-item" onClick={this.onSelect}>
                <a className={classNames("nav-link", { active: selected })} data-toggle="tab" href={href} role="tab" aria-selected={selected}>
                    {srcImage && (
                        <>
                            <img src={srcImage} title={title} style={{ height: '32px', width: '32px' }} />
                            &nbsp;
                        </>
                    )}

                    <span>
                        {title}

                        {subTitle && (
                            <>
                                <br />
                                <span style={{ fontSize: '10px' }}>{subTitle}</span>
                            </>)}
                    </span>
                </a>
            </li >
        );
    }

    private onSelect = () => {
        if (this.props.onSelect) {
            this.props.onSelect(this.props.id);
        }
    }
}

export { Tab, ITabProps };