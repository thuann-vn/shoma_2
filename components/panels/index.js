import React from 'react';
import {
    StyleSheet,
    View,
    ViewProps
} from 'react-native';
import { AvenirText, AvenirFormattedMessage } from '../text/StyledText';
import Colors from '../../constants/Colors';
import PropTypes from "prop-types";

export class DefaultPanel extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        let headerTextStyle = {...styles.headerText};
        if(this.props.largeHeader){
            headerTextStyle.fontSize = 20
        }
        return (
          <View
            {...this.props}
            style={[
              styles.container,
              this.props.containerStyle ? this.props.containerStyle : {}
            ]}
          >
            {!this.props.notitle && this.props.title && (
              <View style={[styles.header, this.props.headerStyle]}>
                <View>
                  {this.props.topTitle && (
                    <AvenirText style={styles.topTitle}>
                      {this.props.topTitle}
                    </AvenirText>
                  )}
                  <AvenirFormattedMessage
                    style={headerTextStyle}
                    weight="demi"
                    message={this.props.title}
                  />
                  {this.props.description && (
                    <AvenirFormattedMessage
                      style={styles.headerDescription}
                      message={this.props.description}
                      {...this.props.descriptionParams}
                    />
                  )}
                </View>
                {this.props.rightComponent
                  ? this.props.rightComponent
                  : null}
              </View>
            )}

            <View style={styles.body}>{this.props.children}</View>
          </View>
        );
    }
}

DefaultPanel.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  rightComponent: PropTypes.any
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    header: {
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerText: {
        fontSize: 16
    },
    headerDescription:{
        color: Colors.textGray,
        marginTop: 5,
        fontSize: 12,
    },
    topTitle:{
        color: Colors.textGray,
        fontSize: 10,
        marginBottom: 5
    }
});
