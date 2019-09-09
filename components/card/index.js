import React from "react";
import { View, StyleSheet } from "react-native";
import Images from "../../constants/Images";
import { Card } from "react-native-elements";
import { AvenirText } from "../text/StyledText";
import CustomImage from "../image";

export default class CardComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card
        {...this.props}
        image={null}
        containerStyle={[styles.containerStyle, this.props.containerStyle]}
      >
        {this.props.image ? ( <CustomImage source={{uri:this.props.image}} style={styles.image} /> ) : ( <CustomImage source={Images.imagePlaceholder} style={styles.image} /> )}
        
        <View style={styles.contentContainer}>
          <AvenirText style={styles.titleCard}>
            {this.props.header}
          </AvenirText>
          {this.props.children}
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    shadowColor: 'transparent',
    paddingHorizontal: 0,
    paddingBottom: 0,
    paddingTop: 0,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 8,
    overflow: 'hidden'
  },
  image:{
    width: '100%',
    height: 200
  },
  titleCard: {
    marginTop: 5,
    fontSize: 16
  },
  contentContainer:{
    paddingBottom: 10,
    paddingHorizontal: 10
  }
});
