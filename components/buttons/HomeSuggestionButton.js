import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {AvenirFormattedMessage} from '../text/StyledText';
import {SmallIconBackground} from "../background/smallIconBackground";
import Colors from "../../constants/Colors";

export class HomeSuggestionButton extends React.Component {
  render() {
    return (
      <TouchableOpacity {...this.props} style={styles.suggestionItem}>
        <LinearGradient
          start={{x: 1, y: 0}}
          end={{x: 0, y: 1}}
          colors={this.props.colors || [Colors.mainColor, '#5B60EF']}
          style={styles.suggestionItemGradientStyle}
        >
        </LinearGradient>
        <View style={styles.suggestionItemContainer}>
          <SmallIconBackground style={styles.imageContainer} width={50}>
            <Image style={styles.image} source={this.props.image}/>
          </SmallIconBackground>
          <View style={styles.contentContainer}>
            <AvenirFormattedMessage weight="demi" style={styles.title} message={this.props.title}/>
            <AvenirFormattedMessage style={styles.description} message={this.props.description}/>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  suggestionItem: {
    borderRadius: 8,
    overflow: 'hidden'
  },
  suggestionItemGradientStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  suggestionItemContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    position: 'relative'
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 15,
    paddingVertical: 10
  },
  title: {
    color: '#fff',
    fontSize: 18,
  },
  description: {
    color: '#fff',
    fontSize: 13,
    minHeight: 32
  },
  imageContainer: {
    width: 50,
    height: 50
  },
  image: {
    width: 32,
    height: 32,
  }
});
