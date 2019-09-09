import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    Alert,
    StatusBar
} from 'react-native';
import * as Facebook from 'expo-facebook';
import { RoundedButton, Icon, AvenirFormattedMessage } from '../components';
import Colors from '../constants/Colors';

import { connect } from 'react-redux';
import Images from '../constants/Images';
import Layout from '../constants/Layout';
import Screens from '../constants/Screens';
import * as firebase from 'firebase';
import { FBAppID } from '../constants/ApiKeys';
import { settingsOperations } from '../modules/settings';
import { categoriesOperations } from '../modules/categories';
import { restoreData } from '../utils/backupHelper';
import { logToAmplitude } from '../utils/logHelper';
import { LogEvents } from '../constants/Common';
import { DeviceServices } from '../services/devices';
import Constants from 'expo-constants';

class WelcomeScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    _facebookLogin = async ()=>{
        const { type, token } = await Facebook.logInWithReadPermissionsAsync(
            FBAppID,
            { 
                permissions: ['public_profile', 'email']
            }
        );

        //Log to amplitude
        logToAmplitude(LogEvents.LoginWithFacebook, {type, token}, this.props.settings.trackingEnabled);

        if (type === 'success') {
            // Build Firebase credential with the Facebook access token.
            const credential = firebase.auth.FacebookAuthProvider.credential(token);

            // Sign in with credential from the Facebook user.
            firebase.auth().signInAndRetrieveDataWithCredential(credential).then((response) => {
                //Update user devices
                DeviceServices.addOrUpdate({
                    id: Constants.deviceId,
                    lastLoginDate: new Date(),
                });

                this.props.setRestoreDataState(true);
                this.props.signIn(response.user);

                //Go to Restore screen
                this.props.navigation.navigate(Screens.WizardRestore);
            }).catch((error) => {
                Alert.alert(error.message); 
            });
        }else{
            Alert.alert('Login with Facebook failed, please try again!'); 
        }
    }

    render() {
        return (
            <ImageBackground source={Images.welcomeBackground} resizeMode="stretch" style={styles.container}>
                {!Layout.isIOS && <StatusBar barStyle="light-content" backgroundColor='#000' translucent={true}/>} 
                <View style={styles.contentContainer}>
                    <Image source={Images.logoRounded} style={styles.logo}/>
                    <AvenirFormattedMessage weight="demi" style={styles.title} message="wizard_intro_title"/>
                    <AvenirFormattedMessage style={styles.description} message="wizard_intro_des" />
                </View>

                <View style={styles.buttonContainer}>
                    <RoundedButton style={styles.button} backgroundColor="#fff" textColor={Colors.mainColor} onPress={()=> this.props.navigation.navigate(Screens.Login)}>
                        <AvenirFormattedMessage weight="demi" message="common_login"/>
                    </RoundedButton>
                    <TouchableOpacity style={styles.facebookButton} onPress={this._facebookLogin}>
                        <Icon.Ionicons style={styles.facebookIcon} size={24} name="logo-facebook" />
                        <AvenirFormattedMessage style={styles.facebookLabel} weight="demi" message="common_login_with_facebook" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginButton} onPress={() => this.props.navigation.navigate(Screens.Register)}>
                        <AvenirFormattedMessage weight="demi" style={styles.loginButtonLabel} message="common_create_account" />
                        <Icon.Ionicons style={styles.loginButtonIcon} size={18} name="ios-arrow-forward" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
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


const wrappedComponent = connect(mapStateToProps, {
    ...categoriesOperations,
    ...settingsOperations,
})(WelcomeScreen);

//Set navigation options
wrappedComponent.navigationOptions = () => {
  return {
      headerTransparent: true,
      headerTintColor: '#fff',
      headerTitle: ''
  }
}
export default wrappedComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bodyColor,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: Layout.bottomOffsetWithoutNav,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo:{
        width: 100,
        height: 100,
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        color: '#fff',
        textAlign:'center'
    },
    description: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center'
    },
    buttonContainer:{
        width: '100%',
        marginTop: 0,
        paddingHorizontal: 20,
        // position: 'absolute'
    },
    button:{
        width: '100%',
        marginBottom: 5,
        backgroundColor: '#fff'
    },
    facebookButton:{
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: Colors.mainColor,
        marginBottom: 20,
        paddingTop: 18,
        paddingBottom: 15,
    },
    facebookIcon: {
        color: '#fff',
        marginRight: 10
    },
    facebookLabel: {
        color: '#fff',
        fontSize: 16
    },
    loginButton:{
        flexDirection: 'row',
        alignContent:'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    loginButtonLabel: {
        color: '#fff',
        fontSize: 16,
        marginRight: 10,
    },
    loginButtonIcon:{
        color: '#fff',
    },
});
