import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { ImagePicker, Facebook } from 'expo';
import * as Permissions from 'expo-permissions';

import { connect } from 'react-redux';
import Colors from '../../constants/Colors';
import { AvenirFormattedMessage, AvenirText, Icon, UserProfile, DefaultPanel } from '../../components';
import { iOSColors } from 'react-native-typography';
import Layout from '../../constants/Layout';
import { settingsOperations } from '../../modules/settings';
import Screens from "../../constants/Screens";
import * as firebase from 'firebase';
import { withGlobalize } from 'react-native-globalize';
import { FBAppID } from '../../constants/ApiKeys';
import { getBlob } from '../../utils/blobHelper';
import { formatMessage } from '../../utils/format';
import { rateExchangeOperations } from '../../modules/rateExchanges';
import { LogEvents } from '../../constants/Common';
import { logToAmplitude } from '../../utils/logHelper';
import { dateFormat } from '../../utils/dateHelper';
import Styles from '../../constants/Styles';

class AccountSettingScreen extends React.Component {

  constructor(props) {
    super(props);

    let user = firebase.auth().currentUser;
    this.state = {
      profile: user,
      ...this._isFacebookLinked(user)
    }
  }

  _formatMessage = (message, params)=>{
    return formatMessage(this.props.globalize, message, params);
  }

  _isFacebookLinked = (user)=>{
    const { providerData } = user;
    let isEmailPassword = false;
    let isFacebookLinked = false;
    if (providerData.length){
      providerData.map((provider)=>{
        switch (provider.providerId){
          case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
            isFacebookLinked = true;
            break;
          case firebase.auth.EmailAuthProvider.PROVIDER_ID:
            isEmailPassword = true;
            break;
        }
      })
    }
    return {
      isEmailPassword: isEmailPassword,
      isFacebookLinked: isFacebookLinked
    }
  }

  _linkWithFacebook = async () => {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      FBAppID,
      {
        permissions: ['public_profile', 'email', 'user_photos'],
        behavior: ''
      }
    );

