import Carousel, {Pagination} from 'react-native-snap-carousel';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {HomeSuggestionButton} from "../buttons/HomeSuggestionButton";
import {iOSColors} from "react-native-typography";
import Screens from "../../constants/Screens";
import { withNavigation } from 'react-navigation';

const horizontalMargin = 10;
const slideWidth = Dimensions.get("window").width * 80 / 100;
const sliderWidth = Dimensions.get("window").width;
const itemWidth = slideWidth - horizontalMargin * 2;

class HomeSuggestions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [
        {
          title: "suggestion_0_title",
          description: "suggestion_0_description",
          image: require('../../assets/images/common/star_icon.png'),
          onPress: () => this.props.showIntro()
        },
        {
          title: "suggestion_1_title",
          description: "suggestion_1_description",
          image: require('../../assets/images/common/plant_icon.png'),
          colors: ['#F2994A', '#F2C94C'],
          onPress: ()=> this.props.navigation.navigate(Screens.RepeatTransactionList)
        },
        {
          title: "suggestion_2_title",
          description: "suggestion_2_description",
          image: require('../../assets/images/common/debt_icon.png'),
          colors: ['#B785F6', '#5B60EF'],
          onPress:  ()=> this.props.navigation.navigate(Screens.ContactList)
        },
        {
          title: "suggestion_3_title",
          description: "suggestion_3_description",
          image: require('../../assets/images/common/fingerprint_icon.png'),
          colors: [iOSColors.green, '#5B60EF'],
          onPress: ()=>  this.props.navigation.navigate(Screens.Settings)
        }
      ],
      activeSlide: 0
    }
  }

  _renderItem({item, index}) {
    return (
      <HomeSuggestionButton
        title={item.title}
        link={item.link}
        colors={item.colors}
        description={item.description}
        image={item.image}
        onPress={item.onPress}
      />
    );
  }

  render() {
    return (
      <View>
        <View style={styles.container}>
          <Carousel
            layout={'default'}
            ref={(c) => {
              this._carousel = c;
            }}
            data={this.state.items}
            renderItem={this._renderItem}
            windowSize={sliderWidth}
            layoutCardOffset={0}
            sliderWidth={sliderWidth}
            activeSlideAlignment={'start'}
            itemWidth={itemWidth}
            activeSlideOffset={0}
            inactiveSlideScale={1}
            onSnapToItem={(index) => this.setState({activeSlide: index})}
            slideStyle={{marginRight: 10}}
            containerCustomStyle={{paddingHorizontal: 15}}
          />
        </View>
      </View>
    );
  }
}

export default withNavigation(HomeSuggestions)

const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  },
});
