
import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IProps {
    portalName: string;
}

class PanelHeaderPortal extends React.PureComponent<IProps> {
    public render() {
        const {
            portalName,
            children
        } = this.props;
        const node = document.getElementById(portalName);

        if (!node) {
            return (<h1>{`NOT FOUND PORTAL DOM ELEMENT BY NAME ${portalName} (MAY BE NEED USED HOOK withTranslation IN PAGE)`}</h1>)
        };

        return ReactDOM.createPortal(
            React.Children.map(children, (column: JSX.Element, idx) => column && React.cloneElement(column, { ref: idx })),
            node
        )
    }
}

export { PanelHeaderPortal };