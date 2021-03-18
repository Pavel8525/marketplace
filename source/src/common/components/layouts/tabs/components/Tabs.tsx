import '../styles/tabs.css';

import * as React from 'react';
import * as PropTypes from 'prop-types';

import { withTranslation, WithTranslation } from 'react-i18next';
import { Tab } from '..';


interface IOwnProps {
    selected: number;
    children: PropTypes.ReactNodeLike;

    rightNode?: React.ReactNode;

    onSelect?: (id: number) => void;
}

type IProps = IOwnProps & WithTranslation;

class Tabs extends React.PureComponent<IProps> {

    public render() {
        const {
            selected,
            children,
            rightNode
        } = this.props;

        const selectedTab = (children as Tab[])[selected];
        const body = selectedTab && selectedTab.props && selectedTab.props.children || null;

        return (
            <>
                <ul className="nav nav-tabs nav-tabs-clean" role="tablist" style={{ marginBottom: '5px' }}>
                    {
                        React.Children.map(children, (tab: JSX.Element, idx) =>
                            React.cloneElement(tab, {
                                ref: idx,
                                id: idx,
                                selected: idx == selected,
                                onSelect: this.onSelect
                            })
                        )
                    }

                    {rightNode && (
                        <li className="nav-item">
                            {rightNode}
                        </li>
                    )}
                </ul>

                {body &&
                    (
                        <div className="tab-pane">
                            {body}
                        </div>
                    )
                }
            </>
        );
    }

    private onSelect = (id: number) => {
        if (this.props.onSelect) {
            this.props.onSelect(id);
        }
    }

}

const TabsWithTranslation = withTranslation()(Tabs);
export { TabsWithTranslation as Tabs };