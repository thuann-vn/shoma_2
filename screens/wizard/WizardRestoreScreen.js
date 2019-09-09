import React from 'react';
import {Image, StyleSheet, View, ActivityIndicator, StatusBar, Platform} from 'react-native';

import {connect} from 'react-redux';
import Colors from '../../constants/Colors';
import {AvenirFormattedMessage} from '../../components';
import {iOSColors} from 'react-native-typography';
import Layout from '../../constants/Layout';
import Images from '../../constants/Images';
import {settingsOperations} from '../../modules/settings';
import {productsOperations} from '../../modules/products';
import {categoriesOperations} from '../../modules/categories';
import {customersOperations} from '../../modules/customers';
import {ordersOperations} from '../../modules/orders';
import { restoreData } from '../../utils/backupHelper';
import firebase from '../../services/firebase';
import Screens from '../../constants/Screens';

class WizardRetoreScreen extends React.Component {
    static navigationOptions = () => {
        return {
            headerTransparent: false,
            headerStyle: {
                backgroundColor: '#fff',
                borderBottomWidth: 0,
            }
        };
    };
    
    constructor(props) {
        super(props);

        this.state = {
            currentState: true, 
        }
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged((user) => {
            if(user != null){
                restoreData(this.props).then(()=>{
                    this.props.navigation.navigate(Screens.WizardCurrency);
                });
            }
        });
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
                            <AvenirFormattedMessage style={styles.notificationNumber} message="restore_running"/>
                        </View>
                    </View>
                    <AvenirFormattedMessage weight="demi" style={styles.headerTitle} message="restore_title"/>
                    <AvenirFormattedMessage style={styles.headerDescription} message="restore_description"/>
                    <ActivityIndicator color='#fff' size='large'/>
                </View>
            </View>
        );
    }
}

const mapStateToProps = () => {
    return {
    }
};
export default connect(mapStateToProps, { 
    ...settingsOperations,
    ...productsOperations,
    ...customersOperations,
    ...ordersOperations,
    ...categoriesOperations,
  })(WizardRetoreScreen);


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
        color: '#efefef',
        textAlign: 'center',
        paddingHorizontal: 20,
        marginBottom: 20
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
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: -25,
        top: -10,
        backgroundColor: iOSColors.red,
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 15,
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
        fontSize: 16,
        marginRight: 5
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
    },
    roundedButton: {
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: Colors.mainColor,
        color: '#fff',
        marginBottom: 20,
        paddingTop: 15,
        paddingBottom: 15,
    },
    roundedButtonLabel: {
        fontSize: 16,
        color: '#fff'
    },
});

