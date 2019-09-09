import React from 'react';
import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';

import {connect} from 'react-redux';
import Colors from '../../constants/Colors';
import {AvenirFormattedMessage, AvenirText, CustomSwitch, RoundedButton} from '../../components';
import {iOSColors} from 'react-native-typography';
import Layout from '../../constants/Layout';
import Images from '../../constants/Images';
import {settingsOperations} from '../../modules/settings';
import Screens from "../../constants/Screens";

class WizardBackupScreen extends React.Component {
    static navigationOptions = () => {
        return {
            headerTransparent: false,
            headerStyle: {
                backgroundColor: '#fff',
                borderBottomWidth: 0,
            }
        };
    };
    
    constructor(props) {
        super(props);

        this.state = {
            currentState: true, 
        }
    }

    _toggleBackup = (value) => {
        this.setState({ currentState: value });
        this.props.backupToggle(value);
    }

    _continue = () => {
        if (this.props.accounts && this.props.accounts.list && Object.keys(this.props.accounts.list).length) {
             this.props.setFirstLaunchFinish(true);
        }else{
            this.props.navigation.navigate(Screens.WizardAccount);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <View style={styles.logoContainer}>
                        <Image source={Images.logoRounded} style={styles.logo}/>
                        <View style={styles.notificationContainer}>
                            <AvenirText style={styles.notificationNumber}>cloud</AvenirText>
                        </View>
                    </View>
                    <AvenirFormattedMessage weight="demi" style={styles.headerTitle} message="settings_backup_title"/>
                    <AvenirFormattedMessage style={styles.headerDescription} message="settings_backup_description"/>

                    <View style={styles.buttons}>
                        <AvenirFormattedMessage weight="demi" style={styles.label} message="settings_backup_title"/>
                        <CustomSwitch value={this.state.currentState} onValueChange={(value) => { this._toggleBackup(value) }}/>
                    </View>
                    <AvenirFormattedMessage style={styles.note} message="settings_backup_note"/>
                </View>
                <View style={styles.contentContainer}>
                    <TouchableOpacity style={styles.roundedButton} onPress={this._continue}>
                        <AvenirFormattedMessage style={styles.roundedButtonLabel} weight="demi" message="common_continue" />
                    </TouchableOpacity> 
                </View>
            </View>
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
export default connect(mapStateToProps, settingsOperations)(WizardBackupScreen);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: Layout.bottomOffsetWithoutNav
    },
    titleContainer: {
        flex:1,
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
    logoContainer:{
        position: 'relative',
        width: 100,
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 20
    },
    notificationContainer:{
        position: 'absolute',
        right: -25,
        top: -15,
        backgroundColor: iOSColors.red,
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 15,
        alignItems: 'center',
        alignContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    notificationNumber:{
        color: '#fff',
        fontSize: 16
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
    label:{
        fontSize: 16
    },
    note:{
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