    if (type === 'success') {
      // Build Firebase credential with the Facebook access token.
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      // Sign in with credential from the Facebook user.
      firebase.auth().currentUser.linkWithCredential(credential).then(() => {
        Alert.alert(this._formatMessage('account_settings_link_facebook_success'));
      }).catch((error) => {
        Alert.alert(error.message);
      });
    } else {
      Alert.alert(this._formatMessage('account_settings_link_facebook_failed'));
    }
  }

  _confirmPassword = (user)=>{
    Alert.prompt(
      this._formatMessage('account_settings_new_password'),//Enter new password
      this._formatMessage('account_settings_new_password_message'),//'Enter your new password to continue',
      [
        {
          text: this._formatMessage('common_cancel'),
          style: 'cancel',
        },
        {
          text: this._formatMessage('common_ok'),
          onPress: (password) => {
            user.updatePassword(password).then(() => {
              Alert.alert(this._formatMessage('account_settings_change_password_successfully'));
            }).catch((error) => { console.log(error); });
          },
        },
      ], 
      'secure-text'
    );
  }

  _reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

  _changePassword = (errors)=>{
    Alert.prompt(
      errors ? this._formatMessage('account_settings_invalid_password') : this._formatMessage('account_settings_change_password'), 
      errors ? this._formatMessage('account_settings_invalid_password_message') : this._formatMessage('account_settings_change_password_message'), 
      [
        {
          text: this._formatMessage('common_cancel'),
          style: 'cancel',
        },
        {
          text: this._formatMessage('account_settings_change_password_button'),
          onPress: (password) => {
            this._reauthenticate(password).then(() => {
              var user = firebase.auth().currentUser;
              this._confirmPassword(user);
            }).catch(() => { 
              this._changePassword(true);
            });
          },
        },
      ], 
      'secure-text'
    );
  }

  _updateEmail = ()=>{
    Alert.prompt(
      this._formatMessage('account_settings_change_email_title'),//Change email
      this._formatMessage('account_settings_change_email_message'),//'Enter your new email to continue:',
      [
        {
          text: this._formatMessage('common_cancel'),
          style: 'cancel',
        },
        {
          text: this._formatMessage('account_settings_change_email_button'),
          onPress: (email) => {
            Alert.prompt(
              this._formatMessage('account_settings_current_password'),
              this._formatMessage('account_settings_current_password_message'),
              [
                {
                  text: this._formatMessage('common_cancel'),
                  style: 'cancel',
                },
                {
                  text: this._formatMessage('common_continue'),
                  onPress: (password) => {
                    this._reauthenticate(password).then(() => {
                      var user = firebase.auth().currentUser;
                      user.updateEmail(email).then(() => {
                        Alert.alert(this._formatMessage('account_settings_change_email_successfully'));
                        this.setState({
                          profile: user
                        })
                      }).catch((error) => {
                        Alert.alert(error.message);
                      });
                    }).catch((error) => {
                      Alert.alert(error.message);
                    });
                  },
                },
              ],
              'secure-text'
            );
          },
        },
      ],
      'plain-text',
      this.state.profile.email
    );
  }

  _updateName = () => {
    Alert.prompt(
      this._formatMessage('account_settings_change_name_title'),//Change profile name
      this._formatMessage('account_settings_change_name_message'),//'Enter your name to continue:',
      [
        {
          text: this._formatMessage('common_cancel'),
          style: 'cancel',
        },
        {
          text: this._formatMessage('account_settings_change_name_button'),
          onPress: (name) => {
            var user = firebase.auth().currentUser;
            user.updateProfile({ displayName: name }).then(() => {
              Alert.alert(this._formatMessage('account_settings_change_name_successfully'));
              this.setState({
                profile: user
              })
            }).catch((error) => {
              Alert.alert(error.message);
            });
          },
        },
      ],
      'plain-text',
      this.state.profile.displayName || ''
    );
  }

  _logOut = async () => {
    Alert.alert(
      this._formatMessage('account_settings_signout_title'),//Sign out?
      this._formatMessage('account_settings_signout_message', {date: dateFormat(this.props.settings.lastBackupTime, 'llll', this.props.settings.language)}),//'Your data will be lost if your log out and not backup yet?',
      [
        {
          text: this._formatMessage('common_cancel'),
          style: 'cancel',
        },
        {
          text: this._formatMessage('common_ok'),
          style: 'destructive',
          onPress: async () =>{
            logToAmplitude(LogEvents.Logout, null, this.props.settings.tracking);
            this._clearDataAndLogout();
          },
        },
      ],
    );
  }

  _clearDataAndLogout = async () => {
    //Remove data
    this.props.resetSettings();

    //Signout
    this.props.signOut();
    await firebase.auth().signOut();

    //Go to auth
    this.props.navigation.navigate('Auth');
  }

  _updateAvatar = async ()=>{
    let image = null;
    let isGranted = true;
    let permissionName = Permissions.CAMERA_ROLL;

    const permission = await Permissions.getAsync(permissionName);
    if (permission.status !== 'granted') {
      isGranted = false;
      const newPermission = await Permissions.askAsync(permissionName);
      if (newPermission.status === 'granted') {
        isGranted = true;
      }
    }

    if (isGranted) {
      image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        width: 400,
        height: 400,
      });
      if (image && image.cancelled == false) {
        this.setState({ uploading: true });
        const blob = await getBlob(image.uri);

        var ref = firebase.storage().ref().child("images").child('profile').child( this.state.profile.uid + '_' + new Date().getTime() + '.jpeg');
        const snapshot = await ref.put(blob, { contentType: 'image/jpeg' });

        if(snapshot.state == 'success'){
          const url = await ref.getDownloadURL();
          await firebase.auth().currentUser.updateProfile({ photoURL: url });

          var profile = this.state.profile;
          profile.photoURL = url;
          this.setState({ profile: profile, uploading: false});
          Alert.alert(this._formatMessage('account_settings_change_avatar_successfully'));
        }else{
          Alert.alert(this._formatMessage('account_settings_change_avatar_failed'));
        }
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.accountRow} onPress={() => { this.props.navigation.navigate(Screens.Profile) }}>
        <View style={styles.avatarContainer}>
          <UserProfile editMode={true} avatarStyle={styles.accountAvatar} user={this.state.profile} onPress={() => this._updateAvatar()} />
        </View>
          <View style={styles.accountNameContainer}>
            <AvenirText weight={"demi"} style={styles.accountName}>{this.state.profile.displayName}</AvenirText>
            <AvenirText style={styles.accountEmail}>{this.state.profile.email}</AvenirText>
          </View>
        </View>

        <View style={styles.settings}>
          <AvenirFormattedMessage style={styles.sectionTitle} weight={"demi"} message="account_settings_details" />
          <DefaultPanel containerStyle={{ marginBottom: 40 }} notitle>
            {
              this.state.isEmailPassword && (
                <TouchableOpacity style={styles.settingRow} onPress={() => {
                  this._updateAvatar()
                }}>
                  <View style={styles.settingRowContainer}>
                    <View style={{ ...styles.iconContainer, backgroundColor: iOSColors.blue }}>
                      <Icon.MaterialCommunityIcons style={styles.icon} name="camera-image" size={20} />
                    </View>
                    <View style={[styles.settingRowContentContainer, this.state.isEmailPassword ? styles.settingRowHasArrow : null]}>
                      <AvenirFormattedMessage weight={"demi"} message="account_settings_avatar" />
                    </View>
                    <Icon.Ionicons style={styles.rowIndicator} name="ios-arrow-forward" size={18} />
                  </View>
                </TouchableOpacity>
              )
            }
              
            <TouchableOpacity style={styles.settingRow} onPress={() => {
              this._updateName()
            }}>
              <View style={styles.settingRowContainer}>
                <View style={{ ...styles.iconContainer, backgroundColor: iOSColors.blue }}>
                  <Icon.MaterialCommunityIcons style={styles.icon} name="account" size={20} />
                </View>
                <View style={[styles.settingRowContentContainer, this.state.isEmailPassword ? styles.settingRowHasArrow : null]}>
                  <AvenirFormattedMessage weight={"demi"} message="account_settings_name" />
                  <AvenirText style={styles.rowValue}>{this.state.profile.displayName}</AvenirText>
                </View>
                {
                  this.state.isEmailPassword && (<Icon.Ionicons style={styles.rowIndicator} name="ios-arrow-forward" size={18} />)
                }
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingRow} onPress={() => {
              this._updateEmail()
            }}>
              <View style={styles.settingRowContainer}>
                <View style={{ ...styles.iconContainer, backgroundColor: iOSColors.blue }}>
                  <Icon.MaterialCommunityIcons style={styles.icon} name="email" size={20} />
                </View>
                <View style={[styles.settingRowContentContainer, this.state.isEmailPassword ? styles.settingRowHasArrow: null]}>
                  <AvenirFormattedMessage weight={"demi"} message="account_settings_email" />
                  <AvenirText style={styles.rowValue}>{this.state.profile.email}</AvenirText>
                </View>
                {
                  this.state.isEmailPassword && (<Icon.Ionicons style={styles.rowIndicator} name="ios-arrow-forward" size={18} />)
                }
              </View>
            </TouchableOpacity>

            {
              this.state.isEmailPassword && (
                <TouchableOpacity style={styles.settingRow} onPress={() => { this._changePassword(false) }}>
                  <View style={styles.settingRowContainer}>
                    <View style={{ ...styles.iconContainer, backgroundColor: iOSColors.blue }}>
                      <Icon.Octicons style={styles.icon} name="key" size={20} />
                    </View>
                    <View style={[styles.settingRowContentContainer, styles.settingRowHasArrow]}>
                      <AvenirFormattedMessage weight={"demi"} message="account_settings_password" />
                      <AvenirText style={styles.rowValue}>••••••••</AvenirText>
                    </View>
                    <Icon.Ionicons style={styles.rowIndicator} name="ios-arrow-forward" size={18} />
                  </View>
                </TouchableOpacity>
              )
            }
          </DefaultPanel>
          <DefaultPanel notitle>
            <TouchableOpacity style={styles.settingRow} onPress={() => { this._linkWithFacebook() }}>
              <View style={styles.settingRowContainer}>
                <View style={{ ...styles.iconContainer, backgroundColor: '#3b5998'}}>
                  <Icon.MaterialCommunityIcons style={styles.icon} name="facebook" size={20} />
                </View>
                <AvenirFormattedMessage style={{color: this.state.isFacebookLinked? Colors.textGray: Colors.textColor}} weight={"demi"} message={this.state.isFacebookLinked ? 'account_settings_facebook_linked' : 'account_settings_facebook_link'} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingRow} onPress={this._logOut}>
              <View style={styles.settingRowContainer}>
                <View style={{ ...styles.iconContainer, backgroundColor: iOSColors.red }}>
                  <Icon.MaterialCommunityIcons style={styles.icon} name="logout" size={20} />
                </View>
                <AvenirFormattedMessage weight={"demi"} message="account_settings_logout" />
              </View>
            </TouchableOpacity>
          </DefaultPanel>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
    rateExchanges: state.rateExchanges,
  }
};

