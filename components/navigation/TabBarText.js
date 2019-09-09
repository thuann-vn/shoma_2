import React from 'react';
import {AvenirText, AvenirFormattedMessage} from '../text/StyledText';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export default class TabBarText extends React.Component {
  render() {
    let color = this.props.focused ? Colors.androidTabIconSelected : Colors.androidTabIconDefault;
    if(!Layout.isIOS){
      color = this.props.focused ? Colors.androidTabIconSelected : Colors.androidTabIconDefault;
    }

    if(this.props.label){
      return (
        <AvenirFormattedMessage 
          weight="demi" 
          style={{flex: 1, textAlign: 'center',fontSize: 12, color: color}} 
          message={this.props.label}
        />
      );
      }else{
        return (<AvenirText></AvenirText>)
      }
  }
}
