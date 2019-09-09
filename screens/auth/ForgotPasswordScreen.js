import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground
} from "react-native";
import { Icon, AvenirFormattedMessage } from "../../components";

import Colors from "../../constants/Colors";
import Images from "../../constants/Images";
import Layout from "../../constants/Layout";
import Screens from "../../constants/Screens";
import * as firebase from "firebase";
import { iOSColors } from "react-native-typography";
import { LogEvents } from "../../constants/Common";
import { logToAmplitude } from "../../utils/logHelper";

export default class ForgotPasswordScreen extends React.Component {
  static navigationOptions = () => {
      return {
          headerTransparent: true,
          headerTintColor: '#fff',
      }
  };

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      passwordConfirm: ""
    };
  }

  _onResetPasswordPress = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(
        () => {
          Alert.alert("Password reset email has been sent.");
        },
        error => {
          Alert.alert(error.message);
          logToAmplitude(LogEvents.ForgetPasswordFailed, {error: error});
        }
      );
  };

  _onBackToLoginPress = () => {
    this.props.navigation.navigate(Screens.Login);
  };

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <ImageBackground source={Images.welcomeBackground} resizeMode="stretch" style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.descriptionContainer}>
              <Image source={Images.logoRounded} style={styles.logo} />
              
              <AvenirFormattedMessage weight="demi" style={styles.title} message="auth_forgot_password_title" />
              <AvenirFormattedMessage style={styles.description} message="auth_forgot_password_des" />
            </View>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                value={this.state.email}
                onChangeText={text => {
                  this.setState({ email: text });
                }}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style = {
                styles.roundedButton
              }
              onPress={this._onResetPasswordPress}
            >
              <AvenirFormattedMessage style={styles.roundedButtonLabel} weight="demi" message="auth_forgot_password_button" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backLoginButton}
              onPress={this._onBackToLoginPress}
            >
              <Icon.Ionicons style={styles.backLoginButtonIcon} size={18} name="ios-arrow-back" />

              <AvenirFormattedMessage weight="demi" style={styles.backLoginButtonLabel} message="common_back_to_login" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

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
    width: "100%",
    justifyContent: "center"
  },
  descriptionContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
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
  formContainer: {
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
    marginTop: 0
    // position: 'absolute'
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
  button: {
    marginBottom: 5,
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
  backLoginButton: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10
  },
  backLoginButtonLabel: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10
  },
  backLoginButtonIcon: {
    color: '#fff'
  }
});