const wrappedComponent = withGlobalize(connect(mapStateToProps, {
  ...rateExchangeOperations, 
  ...settingsOperations, 
})(AccountSettingScreen));

//Navigation options
wrappedComponent.navigationOptions = () => {
  return {
    headerTitle: (<AvenirFormattedMessage style={Styles.headerTitleStyle} weight="demi" message="account_settings" />)
  };
};

//Export
export default wrappedComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: Layout.bottomOffsetWithoutNav
  },
  accountRow: {
    paddingVertical: 10,
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  accountNameContainer: {
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 10
  },
  accountName: {
    fontSize: 20,
    textAlign: 'center'
  },
  accountEmail:{
    textAlign: 'center'
  },
  accountAvatar:{
    width: 80,
    height: 80,
    borderRadius: 40
  },
  settings: {
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
  settingRowFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  settingRowContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  settingRowContentContainer:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  settingRowHasArrow:{
    paddingRight: 40,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon: {
    color: '#fff'
  },
  rowIndicator: {
    position: 'absolute',
    right: 10,
    color: Colors.textGray
  },
  rowValue:{
    color: Colors.textGray,
    textAlign: 'right'
  },
  sectionTitle: {
    fontSize: 13,
    paddingLeft: 15,
    textTransform: 'uppercase',
    color: Colors.textGray
  }
});

