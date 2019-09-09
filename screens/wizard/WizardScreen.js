import React from 'react';
import {
    StyleSheet,
    Alert
} from 'react-native';

import { connect } from 'react-redux';
import { accountsOperations } from '../../modules/accounts';
import WelcomeWizard from '../../components/welcome';

class WizardScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <WelcomeWizard onDone={() => { this.setState({ showWelcomeWizard: false }) }} />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        categories: state.categories,
        accounts: state.accounts,
        settings: state.settings,
        transactions: state.transactions
    }
};
export default connect(mapStateToProps, accountsOperations)(WizardScreen);


