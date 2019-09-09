import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View, Platform, StatusBar} from 'react-native';

import {connect} from 'react-redux';
import Colors from '../../constants/Colors';
import {AvenirFormattedMessage, AvenirText} from '../../components';
import Layout from '../../constants/Layout';
import Images from '../../constants/Images';
import Currency from '../../constants/Currency';
import Screens from '../../constants/Screens';
import moment from 'moment';
import {settingsOperations} from '../../modules/settings';

class WizardCurrencyScreen extends React.Component {
    static navigationOptions = () => {
        return {
            headerTransparent: true,
            headerTitle: ''
        };
    };
    
    constructor(props) {
        super(props);

        this.state = {
            currency: this.props.settings.currency, 
            currencyName: Currency[this.props.settings.currency].name,
            dateFormat: this.props.settings.dateFormat || 'YYYY/MM/DD'
        }
    }

    _openCurrencyList = () => {
        this.props.navigation.navigate(Screens.CurrencyPicker, { value: this.state.currency, callback: this._onSelectCurrency })
    }

    _onSelectCurrency = (code) => {
        this.setState({ currency: code, currencyName: Currency[code].name});
        this.props.changeCurrency(code);
    }


    _openDateFormatList = () => {
        this.props.navigation.navigate(Screens.DateFormatPicker, { value: this.state.dateFormat, callback: this._onSelectDateformat })
    }

    _onSelectDateformat = (code) => {
        this.setState({ dateFormat: code });
        this.props.changeDateFormat(code);
    }

    _continue = () => {
        this.props.navigation.navigate(Screens.WizardNotification);
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
                    <AvenirFormattedMessage weight="demi" style={styles.headerTitle} message="wizard_currency_title" />
                    <AvenirFormattedMessage style={styles.headerDescription} message="wizard_currency_des" />
                    
                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.button} onPress={this._openCurrencyList}>
                            <Image style = {styles.buttonImage} source={Images.currencyIcon}/>
                            <AvenirText style={[styles.buttonLabel]} weight="demi">{this.state.currencyName}</AvenirText>
                            <AvenirFormattedMessage style={[styles.buttonLabel]} message="common_currency"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={this._openDateFormatList}>
                            <Image style={styles.buttonImage} source={Images.calendarIcon} />
                            <AvenirText style={[styles.buttonLabel]} weight="demi">{moment().format(this.state.dateFormat)}</AvenirText>
                            <AvenirFormattedMessage style={[styles.buttonLabel]} message="common_dateTimeFormat" />
                        </TouchableOpacity>
                    </View>
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
        categories: state.categories,
        settings: state.settings,
    }
};
export default connect(mapStateToProps, settingsOperations)(WizardCurrencyScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainColor,
    paddingBottom: Layout.bottomOffsetWithoutNav
  },
  titleContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    backgroundColor: Colors.mainColor,
    paddingVertical: 40
  },
  headerTitle: {
    fontSize: 32,
    textAlign: "center",
    color: "#fff"
  },
  headerDescription: {
    fontSize: 16,
    color: '#efefef',
    textAlign: "center",
    paddingHorizontal: 20
  },
  contentContainer: {
    backgroundColor: Colors.mainColor,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  buttons: {
    flexDirection: "row",
    padding: 10,
    marginTop: 20
  },
  button: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    alignContent: "center",
    borderRadius: 8,
    margin: 10
  },
  buttonLabel: {
    textAlign: "center"
  },
  buttonImage: {
    marginBottom: 5,
    width: 50,
    height: 50
  },
  roundedButton: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 20,
    paddingTop: 15,
    paddingBottom: 15
  },
  roundedButtonLabel: {
    fontSize: 16,
    color: Colors.mainColor
  }
});

