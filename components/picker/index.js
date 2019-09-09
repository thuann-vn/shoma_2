import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { withNavigation } from '@react-navigation/core';
import Colors from "../../constants/Colors";
import Screens from "../../constants/Screens";
import { FormattedMessage } from "react-native-globalize";

class CustomPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value
    };
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  componentWillReceiveProps (nextProps){
      if(nextProps.value != this.state.value){
          this.setState({value:nextProps.value});
      }
  }

  _changeValue = (value) =>{
      if (value != this.state.value) {
        this.setState({ value: value});
        this.props.onChange && this.props.onChange(value);
      }
  }

  _openPickerScreen = () => {
    this.props.navigation.navigate(Screens.Picker, {
      data: this.props.data,
      value: this.state.value,
      title: this.props.label,
      callback: this._changeValue
    });
  };

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this._openPickerScreen}
      >
        {this.state.value ? (
          <View>
            <FormattedMessage
              style={styles.floatedLabel}
              message={this.props.label}
            />
            <Text style={styles.value}>{this.state.value}</Text>
          </View>
        ) : (
          <FormattedMessage
            style={styles.label}
            message={this.props.label}
          />
        )}
      </TouchableOpacity>
    );
  }
}

export default withNavigation(CustomPicker);

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    paddingBottom: 8,
    borderBottomColor: "rgba(0,0,0,0.38)",
    borderBottomWidth: 0.3333
  },
  label: {
    color: Colors.textGray,
    fontSize: 16
  },
  value: {
    fontSize: 16,
    color: Colors.textColor
  },
  floatedLabel: {
    color: Colors.textGray,
    fontSize: 12,
    position: 'absolute',
    top: -15,
    left: 0
  }
});
