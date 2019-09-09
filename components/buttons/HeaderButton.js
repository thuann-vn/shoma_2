import React from 'react';
import {
    StyleSheet,
    TouchableOpacity} from 'react-native';
import { AvenirFormattedMessage } from '../text/StyledText';
import * as Icon from '@expo/vector-icons'

export class HeaderButton extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <TouchableOpacity style={[styles.container, this.props.style]} {...this.props}>
                {
                    this.props.icon && (<Icon.Feather name={this.props.icon} style={styles.icon} size={this.props.iconSize || 24}/>)
                }
                {
                    this.props.label && (<AvenirFormattedMessage style={styles.text} weight="demi" message={this.props.label}/>)
                }
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center'
    },
    text:{
        color: '#fff',
        fontSize: 16
    },
    icon:{
        color: '#fff',
    }
})