import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Notifications} from 'expo';
import * as Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import {connect} from 'react-redux';
import Colors from '../../constants/Colors';
import {AvenirFormattedMessage, AvenirText, CustomSwitch} from '../../components';
import {iOSColors} from 'react-native-typography';
import Layout from '../../constants/Layout';
import Images from '../../constants/Images';
import {settingsOperations} from '../../modules/settings';
import Styles from "../../constants/Styles";
import { insertOrUpdateNotificationToken } from '../../utils/firebaseHelper';
import * as firebase from 'firebase';
import { configureDailyNotification, cancelNotification, getNotificationToken } from '../../utils/notificationHelper';
import { withGlobalize } from 'react-native-globalize';
import { formatMessage } from '../../utils/format';

class NotificationSettingScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentState: false, 
        }

        this._checkState();
    }

    _checkState = async () => {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        this.setState({ currentState: existingStatus == 'granted' })
    }

    _toggleNotification = async (value) => {
        this.setState({ currentState: value });

        if (value == true){
            const { status: existingStatus } = await Permissions.getAsync(
                Permissions.NOTIFICATIONS
            );
            let finalStatus = existingStatus;

            // Alert.alert('Status:' ,finalStatus);
            // only ask if permissions have not already been determined, because
            // iOS won't necessarily prompt the user a second time.
            if (existingStatus !== 'granted' && existingStatus !== 'undetermined') {
                // Android remote notification permissions are granted during the app
                // install, so this will only ask on iOS
                const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }

            // Stop here if the user did not grant permissions
            if (finalStatus !== 'granted' && existingStatus !== 'undetermined') {
                this.setState({ currentState: false });
                return;
            }

            // Get the token that uniquely identifies this device
            const token = await getNotificationToken();

            //Register local notification
            notificationId = await configureDailyNotification(formatMessage(this.props.globalize, 'daily_notification_title'), formatMessage(this.props.globalize, 'daily_notification_message'));
        
            //Update to state
            this.props.enableNotification({ ...token, dailyNotificationId: notificationId || ''});

            //Update current state
            this.setState({ currentState: true });

            //Set notification token
            insertOrUpdateNotificationToken(firebase, true, token);
        } else {
            this.props.disableNotification();

            //Save to firebase
            insertOrUpdateNotificationToken(firebase, false);

            //Use this command to cancel all notifications
            // await Notifications.cancelAllScheduledNotificationsAsync();

            //Remove local notification
            if (this.props.settings.notificationToken && this.props.settings.notificationToken.dailyNotificationId) {
                cancelNotification(this.props.settings.notificationToken.dailyNotificationId);
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <View style={styles.logoContainer}>
                        <Image source={Images.logoRounded} style={styles.logo}/>
                        <View style={styles.notificationContainer}>
                            <AvenirText style={styles.notificationNumber}>1245</AvenirText>
                        </View>
                    </View>
                    <AvenirFormattedMessage weight="demi" style={styles.headerTitle} message="wizard_notification_title"/>
                    <AvenirFormattedMessage style={styles.headerDescription} message="wizard_notification_des"/>

                    <View style={styles.buttons}>
                        <AvenirFormattedMessage weight="demi" style={styles.label} message="wizard_notification_title"/>
                        <CustomSwitch value={this.state.currentState} onValueChange={(value) => { this._toggleNotification(value) }}/>
                    </View>
                    <AvenirFormattedMessage style={styles.note} message="wizard_notification_note"/>
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

const wrappedComponent = withGlobalize(connect(mapStateToProps, settingsOperations)(NotificationSettingScreen));

//Navigation options
wrappedComponent.navigationOptions = {
    headerTransparent: false,
    headerTitle: (<AvenirFormattedMessage style={Styles.headerTitleStyle} weight="demi" message="settings_notification" />)
}

export default wrappedComponent;


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
    }
});

