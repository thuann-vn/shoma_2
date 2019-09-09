import React from 'react';
import { Switch } from 'react-native';
import Colors from '../../constants/Colors';
import { ButtonGroup } from 'react-native-elements';

export class CustomButtonGroup extends React.Component {
  render() {
    return (
      <ButtonGroup
        {...this.props}
        textStyle={{ fontSize: 14 }}
        buttonStyle={{ backgroundColor: "rgba(255,255,255,.8)"}}
        selectedButtonStyle={{ backgroundColor: Colors.mainColor }}
        underlayColor={Colors.mainColor}
        containerStyle={{ ...this.props.containerStyle, borderRadius: 8}}
      />
    );
  }
}