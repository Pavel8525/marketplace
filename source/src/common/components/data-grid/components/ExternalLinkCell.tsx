import * as React from 'react';
import { GridCellProps } from '@progress/kendo-react-grid';

type IOwnerProps = {
    path?: string;
    keyField: string;
    url?: string;
    target?: '_self' | '_blank';
}

type IProps = IOwnerProps & GridCellProps;

class ExternalLinkCell extends React.PureComponent<IProps> {
    private to: string;
    private title: string;

    constructor(props: IProps) {
        super(props);

        let { url } = this.props;
        const {
            field,
            keyField,
            dataItem
        } = this.props;

        this.title = dataItem[field];
        url = url || dataItem[keyField];

        this.to = url;
    }

    public render() {
        const { target = '_self' } = this.props;
        return (
            <td title={this.title}>
                {this.to ? <a href={this.to} target={target}>{this.title}</a> : this.title}
            </td>
        );
    }
}

export { ExternalLinkCell };