import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import * as Icon from '@expo/vector-icons';
import AppIntroSlider from 'react-native-app-intro-slider';
import { connect } from "react-redux";
import { settingsOperations } from '../../modules/settings';
import Colors from '../../constants/Colors';
import { AvenirText } from '..';
import Layout from '../../constants/Layout';
import Images from '../../constants/Images';

const slides = [
    {
        key: 'step_0',
        title: 'Language',
        text: 'React-native-app-intro-slider is easy to setup with a small footprint and no dependencies. And it comes with good default layouts!',
        icon: 'ios-pulse',
        colors: ['#63E2FF', '#B066FE'],
    },
    {
        key: 'step_1',
        title: 'Add your first wallet',
        text: 'React-native-app-intro-slider is easy to setup with a small footprint and no dependencies. And it comes with good default layouts!',
        icon: 'ios-pulse',
        colors: ['#63E2FF', '#B066FE'],
    },
    {
        key: 'step_2',
        title: 'Super customizable',
        text: 'The component is also super customizable, so you can adapt it to cover your needs and wants.',
        icon: 'ios-options',
        colors: ['#A3A1FF', '#3A3897'],
    },
    {
        key: 'step_3',
        title: 'No need to buy me beer',
        text: 'Usage is all free',
        icon: 'ios-beer',
        colors: ['#29ABE2', '#4F00BC'],
    },
];

class WelcomeWizard extends React.Component {
    constructor(props){
        super(props);
        this.state= {
            settings: this.props.settings
        };
    }

    _renderItem = props => (
        <ImageBackground
            ove
            source={Images.welcomeBackground}
            style={[
                styles.mainContent,
                {
                    paddingTop: props.topSpacer,
                    paddingBottom: props.bottomSpacer,
                    width: props.width,
                    height: props.height,
                },
            ]}
        >
            <Icon.Ionicons
                style={{ backgroundColor: 'transparent' }}
                name={props.icon}
                size={150}
                color="white"
            />
            <View>
                <AvenirText style={styles.title}>{props.title}</AvenirText>
                <AvenirText style={styles.text}>{props.text}</AvenirText>
            </View>
        </ImageBackground>
    );

    render() {
       return (
           <AppIntroSlider
               slides={slides}
               showNextButton
               renderItem={this._renderItem}
            //    bottomButton= {true}
               doneLabel= "Let's go!"
            //    dotStyle={{ display: 'none' }}
            //    activeDotStyle={{ display: 'none' }}
               onDone={() => {
                   this.props.setFirstLaunchFinish();
                   this.props.onDone();
               }}
           />
       )
    }
}

const mapStateToProps = state => {
    return {
        settings: state.settings,
    };
};

export default connect(
    mapStateToProps,
    {...settingsOperations}
)(WelcomeWizard);

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: Colors.mainColor,
        paddingBottom: Layout.bottomOffsetWithoutNav
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.mainColor
    },
    image: {
        width: 320,
        height: 320,
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 22,
        color: 'white',
        backgroundColor: 'transparent',
        textAlign: 'center',
        marginBottom: 16,
    },
});
