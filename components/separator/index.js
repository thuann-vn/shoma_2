import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import Colors from '../../constants/Colors';

export class Separator extends React.Component {
    render(){
        let style = { ...styles.itemSeparator};
        if (this.props.position == 'top') {
            style.top = 0;
        }else{
            style.bottom = 0;
        }
        style.left = this.props.left >= 0 ? this.props.left : 85;
        style.borderBottomColor = this.props.color ? this.props.color : Colors.borderColor;
        
        return (
            <View style={style}></View>
        ) 
    }
}
const styles = StyleSheet.create({
    itemSeparator: {
        borderBottomWidth: 1,
        left: 0,
        position: 'absolute',
        right: 0
    }
});
