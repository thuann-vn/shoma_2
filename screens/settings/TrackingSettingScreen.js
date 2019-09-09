import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../../constants/Colors';
import {AvenirFormattedMessage, AvenirText, CustomSwitch} from '../../components';
import {iOSColors} from 'react-native-typography';
import Layout from '../../constants/Layout';
import Images from '../../constants/Images';
import {settingsOperations} from '../../modules/settings';
import Styles from "../../constants/Styles";
import { withGlobalize } from 'react-native-globalize';

class TrackingSettingScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentState: this.props.settings.trackingEnabled, 
        }
    }

    _toggle = async (value) => {
        this.setState({ currentState: value });
        this.props.setTrackingEnabled(value);
    }
 
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <View style={styles.logoContainer}>
                        <Image source={Images.logoRounded} style={styles.logo}/>
                        <View style={styles.notificationContainer}>
                            <AvenirText style={styles.notificationNumber}>usage log</AvenirText>
                        </View>
                    </View>
                    <AvenirFormattedMessage weight="demi" style={styles.headerTitle} message="settings_tracking_title"/>
                    <AvenirFormattedMessage style={styles.headerDescription} message="settings_tracking_description"/>

                    <View style={styles.buttons}>
                        <AvenirFormattedMessage weight="demi" style={styles.label} message="settings_tracking_title"/>
                        <CustomSwitch value={this.state.currentState} onValueChange={(value) => { this._toggle(value) }}/>
                    </View>
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

const wrappedComponent = withGlobalize(connect(mapStateToProps, settingsOperations)(TrackingSettingScreen));

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

