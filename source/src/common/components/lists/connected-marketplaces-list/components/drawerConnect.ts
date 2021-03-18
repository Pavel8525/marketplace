import { connect } from 'react-redux'
import { cleanMarketplaceAccount, assignMarketplaceKind } from '../thunks';

const mapDispatchToProps = {
    cleanMarketplaceAccount,
    assignMarketplaceKind
}

export default connect(null, mapDispatchToProps)
