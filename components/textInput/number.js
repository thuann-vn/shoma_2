import React from 'react';
import {
    TextInput, 
    TouchableOpacity,
    View,
    StyleSheet
} from "react-native";
import * as Icon from "@expo/vector-icons";
import Colors from '../../constants/Colors';

class CustomNumberInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value ? this.props.value.toString() : "1"
    };
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  componentWillReceiveProps(nextProps){
      if (nextProps.value != this.state.value) {
        this.setState({
          value: nextProps.value ? nextProps.value.toString() : "1"
        });
      }
  }

  focus() {
    this.refs.input.focus();
  }

  _minusEvent = () => {
    const { value } = this.state;
    var nextValue = parseInt(value) - 1;
    if (value >= 1) {
      this.setState({
        value: nextValue.toString()
      });
    }

    this._onChange(nextValue);
  };

  _plusEvent = () => {
    const { value } = this.state;
    var nextValue = parseInt(value) + 1;
    this.setState({
      value: nextValue.toString()
    });

    this._onChange(nextValue);
  };

  _onChange = (value) => {
      if(value <= 0){
          this.setState({value: 1});
          value = 1;
      }

      this.props.onChange && this.props.onChange(value);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          disabled={this.state.value <= 1}
          onPress={this._minusEvent}
        >
          <Icon.Entypo
            style={[styles.minusButtonStyle, this.state.value <= 1 ? styles.disabledButtonStyle : null]}
            size={20}
            name="minus"
          />
        </TouchableOpacity>
        <TextInput
          value={this.state.value}
          keyboardType="number-pad"
          style={styles.input}
          ref="input"
          selectTextOnFocus={true}
          onChange={value => {
            this.setState({ value: value > 0 ? value: '1' });
          }}
        />
        <TouchableOpacity onPress={this._plusEvent}>
          <Icon.Entypo
            style={styles.plusButtonStyle}
            size={20}
            name="plus"
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export default CustomNumberInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 4,
    borderColor: Colors.borderColor,
    borderWidth: 1
  },
  input: {
    width: 34,
    fontSize: 16,
    textAlign: "center"
  },
  minusButtonStyle: {
    color: Colors.mainColor,
    paddingVertical: 4,
    paddingLeft: 10
  },
  plusButtonStyle: {
    color: Colors.mainColor,
    paddingVertical: 4,
    paddingRight: 10
  },
  disabledButtonStyle:{
      color: '#efefef'
  }
});
