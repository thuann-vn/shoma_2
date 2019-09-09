import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';

import {connect} from 'react-redux';
import Colors from '../../constants/Colors';
import {AvenirFormattedMessage} from '../../components';
import Layout from '../../constants/Layout';
import {settingsOperations} from '../../modules/settings';
import LottieView from 'lottie-react-native';
import Screens from "../../constants/Screens";
import { HeaderBackButton } from 'react-navigation';

class WizardAccountScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        let { params } = navigation.state;
        return {
            headerTransparent: true,
            headerLeft: params && params.disableBack ? null : HeaderBackButton,
            gesturesEnabled: params && params.disableBack ? false : true,
        };
    };

    constructor(props) {
        super(props);

        if (this.props.accounts && this.props.accounts.list && Object.keys(this.props.accounts.list).length) {
            return this.props.navigation.navigate(Screens.Home);
        }

        this.state = {
            currentState: false,
        }
    }
    _addAccount = () => {
        this.props.navigation.navigate(Screens.AccountType, {isFirstLaunchWizard: true, callback: ()=>{
            this.props.setFirstLaunchFinish(true);
            this.props.navigation.navigate(Screens.Home);
        }});
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <View style={styles.logoContainer}>
                        <LottieView
                            source={require('../../assets/animations/money_saving.json')}
                            autoPlay
                            loop
                            style={styles.image}
                        />
                    </View>
                    <AvenirFormattedMessage weight="demi" style={styles.headerTitle} message="wizard_account_title"/>
                    <AvenirFormattedMessage style={styles.headerDescription} message="wizard_account_des"/>
                </View>
                <View style={styles.contentContainer}>
                    <TouchableOpacity style={styles.roundedButton} onPress={this._addAccount}>
                        <AvenirFormattedMessage style={styles.roundedButtonLabel} weight="demi" message="wizard_account_button" />
                    </TouchableOpacity> 
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        categories: state.categories,
        settings: state.settings
    }
};
export default connect(mapStateToProps, {...settingsOperations})(WizardAccountScreen);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: Layout.bottomOffsetWithoutNav
    },
    titleContainer: {
        flex: 1,
        width: '100%',
        justifyContent: "center",
        backgroundColor: '#fff',
        paddingVertical: 40,
        paddingHorizontal: 20
    },
    headerTitle: {
        fontSize: 36,
        textAlign: 'center',
        color: Colors.textColor,
        paddingHorizontal: 20
    },
    headerDescription: {
        fontSize: 16,
        color: Colors.textGray,
        textAlign: 'center',
        paddingHorizontal: 20
    },
    contentContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    image: {
        width: '100%',
        marginBottom: 30
    },
    buttons: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'space-between',
        justifyContent: 'space-between',
        marginTop: 40,
        marginBottom: 20,
    },
    label: {
        fontSize: 16
    },
    note: {
        color: Colors.textGray,
    },    
    roundedButton: {
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: Colors.mainColor,
        color: '#fff',
        marginBottom: 20,
        paddingTop: 15,
        paddingBottom: 15,
    },
    roundedButtonLabel: {
        fontSize: 16,
        color: '#fff'
    },
});

