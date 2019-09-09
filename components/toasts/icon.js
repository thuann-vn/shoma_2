import React from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from 'react-native-elements';
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
        <View style={[styles.containerStyle,this.props.containerStyle]}>
            {/* {this.props.icon? */}
              <Icon
                name= {this.props.icon ? this.props.icon: 'search'}
                type= {this.props.iconType ? this.props.iconType : 'feather'}
                size= {this.props.iconSize ? this.props.iconSize : 20}
                color= {this.props.iconColor ? this.props.iconColor:Colors.textColor}
              /> 
            {/* // :
            //   <Image
            //     style={[{ width: 24, height: 24 }, this.props.styleIcon]}
            //     source={this.props.url}
            //   />
            // } */}
            {this.props.content?this.props.content:
                <AvenirFormattedMessage style={styles.toastText} message={this.props.message} />}  
        </View>
    );
  }
}

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        marginVertical: 3,
    },
    toastText: {
        marginLeft: 5
    },
})
