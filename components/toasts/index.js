import React from "react";
import { View, StyleSheet } from "react-native";
import * as Icon from '@expo/vector-icons';
import { AvenirFormattedMessage } from "../text/StyledText";
import Colors from "../../constants/Colors";

export default class ToastMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (
        <View style={styles.toastContentContainer}>
            <Icon.MaterialIcons style={styles.toastIcon} size={30} name="info" />
            <AvenirFormattedMessage style={styles.toastText} message={this.props.message} />
        </View>
    );
  }
}

const styles = StyleSheet.create({
	toastContainer: {
        backgroundColor: Colors.yellow
    },
    toastContentContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center'
    },
    toastIcon: {
        color: '#fff'
    },
    toastText: {
        color: '#fff',
        marginLeft: 10
    },})
