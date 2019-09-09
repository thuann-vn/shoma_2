import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Linking,
  Platform,
  StatusBar,
} from "react-native";

import { connect } from "react-redux";
import Colors from "../../constants/Colors";
import {
  AvenirFormattedMessage,
  AvenirText,
  RoundedButton,
	Icon
} from "../../components";
import { iOSColors } from "react-native-typography";
import Layout from "../../constants/Layout";
import { Languages, CONFIG } from "../../constants/Common";
import Screens from "../../constants/Screens";
import { settingsOperations } from "../../modules/settings";
import Images from "../../constants/Images";

class WizardLanguageScreen extends React.Component {
  static navigationOptions = () => {
    return {
      headerTransparent: true,
      headerTitle: ''
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      privacyModalVisible: false,
      language: this.props.settings.language
    };
  }

  _changeLanguage = item => {
    this.props.changeLanguage(item.code);
    this.setState({ language: item.code });
  };

  _continue = () => {
      this.setState({privacyModalVisible: false});
      setTimeout(()=>{
        this.props.navigation.navigate(Screens.Welcome);
      })
  };

  render() {
    return (
      <View style={styles.container}>
        { Platform.OS === "android" && (
          <StatusBar
              barStyle="dark-content"
              backgroundColor={Colors.bodyColor}
            />
        )}
        <View style={styles.titleContainer}>
          <View style={styles.imageContainer}>
            <Image
              resizeMode="contain"
              source={Images.wizardIntroImage}
              style={styles.image}
            />
          </View>

          <AvenirFormattedMessage
            style={styles.headerTitle}
            weight="demi"
            message="wizard_welcome"
          />
          <AvenirFormattedMessage
            style={styles.headerDescription}
            message="wizard_welcome_des"
          />

          <View style={styles.languageButtons}>
            {Languages.map(item => (
              <TouchableOpacity
                onPress={() => this._changeLanguage(item)}
                key={"language_" + item.code}
                style={[
                  styles.language,
                  item.code == this.state.language
                    ? styles.selectedLanguage
                    : null
                ]}
              >
                <Image style={styles.languageImage} source={item.image} />
                <AvenirText
                  style={[
                    styles.languageName,
                    item.code == this.state.language
                      ? styles.selectedLanguageName
                      : null
                  ]}
                  weight="demi"
                >
                  {item.name}
                </AvenirText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.roundedButton} onPress={()=>{this.setState({privacyModalVisible : true})}}>
          <AvenirFormattedMessage
            style={styles.roundedButtonLabel}
            weight="demi"
            message="common_continue"
          />
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          presentationStyle="overFullScreen"
          visible={this.state.privacyModalVisible}
          onRequestClose = {()=>{}}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContainerCenter}>
							<TouchableOpacity style={styles.modalClose} onPress={() => this.setState({privacyModalVisible : false})}>
								<Icon.SimpleLineIcons name="close" size={24} style={styles.modalCloseIcon}/>
							</TouchableOpacity>
              <Image source={Images.logoRounded} style={styles.logo} />
              <AvenirFormattedMessage
                weight="demi"
                style={styles.privacy_title}
                message="wizard_privacy_title"
              />
              <AvenirFormattedMessage
                style={styles.privacy_message}
                message="wizard_privacy_message"
              />
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(CONFIG.privacyPage);
                }}
              >
                <AvenirFormattedMessage
                  weight="demi"
                  style={styles.privacy_link}
                  message="wizard_privacy_link"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.privacy_agree_button}
                onPress={this._continue}
              >
                <AvenirFormattedMessage
                  weight="demi"
                  style={styles.privacy_agree_text}
                  message="wizard_privacy_agree"
                />
              </TouchableOpacity>

							<TouchableOpacity
								onPress={() => this.setState({privacyModalVisible : false})}
							>
								<AvenirFormattedMessage
									weight="demi"
									style={styles.privacy_dont_agree_text}
									message="wizard_privacy_dont_agree"
								/>
							</TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    settings: state.settings
  };
};
export default connect(
  mapStateToProps,
  settingsOperations
)(WizardLanguageScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: Layout.bottomOffsetWithoutNav,
    paddingHorizontal: 20
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 20
  },
  headerTitle: {
    fontSize: 32,
    textAlign: "center",
    color: Colors.textColor
  },
  headerDescription: {
    fontSize: 16,
    color: Colors.textGray,
    textAlign: "center"
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 20
  },
  headerTitle: {
    fontSize: 32,
    textAlign: "center",
    color: Colors.textColor
  },
  headerDescription: {
    fontSize: 16,
    color: Colors.textGray,
    textAlign: "center"
  },
  imageContainer: {
    padding: 0
  },
  image: {
    width: "100%",
    height: 300
  },
  languageButtons: {
    flexDirection: "row",
    padding: 10,
    marginTop: 20
  },
  language: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    alignContent: "center",
    borderRadius: 8,
    margin: 10
  },
  languageImage: {
    marginBottom: 5,
    width: 50,
    height: 50
  },
  selectedLanguage: {
    backgroundColor: iOSColors.tealBlue
  },
  selectedLanguageName: {
    color: "#fff"
  },
  roundedButton: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: Colors.mainColor,
    color: "#fff",
    marginBottom: 20,
    paddingTop: 15,
    paddingBottom: 15
  },
  roundedButtonLabel: {
    fontSize: 16,
    color: "#fff"
  },
  modalContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "rgba(0,0,0,.5)"
  },
  modalContainerCenter: {
    flex: 1,
    backgroundColor: "#fff",
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    margin: 15,
    borderRadius: 40,
    padding: 20
	},
	modalClose:{
		position: 'absolute',
		right: 20,
		top: 20,
	},
	modalCloseIcon:{
		color: Colors.textGray
	},
  privacy_title: {
    fontSize: 25,
    color: Colors.textGray,
    marginBottom: 10
  },
  privacy_subtitle: {
    fontSize: 18,
    marginBottom: 10
  },
  privacy_title: {
    fontSize: 25,
    color: Colors.textGray,
    marginBottom: 10
  },
  logo: {
    width: 56,
		height: 56,
		marginBottom: 20
  },
  privacy_message: {
    marginBottom: 10,
    fontSize: 16
  },
  privacy_link: {
    fontSize: 16,
    color: Colors.blue
  },
  wizard_privacy_agree: {
    color: "#fff"
  },
  privacy_agree_button: {
    marginTop: 40,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: Colors.mainColor,
    width: "100%"
  },
  privacy_agree_text: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center"
	},
	privacy_dont_agree_text:{
		color: Colors.mainColor,
		marginTop: 20,
		marginBottom: 10
	}
});
