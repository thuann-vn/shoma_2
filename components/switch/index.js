import React from 'react';
import { Switch } from 'react-native';
import Colors from '../../constants/Colors';

export class CustomSwitch extends React.Component {
  render() {
    return <Switch {...this.props}></Switch>;
  }
}