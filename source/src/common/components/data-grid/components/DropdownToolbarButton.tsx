import * as React from 'react';

import 'app/common/components/data-grid/styles/data-grid.css';

import { IToolbarItem } from './ToolbarItems';

class DropdownToolbarButton extends React.PureComponent<IToolbarItem> {
    btnGroup: React.RefObject<HTMLDivElement>;
    dropdownMenu: React.RefObject<HTMLDivElement>;

    constructor(props: IToolbarItem) {
        super(props);

        this.btnGroup = React.createRef();
        this.dropdownMenu = React.createRef();
    }

    render() {
        const { children, name } = this.props;

        return (
            <div className="btn-group" ref={this.btnGroup}>
                <button
                    className="btn btn-primary dropdown-toggle"
                    type="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    {name}
                </button>

                {children && (
                    <div className="dropdown-menu" ref={this.dropdownMenu}>
                        {React.Children.map(children, (column: JSX.Element, idx) => column &&
                            <a onClick={this.closeMenu}>
                                {React.cloneElement(column, { ref: idx })}
                            </a>)
                        }
                    </div>
                )}
            </div>
        );
    }

    private closeMenu = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        this.btnGroup.current.className = "btn-group";
        this.dropdownMenu.current.className = "dropdown-menu";
    }
}

export {
    DropdownToolbarButton
}