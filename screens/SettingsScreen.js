import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Linking, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {categoriesOperations} from '../modules/categories';
import {getRateExchanges} from '../utils/rateExchangeHelper';
import {settingsOperations} from '../modules/settings';
import * as firebase from 'firebase';
import {AvenirText, UserProfile, Icon, DefaultPanel, AvenirFormattedMessage, CustomSwitch} from "../components";
import Images from "../constants/Images";
import Colors from "../constants/Colors";
import Screens from '../constants/Screens';
import { iOSColors } from 'react-native-typography';
import * as LocalAuthentication from 'expo-local-authentication';
import { PublisherBanner } from 'expo-ads-admob';
import Constants from 'expo-constants';
import Layout from '../constants/Layout';
import { CONFIG } from '../constants/Common';
import { AdModID } from '../constants/ApiKeys';
import Styles from '../constants/Styles';
import { customersOperations } from '../modules/customers';
import { productsOperations } from '../modules/products';
import { ordersOperations } from '../modules/orders';

class SettingsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: (
      <AvenirFormattedMessage
        style={Styles.headerTitleStyle}
        weight="demi"
        message="settings"
      />
    )
  };

  constructor(props) {
    super(props);
    let user = firebase.auth().currentUser;
    this.state = {
      profile: user,
      pinCodeEnabled: this.props.settings.pinCodeEnabled ||  false,
      fingerPrintEnabled: this.props.settings.fingerPrintEnabled ||  false,
    };
    this._checkHardware();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.settings.pinCodeEnabled != this.state.pinCodeEnabled){
      this.setState({
        pinCodeEnabled: nextProps.settings.pinCodeEnabled
      })
    }
  }

  //CHeck if support faceid or fingerprint
  _checkHardware = async ()=> {
    const checkResult = await LocalAuthentication.hasHardwareAsync();

    if(checkResult){
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if(supportedTypes && supportedTypes.length){
        // console.log(LocalAuthentication.AuthenticationType)
        // {
        //   "FACIAL_RECOGNITION": 2,
        //   "FINGERPRINT": 1,
        // }
        this.setState({
          supportType: supportedTypes[0],
        });
      }
    }
  };

  _updateExchangeRates = () => {
    if (!this.props.rateExchanges) {
      getRateExchanges('EUR', () => {
      })
    } else {
      this.setState({isReady: true});
    }
  }

  _signOut = async () => {
    await firebase.auth().signOut();
    this.props.signOut();
  }

  _pinCodeToggle = (value) =>{
    if(value){
      this.props.navigation.navigate(Screens.PinCodeSetting)
    }else{
      this.props.removePinCode();
      this.setState({pinCodeEnabled: false});
    }
  }

  _fingerPrintToggle = (value) =>{
    if(value){
      this.props.enableFingerPrint();
      this.setState({fingerPrintEnabled: true});
    }else{
      this.props.disableFingerPrint();
      this.setState({fingerPrintEnabled: false});
    }
  }

  _clearData = () =>{
    this.props.resetCategory();
    this.props.resetProduct();
    this.props.resetCustomer();
    this.props.resetOrder();
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.accountRow}
            onPress={() => {
              this.props.navigation.navigate(Screens.AccountSettingScreen);
            }}
          >
            <UserProfile avatarStyle={styles.accountAvatar} />
            <View style={styles.accountNameContainer}>
              <AvenirText weight={"demi"} style={styles.accountName}>
                {this.state.profile.displayName}
              </AvenirText>
              <AvenirText style={styles.accountEmail}>
                {this.state.profile.email}
              </AvenirText>
              <Icon.Ionicons
                style={styles.rowIndicator}
                name="ios-arrow-forward"
                size={18}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.settings}>
            <AvenirFormattedMessage
              style={styles.sectionTitle}
              weight={"demi"}
              message="settings_system"
            />
            <DefaultPanel notitle>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => {
                  this.props.navigation.navigate(Screens.CurrencySetting);
                }}
              >
                <View style={styles.settingRowContainer}>
                  <View
                    style={{
                      ...styles.iconContainer,
                      backgroundColor: iOSColors.blue
                    }}
                  >
                    <Icon.MaterialCommunityIcons
                      style={styles.icon}
                      name="currency-gbp"
                      size={20}
                    />
                  </View>
                  <AvenirFormattedMessage
                    weight={"demi"}
                    message="settings_currency_format"
                  />
                  <Icon.Ionicons
                    style={styles.rowIndicator}
                    name="ios-arrow-forward"
                    size={18}
                  />
                </View>
              </TouchableOpacity>

              {CONFIG.devMode && (
                <TouchableOpacity
                  style={styles.settingRow}
                  onPress={this._clearData}
                >
                  <View style={styles.settingRowContainer}>
                    <View
                      style={{
                        ...styles.iconContainer,
                        backgroundColor: iOSColors.red
                      }}
                    >
                      <Icon.MaterialIcons
                        style={styles.icon}
                        name="clear"
                        size={20}
                      />
                    </View>
                    <AvenirFormattedMessage
                      weight={"demi"}
                      message="settings_clearData"
                    />
                    <Icon.Ionicons
                      style={styles.rowIndicator}
                      name="ios-arrow-forward"
                      size={18}
                    />
                  </View>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => {
                  this.props.navigation.navigate(Screens.LanguageSetting);
                }}
              >
                <View style={styles.settingRowContainer}>
                  <View
                    style={{
                      ...styles.iconContainer,
                      backgroundColor: iOSColors.yellow
                    }}
                  >
                    <Icon.MaterialIcons
                      style={styles.icon}
                      name="language"
                      size={20}
                    />
                  </View>
                  <AvenirFormattedMessage
                    weight={"demi"}
                    message="settings_language"
                  />
                  <Icon.Ionicons
                    style={styles.rowIndicator}
                    name="ios-arrow-forward"
                    size={18}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => {
                  this.props.navigation.navigate(
                    Screens.NotificationSetting
                  );
                }}
              >
                <View style={styles.settingRowContainer}>
                  <View
                    style={{
                      ...styles.iconContainer,
                      backgroundColor: iOSColors.red
                    }}
                  >
                    <Icon.Entypo
                      style={styles.icon}
                      name="notification"
                      size={20}
                    />
                  </View>
                  <AvenirFormattedMessage
                    weight={"demi"}
                    message="settings_notification"
                  />
                  <Icon.Ionicons
                    style={styles.rowIndicator}
                    name="ios-arrow-forward"
                    size={18}
                  />
                </View>
              </TouchableOpacity>
              <View style={{ height: 20 }} />
              {/* SHOW ADS */}
              {CONFIG.showAds && (
                <PublisherBanner
                  bannerSize="smartBannerPortrait"
                  testDeviceID="EMULATOR"
                  adUnitID={AdModID.banner}
                />
              )}
            </DefaultPanel>

            <AvenirFormattedMessage
              style={styles.sectionTitle}
              weight={"demi"}
              message="settings_secure"
            />
            <DefaultPanel containerStyle={{ marginBottom: 40 }} notitle>
              <View style={[styles.settingRow, styles.settingRowFlex]}>
                <View style={styles.settingRowContainer}>
                  <View
                    style={{
                      ...styles.iconContainer,
                      backgroundColor: iOSColors.green
                    }}
                  >
                    <Icon.MaterialIcons
                      style={styles.icon}
                      name="lock"
                      size={20}
                    />
                  </View>
                  <AvenirFormattedMessage
                    weight={"demi"}
                    message="settings_pincode"
                  />
                </View>
                <CustomSwitch
                  value={this.state.pinCodeEnabled}
                  onValueChange={this._pinCodeToggle}
                />
              </View>

              {this.state.supportType && (
                <View style={[styles.settingRow, styles.settingRowFlex]}>
                  <View style={styles.settingRowContainer}>
                    <View
                      style={{
                        ...styles.iconContainer,
                        backgroundColor: iOSColors.purple
                      }}
                    >
                      {this.state.supportType ==
                      LocalAuthentication.AuthenticationType
                        .FACIAL_RECOGNITION ? (
                        <Image
                          source={Images.faceIdIcon}
                          style={{
                            width: 20,
                            height: 20,
                            tintColor: "#fff"
                          }}
                        />
                      ) : (
                        <Icon.MaterialCommunityIcons
                          style={styles.icon}
                          name={"fingerprint"}
                          size={20}
                        />
                      )}
                    </View>
                    <AvenirFormattedMessage
                      weight={"demi"}
                      message={
                        this.state.supportType ==
                        LocalAuthentication.AuthenticationType
                          .FACIAL_RECOGNITION
                          ? "settings_faceid_enable"
                          : "settings_fingerprint_enable"
                      }
                    />
                  </View>
                  <CustomSwitch
                    disabled={!this.state.pinCodeEnabled}
                    value={this.state.fingerPrintEnabled}
                    onValueChange={this._fingerPrintToggle}
                  />
                </View>
              )}
            </DefaultPanel>
            <View style={{ height: 20 }} />
            <AvenirFormattedMessage
              style={styles.sectionTitle}
              weight={"demi"}
              message="settings_about"
            />
            <DefaultPanel notitle>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => {
                  this.props.navigation.navigate(
                    Screens.TrackSettingScreen
                  );
                }}
              >
                <View style={styles.settingRowContainer}>
                  <View
                    style={{
                      ...styles.iconContainer,
                      backgroundColor: iOSColors.orange
                    }}
                  >
                    <Icon.MaterialCommunityIcons
                      style={styles.icon}
                      name="help-network"
                      size={20}
                    />
                  </View>
                  <AvenirFormattedMessage
                    weight={"demi"}
                    message="settings_tracking"
                  />
                  <Icon.Ionicons
                    style={styles.rowIndicator}
                    name="ios-arrow-forward"
                    size={18}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => {
                  Linking.openURL(CONFIG.homePage);
                }}
              >
                <View style={styles.settingRowContainer}>
                  <View
                    style={{
                      ...styles.iconContainer,
                      backgroundColor: iOSColors.purple
                    }}
                  >
                    <Icon.MaterialCommunityIcons
                      style={styles.icon}
                      name="contact-mail"
                      size={20}
                    />
                  </View>
                  <AvenirFormattedMessage
                    weight={"demi"}
                    message="settings_support"
                  />
                  <Icon.Ionicons
                    style={styles.rowIndicator}
                    name="ios-arrow-forward"
                    size={18}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => {
                  Linking.openURL(CONFIG.privacyPage);
                }}
              >
                <View style={styles.settingRowContainer}>
                  <View
                    style={{
                      ...styles.iconContainer,
                      backgroundColor: iOSColors.tealBlue
                    }}
                  >
                    <Icon.MaterialCommunityIcons
                      style={styles.icon}
                      name="information"
                      size={20}
                    />
                  </View>
                  <AvenirFormattedMessage
                    weight={"demi"}
                    message="settings_privacy"
                  />
                  <Icon.Ionicons
                    style={styles.rowIndicator}
                    name="ios-arrow-forward"
                    size={18}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingRow}>
                <View style={styles.settingRowContainer}>
                  <View
                    style={{
                      ...styles.iconContainer,
                      backgroundColor: iOSColors.gray
                    }}
                  >
                    <Icon.MaterialCommunityIcons
                      style={styles.icon}
                      name="apple-ios"
                      size={20}
                    />
                  </View>
                  <AvenirFormattedMessage
                    weight={"demi"}
                    message="settings_version"
                  />
                  <AvenirText style={styles.rowIndicator}>
                    {Constants.manifest.version}
                  </AvenirText>
                </View>
              </TouchableOpacity>
            </DefaultPanel>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    categories: state.categories,
    settings: state.settings,
    rateExchanges: state.rateExchanges
  }
};
export default connect(mapStateToProps, {...categoriesOperations, ...settingsOperations, ...customersOperations, ...productsOperations, ...ordersOperations})(SettingsScreen);

const styles = StyleSheet.create({
  container:{
    paddingBottom: Layout.bottomOffset
  },
  accountAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32
  },
  accountRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  accountNameContainer:{
    paddingLeft: 10,
    paddingRight: 15,
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center'
  },
  accountName:{
    fontSize: 20
  },
  settings:{
    backgroundColor: Colors.backgroundColor,
    paddingTop: 30,
  },
  settingRow: {
    backgroundColor: '#fff', 
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  settingRowFlex:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  settingRowContainer:{
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  iconContainer:{
    width: 30,
    height: 30,
    borderRadius: 8,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon:{
    color: '#fff'
  },
  rowIndicator:{
    position: 'absolute',
    right: 10,
    color: Colors.textGray
  },
  sectionTitle:{
    fontSize: 13,
    paddingLeft: 15,
    textTransform: 'uppercase',
    color: Colors.textGray
  }
});