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
  StatusBar,
} from "react-native";
import { Icon, AvenirFormattedMessage } from "../../components";

import Colors from "../../constants/Colors";
import Images from "../../constants/Images";
import Layout from "../../constants/Layout";
import Screens from "../../constants/Screens";
import * as firebase from "firebase";
import { iOSColors } from "react-native-typography";
import { connect } from 'react-redux';
import { settingsOperations } from "../../modules/settings";
import { withGlobalize } from 'react-native-globalize';
import { logToAmplitude } from "../../utils/logHelper";
import { LogEvents } from "../../constants/Common";

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      passwordConfirm: "",
    };
  }

  _onSignupPress = () => {
    if (!this.state.email || !this.state.password || !this.state.name) {
      Alert.alert(this.props.globalize.getMessageFormatter('common_input_invalid')());
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        (userCredentials) => {
          if (userCredentials.user){
            const userInfo = userCredentials.user;
            userInfo.displayName = this.state.name;
            
            //Update name for user
            userCredentials.user.updateProfile({ displayName: this.state.name }).then(() => {
              this.props.signIn(userInfo);
            }, error => {
              logToAmplitude(LogEvents.CreateAccountFailed, {error: error});
              console.log('Update profile error');
            });
          }
        },
        error => {
          logToAmplitude(LogEvents.CreateAccountFailed, {error: error});
          Alert.alert(error.message);
        }
      );
  };

  _onBackToLoginPress = () => {
    this.props.navigation.navigate(Screens.Welcome);
  };

  render() {
    return (
      <ImageBackground
        source={Images.welcomeBackground}
        resizeMode="stretch"
        style={styles.container}
      >
        <StatusBar translucent={true} />
        <KeyboardAvoidingView
          behavior={Layout.isIOS? 'padding': null}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.topContainer}>
              <View style={{...styles.descriptionContainer, marginTop: Layout.isIOS ? (Layout.isIphoneX ? 0 : -30) : -110}}>
                <Image source={Images.logoRounded} style={styles.logo} />
                <AvenirFormattedMessage
                  weight="demi"
                  style={styles.title}
                  message="auth_register_title"
                />
                <AvenirFormattedMessage
                  style={styles.description}
                  message="auth_register_des"
                />
              </View>

              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  value={this.state.name}
                  onChangeText={text => {
                    this.setState({ name: text });
                  }}
                  placeholder={this.props.globalize.getMessageFormatter(
                    "auth_profile_name"
                  )()}
                  keyboardType="default"
                  textContentType="name"
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.emailInput.focus();
                  }}
                />

                <View style={{ paddingTop: 10 }} />

                <TextInput
                  style={styles.input}
                  value={this.state.email}
                  onChangeText={text => {
                    this.setState({ email: text });
                  }}
                  placeholder={this.props.globalize.getMessageFormatter(
                    "auth_profile_email"
                  )()}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  ref={input => {
                    this.emailInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.passwordInput.focus();
                  }}
                />

                <View style={{ paddingTop: 10 }} />

                <TextInput
                  style={styles.input}
                  value={this.state.password}
                  onChangeText={text => {
                    this.setState({ password: text });
                  }}
                  placeholder={this.props.globalize.getMessageFormatter(
                    "auth_profile_password"
                  )()}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="go"
                  ref={input => {
                    this.passwordInput = input;
                  }}
                  onSubmitEditing={() => {
                    this._onSignupPress();
                  }}
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.roundedButton}
                onPress={this._onSignupPress}
              >
                <AvenirFormattedMessage
                  style={styles.roundedButtonLabel}
                  weight="demi"
                  message="common_signup"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backLoginButton}
                onPress={this._onBackToLoginPress}
              >
                <Icon.Ionicons
                  style={styles.backLoginButtonIcon}
                  size={18}
                  name="ios-arrow-back"
                />
                <AvenirFormattedMessage
                  weight="demi"
                  style={styles.backLoginButtonLabel}
                  message="common_back_to_login"
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
  }
};

const wrappedComponent = withGlobalize(connect(mapStateToProps, { ...settingsOperations })(SignupScreen));
//Set navigation options
wrappedComponent.navigationOptions = () => {
  return {
      headerTransparent: true,
      headerTintColor: '#fff',
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
    width: "100%",
    justifyContent: 'center',
  },
  descriptionContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
  },
  topContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center'
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
    marginTop: 0,
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
  roundedButtonLabel: {
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
  backLoginButton: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
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
