import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  ScrollView,
  StatusBar} from "react-native";
import { AvenirFormattedMessage } from "../../components";

import Colors from "../../constants/Colors";
import Images from "../../constants/Images";
import Layout from "../../constants/Layout";
import Screens from "../../constants/Screens";
import * as firebase from "firebase";
import { iOSColors } from "react-native-typography";
import { connect } from 'react-redux';
import { settingsOperations } from "../../modules/settings";
import { withGlobalize } from 'react-native-globalize';
import { LogEvents } from "../../constants/Common";
import { logToAmplitude } from "../../utils/logHelper";
import { DeviceServices } from "../../services/devices";
import Constants from 'expo-constants';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  _onLoginPress = () => {
    if (!this.state.email || !this.state.password) {
      Alert.alert("Please enter your email and password.");
      return;
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        (response) => {
          //Update user devices
          DeviceServices.addOrUpdate({
            id: Constants.deviceId,
            lastLoginDate: new Date(),
          });
          
          //Set restore state
          this.props.setRestoreDataState(true);
          this.props.signIn(response.user);
          
          //Go to auth screen
          this.props.navigation.navigate(Screens.WizardRestore);

          //Log to amplitude
          logToAmplitude(LogEvents.Login);
        },
        error => {
          //Log to amplitude
          logToAmplitude(LogEvents.LoginFailed, {error: error});
          Alert.alert(error.message);
        }
      );
  };

  _onCreateAccountPress = () => {
    this.props.navigation.navigate(Screens.Register);
  };

  _onForgotPasswordPress = () => {
    this.props.navigation.navigate(Screens.ForgotPassword);
  };

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Layout.isIOS? 'padding': null}>
        {!Layout.isIOS && <StatusBar backgroundColor='#000' translucent={true}/>} 
        <ImageBackground source={Images.welcomeBackground} resizeMode="stretch" style={styles.container}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={{...styles.descriptionContainer, marginTop: Layout.isIOS ? 0 : -80}}>
              <Image source={Images.logoRounded} style={styles.logo} />

              <AvenirFormattedMessage weight="demi" style={styles.title} message="auth_login_title" />
              <AvenirFormattedMessage style={styles.description} message="auth_login_des" />
            </View>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                value={this.state.email}
                onChangeText={text => {
                  this.setState({ email: text });
                }}
                placeholder={this.props.globalize.getMessageFormatter('auth_profile_email')()}
                keyboardType="email-address"
                textContentType="username"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => { this.passwordInput.focus(); }}
              />

              <View style={{ paddingTop: 10 }} />

              <TextInput
                style={styles.input}
                value={this.state.password}
                onChangeText={text => {
                  this.setState({ password: text });
                }}
                placeholder={this.props.globalize.getMessageFormatter('auth_profile_password')()}
                secureTextEntry={true}
                textContentType="password"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="go"
                ref={input => { this.passwordInput = input }}
                onSubmitEditing={() => { this._onLoginPress(); }}
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style = {
                styles.roundedButton
              }
              onPress={this._onLoginPress}
            >
              <AvenirFormattedMessage style={styles.roundedButtonLabel} weight="demi" message="auth_login_button" />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={this._onForgotPasswordPress}
            >
              <AvenirFormattedMessage weight="demi" style={styles.forgotPasswordButtonLabel} message="auth_forgot_password" />              
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
  }
};

const wrappedComponent = withGlobalize(connect(mapStateToProps, { 
  ...settingsOperations,
})(LoginScreen));

//Set navigation options
wrappedComponent.navigationOptions = () => {
  return {
      headerTransparent: true,
      headerTintColor: '#fff'
  }
}

export default wrappedComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iOSColors.midGray,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: Layout.bottomOffsetWithoutNav,
    paddingHorizontal: 20
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: "center",
  },
  descriptionContainer:{
    alignItems: "center",
    justifyContent: "center",
    alignContent: 'center'
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10
  },
  title: {
    fontSize: 32,
    color: "#fff",
    textAlign: "center"
  },
  description: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center"
  },
  formContainer:{
    marginTop: 20,
    marginBottom: 20
  },
  input: {
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    backgroundColor: 'rgba(255,255,255, 1)',
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  buttonContainer: {
    width: "100%",
    // position: 'absolute'
  },
  button: {
    marginBottom: 5,
  },
  roundedButton: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: Colors.mainColor,
    color: '#fff',
    marginBottom: 5,
    paddingTop: 15,
    paddingBottom: 15,
  },
  roundedButtonLabel:{
    fontSize: 16,
    color: '#fff'
  },
  facebookButton: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: Colors.mainColor,
    marginBottom: 20,
    paddingTop: 18,
    paddingBottom: 15
  },
  facebookIcon: {
    color: "#fff",
    marginRight: 10
  },
  facebookLabel: {
    color: "#fff",
    fontSize: 16
  },
  forgotPasswordButton: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  forgotPasswordButtonLabel: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10
  },
  forgotPasswordButtonIcon: {
    color: '#fff'
  },
});
