import React from 'react';

interface IProps {
    title: string;
}

class Dashboard extends React.Component<IProps> {
    public render() {
        const { title } = this.props;
        return (
            <div>
                <h2>{title}</h2>
            </div>
        );
    }
}

export { Dashboard };