// @flow
"use strict";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  FlatList,
  Animated,
  ScrollView
} from "react-native";
import { BlurView } from 'expo-blur';
import {
  statusBarHeight,
  headerHeight,
  SafeAreaWithHeader
} from "./DimensionsHelper";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import Value from "../value";
import { AvenirFormattedMessage, CustomFormattedMessage } from "../text/StyledText";
import { isIphoneX } from "react-native-iphone-x-helper";

const vw = SafeAreaWithHeader.vw;
const vh = SafeAreaWithHeader.vh;
const HEADER_HEIGHT = Platform.OS == 'ios' ? 78 : 20;
const BOTTOM_OFFSET = Platform.OS == 'ios' ? 78 : 138;
const AnimatedText = Animated.createAnimatedComponent(CustomFormattedMessage);

class ViewWithTitle extends Component {
  headerHeight = Platform.OS=='ios' ? statusBarHeight + headerHeight : 50;

  constructor(props) {
    super(props);
    this.state = { scrollY: new Animated.Value(0) };
  }

  renderTitleArea = () => {
    let titleContainerStyle = {
      ...styles.titleContainer,
      height: this.headerHeight
    }
    if(Platform.OS == 'android' && this.props.headerColor){
      titleContainerStyle.backgroundColor = this.props.headerColor;
    }

    return (
      <View
        style={titleContainerStyle}
      >
        {this.renderTitle()}
      </View>
    );
  };

  renderTitle = () => {
    if (this.props.title) {
      let title = this.props.title;
      if (title.length > 34) {
        title = title.substr(0, 32) + "...";
      }
      let titleOpacity = this.state.scrollY.interpolate({
        inputRange: [0, 41, 45],
        outputRange: [0, 0, 1],
        extrapolate: "clamp"
      });

      let titleStyle = {
        ...styles.iOSTitle
      }

      if(Platform.OS == 'android' && this.props.headerColor){
        titleStyle.color = '#fff';
      }
      
      return (
        <Animated.View
          style={[
            styles.iOSTitleContainer,
            {
              height: this.headerHeight,
              opacity: titleOpacity
            }
          ]}
        >
          { Platform.OS == 'ios' &&  <BlurView
            tint="default"
            intensity={100}
            style={StyleSheet.absoluteFill}
          />}

          <CustomFormattedMessage
            weight="demi"
            style={titleStyle}
            message={title}
          />
        </Animated.View>
      );
    }
  };

  setOffsetY = (value) => {
    this.state.scrollY.setValue(value);
  }

  renderIOSBigTitle = () => {
    if (this.props.title) {
      let title = this.props.title;
      let subTitle = this.props.subTitle;
      if (title.length > 19) {
        title = title.substr(0, 17) + "...";
      }
      const fontSize = this.state.scrollY.interpolate({
        inputRange: [-50, 0],
        outputRange: [40, 34],
        extrapolate: "clamp"
      });
      const top = this.state.scrollY.interpolate({
        inputRange: [0, 70],
        outputRange: [0, -70]
      });

      const opacity = this.state.scrollY.interpolate({
        inputRange: [30, 40],
        outputRange: [1, 0]
      });

      let titleStyle = {
        ...styles.iOSBigTitle, fontSize: fontSize
      };
      let subtitleStyle = {...styles.iOSSubTitle};
      if(Platform.OS == 'android' && this.props.headerColor){
        titleStyle.color = '#fff';
        subtitleStyle.color = '#efefef'
      }


      return (
        <Animated.View
          style={[
            styles.iOSBigTitleContainer,
            {
              transform: [{ translateY: top }],
              opacity: opacity,
              backgroundColor: Platform.OS == 'ios' ? null : this.props.headerColor
            }
          ]}
          key="iosBigTitle"
        >
          <View>
            <Text style={subtitleStyle}>{subTitle}</Text>
            
            { this.props.value ? (
              <Animated.Text
                allowFontScaling={false}
                style={titleStyle}
              >
                <Value useDefaultFont={true} weight="demi" value={this.props.value} currency={this.props.currency || 'USD'}></Value>
              </Animated.Text>
            ) : <AnimatedText
                allowFontScaling={false}
                style={titleStyle}
                message={title}
              />
              }
          </View>
          <View style={[styles.iOSRightTitle]}>
            {
              this.props.rightTitle
            }
          </View>
        </Animated.View>
      );
    }
  };

