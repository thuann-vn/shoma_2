import React from 'react';
import {Image, StyleSheet, View, TouchableOpacity, Platform, StatusBar} from 'react-native';
import * as Permissions from 'expo-permissions';
import {connect} from 'react-redux';
import Colors from '../../constants/Colors';
import {AvenirFormattedMessage, AvenirText, CustomSwitch} from '../../components';
import {iOSColors} from 'react-native-typography';
import Layout from '../../constants/Layout';
import Images from '../../constants/Images';
import {settingsOperations} from '../../modules/settings';
import Screens from "../../constants/Screens";
import * as firebase from 'firebase';
import { insertOrUpdateNotificationToken } from '../../utils/firebaseHelper';
import { configureDailyNotification, cancelNotification, getNotificationToken } from '../../utils/notificationHelper';
import { formatMessage } from '../../utils/format';
import { withGlobalize } from 'react-native-globalize';
class WizardNotificationScreen extends React.Component {
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

        let finalStatus = existingStatus;
        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
            if(finalStatus=='granted'){
                setTimeout(() => {
                    this._toggleNotification(true);
                });
            }
        }else{
            this._toggleNotification(true);
        }
        
        this.setState({ currentState: finalStatus == 'granted' })
    }

    _toggleNotification = async (value) => {
        this.setState({ currentState: value });

        if (value == true){
            const { status: existingStatus } = await Permissions.getAsync(
                Permissions.NOTIFICATIONS
            );
            let finalStatus = existingStatus;
            
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
            const notificationId = await configureDailyNotification(formatMessage(this.props.globalize, 'daily_notification_title'), formatMessage(this.props.globalize, 'daily_notification_message'));
            
            //Set notification token
            insertOrUpdateNotificationToken(firebase, true, token);
            
            //Update to state
            this.props.enableNotification({
                ...token,
                dailyNotificationId: notificationId || ''
            });

            //Update current state
            this.setState({
                currentState: true,
                notificationId: notificationId
            });
        } else {
            this.props.disableNotification();

            //Save to firebase
            insertOrUpdateNotificationToken(firebase, false);

            //Remove local notification
            if (this.state.notificationId) {
                cancelNotification(this.state.notificationId);
            }
        }
    }

    _continue = () => {
        this.props.setFirstLaunchFinish(true);
        this.props.navigation.navigate(Screens.Home);
    }

    render() {
        return (
            <View style={styles.container}>

                { Platform.OS === "android" && (
                    <StatusBar
                        barStyle="light-content"
                        backgroundColor={Colors.mainColor}
                    />
                )}
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
        settings: state.settings,
    }
};

const wrappedComponent = withGlobalize(connect(mapStateToProps, settingsOperations)(WizardNotificationScreen));
wrappedComponent.navigationOptions = {
    headerTransparent: true,
    headerTitle: ''
}

export default wrappedComponent;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.mainColor,
        paddingBottom: Layout.bottomOffsetWithoutNav
    },
    titleContainer: {
        flex:1,
        width: '100%',
        justifyContent: "center",
        backgroundColor: Colors.mainColor,
        paddingVertical: 40,
        paddingHorizontal: 20
    },
    headerTitle: {
        fontSize: 36,
        textAlign: 'center',
        color: '#fff',
        paddingHorizontal: 20
    },
    headerDescription: {
        fontSize: 16,
        color: '#fefefe',
        textAlign: 'center',
        paddingHorizontal: 20
    },
    contentContainer: {
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
        color: '#fff',
        fontSize: 16
    },
    note:{
        color: '#fff',
    },
    roundedButton: {
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 20,
        paddingTop: 15,
        paddingBottom: 15,
    },
    roundedButtonLabel: {
        fontSize: 16,
        color: Colors.mainColor,
    },
});

