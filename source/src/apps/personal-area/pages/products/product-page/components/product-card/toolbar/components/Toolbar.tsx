import '../styles/toolbar.css';

import React from "react";
import { Toolbar as KendoToolbar } from '@progress/kendo-react-buttons';

import { IToolbarProps } from '../contracts';

class Toolbar extends React.Component<IToolbarProps, {}> {
    public render() {
        const { children } = this.props;

        return (
            <KendoToolbar>
                {children && (
                    React.Children.map(children, (button: JSX.Element, idx) =>
                        React.cloneElement(button, {
                            ref: idx,
                            id: idx
                        })
                    )
                )}

                {/*
                    <ToolbarSeparator />

                    <ToolbarItem>
                        <Button icon="copy" title="Copy">Copy</Button>
                    </ToolbarItem>
                    <ToolbarItem>
                        <DropDownButton text="Paste" icon="paste">
                            <DropDownButtonItem icon="text" text="Plain Text" />
                            <DropDownButtonItem icon="html" text="HTML" />
                        </DropDownButton>
                    </ToolbarItem>

                    <ToolbarSpacer />

                    <ToolbarItem>
                        <ButtonGroup>
                            <Button icon="bold" title="Bold" togglable={true} />
                            <Button icon="italic" title="Italic" togglable={true} />
                            <Button icon="underline" title="Underline" togglable={true} />
                        </ButtonGroup>
                    </ToolbarItem>
                    <ToolbarItem>
                        <ButtonGroup>
                            <Button icon="align-left" title="Align Left" togglable={true} />
                            <Button icon="align-center" title="Align Center" togglable={true} />
                            <Button icon="align-right" title="Align Right" togglable={true} />
                            <Button icon="align-justify" title="Align Justify" togglable={true} />
                        </ButtonGroup>
                    </ToolbarItem>
                */}
            </KendoToolbar>
        );
    }
}

export {
    Toolbar
};
