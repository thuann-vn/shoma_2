import React from 'react';
import {
    Image,
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';

import {connect} from 'react-redux';
import Colors from '../../constants/Colors';
import {AvenirFormattedMessage, RoundedButton} from '../../components';
import Layout from '../../constants/Layout';
import Images from '../../constants/Images';
import Screens from '../../constants/Screens';

class WizardScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        let { params } = navigation.state;
        return {
            headerTransparent: true,
            headerTitle: null
        }
    };
    constructor(props) {
        super(props);
    }

    _continue = ()=>{
        this.props.navigation.navigate(Screens.WizardCurrency)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <View style={styles.imageContainer}>
                        <Image resizeMode="contain" source={Images.wizardIntroImage} style={styles.image}></Image>
                    </View>
                    <View style={styles.titleContainer}>
                        <AvenirFormattedMessage style={styles.headerTitle} weight="demi" message="wizard_welcome" />
                        <AvenirFormattedMessage style={styles.headerDescription} message="wizard_welcome_des" />
                    </View>
                </View>
              
                <View>
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
        accounts: state.accounts,
        settings: state.settings,
        transactions: state.transactions
    }
};
export default connect(mapStateToProps, null)(WizardScreen);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: Layout.bottomOffsetWithoutNav,
        paddingHorizontal: 20,
    },
    titleContainer: {
        justifyContent: "center",
        paddingVertical: 20,
    },
    headerTitle:{
        fontSize: 32,
        textAlign: 'center',
        color: Colors.textColor
    },
    headerDescription:{
        fontSize: 16,
        color: Colors.textGray,
        textAlign: 'center'
    },
    contentContainer: {
        flex: 1,
        paddingVertical: 20,
    },
    imageContainer:{
        padding: 0
    },
    image:{
        width: '100%'
    },
    roundedButton: {
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: Colors.mainColor,
        color: '#fff',
        paddingTop: 15,
        paddingBottom: 15,
    },
    roundedButtonLabel: {
        fontSize: 16,
        color: '#fff'
    },
});

