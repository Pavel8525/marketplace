import * as React from 'react';
import i18n from 'i18next';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Button } from 'app/common/components';
import classNames from 'classnames';


interface IOwnProps {
    name: string;
    description: string;
    buttonTitle: string;
    buttonClassName?: string;
    helpUrl?: string;
    samplesUrl?: string;
    logoPath?: string;

    buttonOnClick?: () => void;
}
type IProps = IOwnProps & WithTranslation;

class Card extends React.PureComponent<IProps> {
    public render() {
        const {
            name,
            description,
            helpUrl,
            samplesUrl,
            logoPath,
            buttonTitle,
            buttonClassName,
            buttonOnClick
        } = this.props;

        return (
            <>
                <div className="card" style={{ maxWidth: '18rem' }}>
                    <span className="badge badge-primary" style={{ position: 'absolute', fontSize: '20px', margin: '5px' }}>{i18n.t("cases:card.badge-title")}</span>
                    {logoPath && (
                        <img src={logoPath} className="card-img-top" alt={name} />
                    )}

                    <div className="card-body">
                        <h5 className="card-title" style={{ fontWeight: "bold" }}>{name}</h5>
                        <p className="card-text">{description}</p>
                    </div>

                    <div className="card-footer" style={{ border: 'none' }}>
                        {helpUrl && (
                            <a href={helpUrl} className="card-link" target="blank">{i18n.t("cases:card.helpurl-title")}</a>
                        )}
                        {samplesUrl && (
                            <a href={samplesUrl} className="card-link" target="blank">{i18n.t("cases:card.samplesurl-title")}</a>
                        )}
                    </div>

                    <div className="card-footer align-items-center" style={{ border: 'none' }}>
                        <div className="mx-auto" style={{ maxWidth: '200px' }}>
                            <Button
                                name={buttonTitle}
                                buttonOnClick={buttonOnClick}
                                className={classNames("w-100 btn-primary", buttonClassName)}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const CardWithTranslation = withTranslation()(Card);
export { CardWithTranslation as Card };