  renderContentArea = () => {
    if (this.props.children && !this.props.customContentArea) {
      let padding = HEADER_HEIGHT + 98 - (isIphoneX() ? -2 : 20);
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          style={{ paddingTop: padding, overflow: 'visible' }}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ])}
        >
          <View
            style={[
              styles.contentContainer,
            ]}
          >
            {this.props.children}
            <View style={{height: Layout.isIOS ? 108 : 138}}></View>
          </View>
        </ScrollView>
      );
    }
  };

  renderContentAreaList = () => {
    if (this.props.data && this.props.renderItem) {
      let headerHeight = HEADER_HEIGHT;
      return (
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          renderItem={this.props.renderItem}
          ListHeaderComponent={
            <View style={{ width: 100 * vw, height: headerHeight }} />
          }
          data={this.props.data}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ])}
        />
      );
    }
  };

  renderCustomContentAreaList = () => {
    if (this.props.customContentArea) {
      let headerHeight = HEADER_HEIGHT;
      let paddingTop = headerHeight + 98 - (isIphoneX() ? -2 : 20);
      let height = 100 * vh + 125;
      if(!Layout.isIOS){
        height= height - 30;
        headerHeight += 30;
      }

      const top = this.state.scrollY.interpolate({
        inputRange: [-headerHeight, headerHeight],
        outputRange: [headerHeight, -headerHeight],
        extrapolate: "clamp"
      });
      return (
        <Animated.View
          style={[
            styles.contentContainer,
            {
              height: height,
              marginTop: top,
              paddingTop: paddingTop,
              backgroundColor: Colors.backgroundColor
            }
          ]}
        >
          {this.props.children}
        </Animated.View>
      );
    }
  };
  render() {
    return (
      <View style={styles.outerContainer}>
        {this.renderIOSBigTitle()}
        <View
          style={[
            styles.innerContainer,
            { height: 100 * vh + BOTTOM_OFFSET }
          ]}
        >
          {this.renderContentArea()}
          {this.renderContentAreaList()}
          {this.renderCustomContentAreaList()}
        </View>
        {this.renderTitleArea()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    width: 100 * vw,
    backgroundColor: Colors.backgroundColor
  },
  titlePlaceholder: {
    height: 99,
    backgroundColor: 'transparent'
  },
  titleContainer: {
    width: 100 * vw,
    zIndex: 10,
    backgroundColor: Platform.OS == 'ios' ? 'transparent' :Colors.backgroundColor,
    position: "absolute",
    top: 0
  },
  iOSTitleContainer: {
    width: 100 * vw,
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 20
  },
  iOSTitle: {
    marginBottom: 13,
    fontSize: 17,
    lineHeight: 17,
    fontWeight: "bold",
    color: "#353535",
    backgroundColor: "rgba(0,0,0,0)"
  },
  iOSRightTitle: {
    paddingBottom: 15,
    position: 'absolute',
    right: 15
  },
  iOSBigTitleContainer: {
    position: "absolute",
    paddingTop: Platform.OS == 'ios' ? 0 :  headerHeight + statusBarHeight,
    top: Platform.OS == 'android' ? 0 :  headerHeight + statusBarHeight,
    left: 0,
    width: 100 * vw,
    height: HEADER_HEIGHT,
    backgroundColor: Colors.backgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingLeft: 15,
    paddingRight: 15,
    zIndex: 20
  },
  iOSBigTitle: {
    marginTop: 4,
    marginBottom: 8,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "bold",
    color: "#353535",
    backgroundColor: "rgba(0,0,0,0)"
  },
  iOSSubTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "bold",
    color: Colors.textGray
  },
  innerContainer: {
    position: "relative",
    width: 100 * vw,
    overflow: 'visible'
  },
  contentContainer: {
    width: 100 * vw,
    overflow: 'visible'
  }
});

module.exports = ViewWithTitle;
