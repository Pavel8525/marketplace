import * as React from 'react';
import { ID } from 'app/common/helpers/string-helper';
import classNames from 'classnames';

interface IButtonProps {
    name?: string;
    form?: string;
    showName?: boolean;
    className?: string;
    title?: string;
    submitting?: boolean;
    disabled?: boolean;
    enabledWaves?: boolean;
    iconClassName?: string;
    dontSubmitButton?: boolean;

    buttonOnClick?: (() => void) | (() => Promise<{}>);
}

class Button extends React.PureComponent<IButtonProps> {
    private myRef = React.createRef<HTMLButtonElement>();
    private buttonId: string = 'Button' + ID();

    public render() {
        const {
            name,
            form,
            showName = true,
            title,
            className = "btn-primary",
            submitting,
            disabled,
            iconClassName,
            dontSubmitButton
        } = this.props;

        const iconStyle = showName && name ? { marginRight: '5px' } : null;
        const type = dontSubmitButton ? 'button' : 'submit';

        return (
            <>
                <button
                    id={this.buttonId}
                    ref={this.myRef}
                    type={type}
                    className={classNames("btn", className)}
                    title={title}
                    onClick={this.onClick}
                    disabled={disabled}
                    form={form}
                >

                    {submitting && (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={iconStyle} />
                    )}

                    {iconClassName && !submitting && (
                        <i className={iconClassName} style={iconStyle} />
                    )}

                    {showName && name}
                </button>
            </>
        );
    }

    public componentDidMount() {
        const { enabledWaves = true } = this.props;
        const waves = (window as any).Waves;
        if (enabledWaves && waves && this.myRef) {
            if (waves) {
                waves.attach('#' + this.buttonId);
                waves.init();
            }
        }
    }

    private onClick = () => {
        if (this.props.buttonOnClick) {
            this.props.buttonOnClick();
        }
    }
}

export { Button, IButtonProps };
