import * as React from 'react';
import { GridCellProps } from '@progress/kendo-react-grid';
import { Link } from 'react-router-dom';

type IOwnerProps = {
    path: string;
    keyField: string;
    url?: string;
    target?: '_self' | '_blank';
}

type IProps = IOwnerProps & GridCellProps;

class LinkCell extends React.PureComponent<IProps> {
    private to: string;
    private title: string;

    constructor(props: IProps) {
        super(props);

        const {
            path,
            keyField,
            dataItem,
            field,
            url
        } = this.props;
        
        const key = dataItem[keyField];
        if (field.indexOf('.') > -1) {
            const items = field.split('.');
            var reference = dataItem[items[0]];
            if (reference) {
                this.title = items.length > 1
                    ? dataItem[items[0]][items[1]]
                    : 'NOTHING';
            }
        } else{
            this.title = dataItem[field];
        }
        this.to = url || (this.title && path ? `/personal/${path.toLowerCase()}/${key}` : null);
    }

    public render() {
        const { target = '_self' } = this.props;
        return (
            <td title={this.title}>
                {this.to ? <Link to={this.to} target={target}>{this.title}</Link> : this.title}
            </td>
        );
    }
}

export { LinkCell };