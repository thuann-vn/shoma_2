import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView
} from "react-native";
import { AvenirText, Icon, SearchBar, Separator, AvenirFormattedMessage, HeaderButton } from "../../components";
import { settingsOperations } from "../../modules/settings";
import Colors from "../../constants/Colors";
import { connect } from "react-redux";
import { DateFormats } from "../../constants/Common";
import moment from 'moment';
import Styles from "../../constants/Styles";
import { Header } from "react-native-elements";

class DateFormatPickerScreen extends React.Component {
  static navigationOptions = () => {
    return {
      headerTransparent: false,
      headerTitle: (<AvenirFormattedMessage style={Styles.headerTitleStyle} weight="demi" message="common_select_dateformat"/>),
      headerTitle: "Date Format",
      headerRight: null,
      tabBarVisible: false
    };
  };

  constructor(props) {
		super(props);
		
		const { params } = this.props.navigation.state;

    this.state = {
			value: params ? params.value : null,
      formats: DateFormats
    };
  }

  _onSelect = key => {
		if (this.props.navigation.state.params && this.props.navigation.state.params.callback) {
      this.props.navigation.state.params.callback(key);
    }
    this.props.navigation.pop();
  };

  _renderCheckedIcon = code => {
    if (this.state.value == code) {
      return (
        <Icon.Ionicons
          name="ios-checkmark"
          color={Colors.mainColor}
          size={26}
        />
      );
    }
  };

  _renderRow = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.code}
        style={styles.button}
        onPress={() => this._onSelect(item.code)}
      >
        <View style={styles.buttonContainer}>
          <View style={styles.label}>
            <AvenirText style={styles.name}>
              {moment().format(item.code)}
            </AvenirText>
          </View>
          {this._renderCheckedIcon(item.code)}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView>
        <Header
          containerStyle={{ height: 50, paddingTop: 0, borderBottomWidth: 0 }}
          backgroundColor={Colors.mainColor}
          centerComponent={
            <AvenirFormattedMessage
              style={Styles.headerTitleStyle}
              weight="demi"
              message = "common_select_dateformat"
            />
          }
          rightComponent={
            <HeaderButton
              label="common_close"
              onPress={() => this.props.navigation.pop()}
            />
          }
        />
        <FlatList
          data={this.state.formats}
          extraData={this.state}
          keyExtractor={item => item.code}
          renderItem={this._renderRow}
					ItemSeparatorComponent = {()=>(<Separator left={0}/>)}
					style={{ paddingTop: 20 }}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    settings: state.settings
  };
};
export default connect(
  mapStateToProps,
  settingsOperations
)(DateFormatPickerScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bodyColor
  },
  previewContainer: {
    flex: 1,
    padding: 40,
    alignItems: "center"
  },
  iconsContainer: {
    flex: 1,
    flexDirection: "column"
  },
  button: {
		flex: 1,
  },
  buttonContainer: {
    backgroundColor: "#fff",
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 10,
  },
  flag: {
    height: 32,
    marginRight: 10,
    borderRadius: 2
  },
  label: {
    flex: 1
  },
  name: {
		fontSize: 16
	},
  code: {
    color: "#777",
  }
});
