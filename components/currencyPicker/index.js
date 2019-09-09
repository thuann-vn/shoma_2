import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import * as Icon from '@expo/vector-icons';
import {AvenirText} from '../text/StyledText';
import currencies from '../../constants/Currency';
import {withNavigation} from 'react-navigation';
import screens from '../../constants/Screens';

class CurrencyPicker extends React.Component {
    _onSelectIcon = (code) =>{
        this.setState({ value: code, currency: currencies[code]});
        if (this.props.onChange){
            this.props.onChange(code);
        }
    }

    constructor(props){
        super(props);
        this.state= {
            value: this.props.value
        }
    }

    _openCurrencyList = () => {
        if(!this.props.disabled){
            this.props.navigation.navigate(screens.CurrencyPicker, { value: this.state.value, callback: this._onSelectIcon })
        }
    }

    render() {
        return (
            <TouchableOpacity {...this.props} style={styles.container} activeOpacity={0.7} onPress={() => { this._openCurrencyList() }}>
                <View style={styles.labelContainer}>
                    <AvenirText weight="demi">{currencies[this.state.value].name} - {currencies[this.state.value].symbol}</AvenirText>
                </View>
                <Icon.Entypo style={{ color: '#333' }} name="chevron-thin-right" />
            </TouchableOpacity>
        );
    }
}

export default withNavigation(CurrencyPicker);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        borderRadius: 4,
        overflow: 'hidden',
    },
    labelContainer:{
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 10
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 5,
        color: '#333',
        fontWeight: 'bold',
    },
    text: {
        fontSize: 14,
    },
});
