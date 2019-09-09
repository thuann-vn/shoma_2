import React from 'react';
import * as Icon from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export default class TabBarIcon extends React.Component {
  render() {
    let color = this.props.focused ? Colors.androidTabIconSelected : Colors.androidTabIconDefault;
    if(!Layout.isIOS){
      color = this.props.focused ? Colors.androidTabIconSelected : Colors.androidTabIconDefault;
    }

    return (
      <Icon.Feather
        name={this.props.name}
        size={22}
        style={{ marginBottom: 5, height: 24 }}
        color={color}
      />
    );
  }
}
