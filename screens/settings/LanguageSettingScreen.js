import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { connect } from 'react-redux';
import Colors from '../../constants/Colors';
import { AvenirFormattedMessage, AvenirText, RoundedButton } from '../../components';
import { iOSColors } from 'react-native-typography';
import Layout from '../../constants/Layout';
import { Languages } from '../../constants/Common';
import Screens from '../../constants/Screens';
import { settingsOperations } from '../../modules/settings';
import Styles from '../../constants/Styles';

class LanguageSettingScreen extends React.Component {
    static navigationOptions = () => {
        return {
            headerTransparent: false,
            headerTitle: (<AvenirFormattedMessage style={Styles.headerTitleStyle} weight="demi" message="settings_language" />)
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            language: this.props.settings.language
        }
    }

    _changeLanguage = (item) => {
        this.props.changeLanguage(item.code);
        this.setState({ language: item.code });
    }

    _continue = () => {
        this.props.navigation.navigate(Screens.Welcome);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <AvenirFormattedMessage style={styles.headerTitle} weight="demi" message="wizard_lang_title" />
                    <AvenirFormattedMessage style={styles.headerDescription} message="wizard_lang_question" />

                    <View style={styles.languageButtons}>
                        {
                            Languages.map((item) => (
                                <TouchableOpacity onPress={() => this._changeLanguage(item)} key={'language_' + item.code} style={[styles.language, item.code == this.state.language ? styles.selectedLanguage : null]}>
                                    <Image style={styles.languageImage} source={item.image} />
                                    <AvenirText style={[styles.languageName, item.code == this.state.language ? styles.selectedLanguageName : null]} weight="demi">{item.name}</AvenirText>
                                </TouchableOpacity>
                            )
                            )
                        }
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
export default connect(mapStateToProps, settingsOperations)(LanguageSettingScreen);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: Layout.bottomOffsetWithoutNav
    },
    titleContainer: {
        flex: 1,
        width: '100%',
        justifyContent: "center",
        paddingVertical: 40
    },
    headerTitle: {
        fontSize: 32,
        textAlign: 'center',
        color: Colors.textColor
    },
    headerDescription: {
        fontSize: 16,
        color: Colors.textGray,
        textAlign: 'center'
    },
    contentContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    languageButtons: {
        flexDirection: 'row',
        padding: 10,
        marginTop: 20,
    },
    language: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'center',
        alignContent: 'center',
        borderRadius: 8,
        margin: 10,
    },
    languageImage: {
        marginBottom: 5,
        width: 50,
        height: 50
    },
    selectedLanguage: {
        backgroundColor: iOSColors.tealBlue,
    },
    selectedLanguageName: {
        color: '#fff'
    }
});

