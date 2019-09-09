import React from "react";
import {
  StyleSheet,
  View,
  Alert,
  Image,
  TouchableOpacity} from "react-native";
import { AvenirFormattedMessage, AvenirText } from "../../components";

import Colors from "../../constants/Colors";
import Images from "../../constants/Images";
import Layout from "../../constants/Layout";
import { connect } from 'react-redux';
import { settingsOperations } from "../../modules/settings";
import { withGlobalize } from 'react-native-globalize';
import Styles from "../../constants/Styles";
import { formatMessage } from "../../utils/format";

class PinCodeSettingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      keyboard: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [null, 0, 'delete']],
      pinCodes: [],
      confirmCodes: [],
      step: 0 //0: Start, 1 confirm, 2 complete
    };
  }

  _onKeydown = (key) => {
    let pinCodes = this.state.pinCodes;
    if (this.state.step == 1) { //Confirm step
      pinCodes = this.state.confirmCodes;
    }

    switch (key) {
      case 'delete':
        pinCodes.pop();
        break;
      default:
        if (pinCodes.length < 4) {
          pinCodes.push(key);
        }
    }

    //Auto login if right
    let step = this.state.step;
    if (step == 0) { //Confirm step
      if (pinCodes.length == 4) {
        step = 1;
      }
      this.setState({ pinCodes: pinCodes, step: step });
    } else if (step == 1) {
      this.setState({ confirmCodes: pinCodes });

      if (pinCodes.length == 4) {

        if (pinCodes.join() != this.state.pinCodes.join()) {
          Alert.alert(formatMessage(this.props.globalize, 'pincodes_confirm_invalid'));
          pinCodes = [];
        } else {
          this.props.setPinCode(pinCodes);
          Alert.alert(formatMessage(this.props.globalize, 'pincodes_setup_success'));
          this.props.navigation.goBack();
        }
      }
      this.setState({ confirmCodes: pinCodes });
    }
  }

  _generatePlaceholder = (number) => {
    var result = [];
    for (var i = 1; i <= number; i++) {
      result.push((<View key={'placeholder_' + i} style={{ ...styles.pinCircle, backgroundColor: Colors.iconBackgroundColor }}></View>))
    }

    return result;
  }

  _renderKey = (key) => {
    switch (key) {
      case 'delete':
        return (<Image source={Images.backspaceIcon} style={styles.keyImage} />)
      default:
        return <AvenirText weight="demi" style={styles.keyText}>{key}</AvenirText>;
    }
  }

  render() {
    let pinCodes = [];
    if (this.state.step == 0) {
      pinCodes = this.state.pinCodes
    }else {
      pinCodes = this.state.confirmCodes
    }

    return (
      <View style={styles.container}>
        <View style={styles.topPanel}>
          {
            this.state.step == 0 ?
              (
                <View>
                  <AvenirFormattedMessage weight={"demi"} style={styles.title} message={"enter_pincode_title"} />
                  <AvenirFormattedMessage style={styles.message} message={"enter_pincode_message"} />
                </View>
              )
              :
              (
                <View>
                  <AvenirFormattedMessage weight={"demi"} style={styles.title} message={"confirm_pincode_title"} />
                  <AvenirFormattedMessage style={styles.message} message={"confirm_pincode_message"} />
                </View>
              )
          }


          <View style={styles.pinContainer}>
            {
              pinCodes.map(() => (<View style={{ ...styles.pinCircle, backgroundColor: Colors.textColor }}></View>))
            }
            {this._generatePlaceholder(4 - pinCodes.length)}
          </View>
        </View>

        <View style={styles.keyboard}>
          {
            this.state.keyboard.map((row, index) => {
              return (
                <View style={styles.keyboardRow} key={'pincoderow_' + index}>
                  {
                    row.map((key) => {
                      return (
                        <TouchableOpacity key={'pincode_' + key} style={{ ...styles.key, backgroundColor: key != null ? Colors.iconBackgroundColor : '#fff' }} onPress={() => { this._onKeydown(key) }}>
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

const wrappedComponent = withGlobalize(connect(mapStateToProps, { ...settingsOperations })(PinCodeSettingScreen));

wrappedComponent.navigationOptions = {
  headerTransparent: false,
  headerTitle: (<AvenirFormattedMessage style={Styles.headerTitleStyle} weight="demi" message="settings_pincode_setup" />)
}

export default wrappedComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: 'space-around',
    paddingBottom: Layout.bottomOffsetWithoutNav
  },
  topPanel: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-around'
  },
  pinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    height: 40,
    marginTop: 40,
  },
  pinCircle: {
    height: 15,
    width: 15,
    borderRadius: 10,
    backgroundColor: Colors.textColor,
    marginHorizontal: 5,
  },
  keyboard: {
    alignItems: 'center'
  },
  keyboardRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  key: {
    flex: 0,
    alignItems: 'center',
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
  keyImage: {
    width: 24,
    height: 24,
  },
  keyText: {
    fontSize: 24
  },
  title: {
    fontSize: 18,
    textAlign: 'center'
  },
  message: {
    textAlign: 'center',
    paddingHorizontal: 15,
  }
});
