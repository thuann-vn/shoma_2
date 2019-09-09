import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  ActivityIndicator,
  Animated,
  Easing,
  AppState
} from "react-native";
import {RoundedButton, AvenirFormattedMessage, AvenirText, Value} from "../../components";

import Colors from "../../constants/Colors";
import Images from "../../constants/Images";
import Layout from "../../constants/Layout";
import Screens from "../../constants/Screens";
import { iOSColors } from "react-native-typography";
import { connect } from 'react-redux';
import { settingsOperations } from "../../modules/settings";
import { withGlobalize } from 'react-native-globalize';
import { LocalAuthentication } from 'expo';

const AnimatedFormatText = Animated.createAnimatedComponent(AvenirFormattedMessage);

class PinCodeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: this.props.settings.fingerPrintEnabled,
      keyboard: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [null , 0, 'delete']],
      validateCodes: this.props.settings.pinCodes,
      pinCodes: [],
      showMessage: new Animated.Value(0),
      pinCodeBounce: new Animated.Value(0),
    };

    if(this.props.settings.fingerPrintEnabled){
      this._checkHardward();
    }
  }

  _checkHardward = async ()=> {
    const checkResult = await LocalAuthentication.hasHardwareAsync();

    if(checkResult){
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if(supportedTypes && supportedTypes.length){
        this.setState({
          supportType: supportedTypes[0],
          keyboard: [[1, 2, 3], [4, 5, 6], [7, 8, 9], ['delete', 0, 'faceid']],
        });
        
        if(!AppState.currentState.match(/inactive|background/)){
          this._faceIdAuth();
        }
      }
    }

    this.setState({ isLoading: false});
  };
  _onForgotPasswordPress = () => {
    this.props.navigation.navigate(Screens.ForgotPassword);
  };

  _onKeydown = (key)=>{
    //Show error message
    this.state.showMessage.setValue(0);
    this.state.pinCodeBounce.setValue(0);

    switch (key) {
      case 'delete':
        this.state.pinCodes.pop();
        this.setState({ pinCodes: this.state.pinCodes });
        break;
      case 'faceid':
        this._faceIdAuth();
        break;
      default:
        if(this.state.pinCodes.length<4){
          this.state.pinCodes.push(key);
          this.setState({ pinCodes: this.state.pinCodes });
        }
        //Auto login if right
        if (this.state.pinCodes.length==4){
          if (this.state.pinCodes.join() == this.state.validateCodes.join()) {
            this.props.navigation.pop();
          }else{
            //Show error message
            Animated.timing(this.state.showMessage, {
              toValue: 1,
              duration: 300,
              easing: Easing.inOut(Easing.ease),
            }).start();
            
            Animated.timing(this.state.pinCodeBounce, {
              toValue: 1,
              duration: 300,
              easing: Easing.inOut(Easing.ease),
            }).start();
            
            this.setState({
              pinCodes: []
            })
          }
        }
    }
  }

  _faceIdAuth  = ()=>{
    LocalAuthentication.authenticateAsync().then(result => {
      if (result.success) {
        this.props.navigation.pop();
      }
    });
  }

  _generatePlaceholder = (number) => {
    var result = [];
    for(var i=1; i<=number; i++){
      result.push((<View key={'pin_placeholder_'+ i} style={{ ...styles.pinCircle, backgroundColor: Colors.iconBackgroundColor }}></View>))
    }

    return result;
  }

  _renderKey =(key) => {
    switch(key){
      case 'delete':
        return (<Image source={Images.backspaceIcon} style={styles.keyImage} /> )
      case 'faceid': 
        if(this.state.supportType){
          return (<Image source={this.state.supportType == 1 ? Images.fingerprint_black_icon : Images.faceIdIcon} style={styles.keyImage} />)
        }else{
          
        }
      default:
        return <AvenirText weight="demi" style={styles.keyText}>{key}</AvenirText>;
    }
  }

  render() {
    if (this.state.isLoading){
      return (
        <ActivityIndicator></ActivityIndicator>
      )
    }

    var messageOpacity = this.state.showMessage.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    });

    var messageTransform = this.state.showMessage.interpolate({
        inputRange: [0, 1],
        outputRange: [1.2, 1]
    });

    var pinCodeBounce = this.state.pinCodeBounce.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, -10, 0 , 10, 0]
    })

    return (
      <View style={styles.container}>
        <View style={styles.topPanel}>
          <AvenirFormattedMessage weight={"demi"} style={styles.title} message={"common_pincode_title"}/>
          <AnimatedFormatText style={{
            ...styles.message, 
            opacity: messageOpacity,
            transform: [
              {
                scale: messageTransform,
              },
            ]
          }} message={"common_pincode_message"}/>

          <Animated.View style={
            {...styles.pinContainer, 
              transform: [
                {
                  translateX: pinCodeBounce,
                },
              ]
            }}>
            {
              this.state.pinCodes.map((item, index) => (<View key={'pin_'+ index} style={{ ...styles.pinCircle, backgroundColor: Colors.textColor}}></View>))
            }
            {this._generatePlaceholder(4-this.state.pinCodes.length)}
          </Animated.View>
        </View>
        <View style={styles.keyboard}>
          {
            this.state.keyboard.map((row, rowIndex)=>{
              return (
                <View key={'keyboard_row_' + rowIndex} style={styles.keyboardRow}>
                  {
                    row.map((key, index)=>{
                      return (
                        <TouchableOpacity key={'keyboard_' + index} style={{ ...styles.key, backgroundColor: key!= null? Colors.iconBackgroundColor: '#fff'}} onPress={()=>{ this._onKeydown(key) }}>
                         {
                            this._renderKey(key)
                         }
                       </TouchableOpacity>
                     )
                    })
                  }
                </View>
              )
            })
          }
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

const wrappedComponent = withGlobalize(connect(mapStateToProps, { ...settingsOperations })(PinCodeScreen));

wrappedComponent.navigationOptions = ({ navigation }) => {
  return {
    cardOverlayEnabled: false,
    gestureEnabled: false,
  }
};

export default wrappedComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignContent: "center",
    alignItems: "center",
    justifyContent: 'center',
    flexDirection: 'column',
    paddingBottom: Layout.bottomOffsetWithoutNav,
    paddingTop: 80,
  },
  topPanel:{
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-around',
  },
  pinContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    height: 40,
    marginTop: 20,
    marginBottom: 40,
  },
  pinCircle:{
    height: 15,
    width: 15,
    borderRadius: 10,
    backgroundColor: Colors.textColor,
    marginHorizontal: 5,
  },
  keyboard:{
    alignItems: 'center'
  },
  keyboardRow:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  key:{
    flex: 0,
    alignItems:'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    width: 72,
    height: 72,
    margin: 10,
    borderWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: Colors.iconBackgroundColor,
    overflow: 'hidden'
  },
  keyImage:{
    width: 24,
    height: 24,
  },
  keyText:{
    fontSize: 24
  },
  title:{
    fontSize: 18
  },
  message: {
    color: iOSColors.red,
  }
});
