import React from "react";
import { Modal, StyleSheet, View, Image } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import * as Icon from '@expo/vector-icons';
import { AvenirFormattedMessage } from "../text/StyledText";
import { iOSColors } from "react-native-typography";
import { withGlobalize } from "react-native-globalize";
import {
  formatMessage
} from "../../utils/format"

const slides = [
  {
    key: "intro_1",
    title: "intro_1_title",
    text: "intro_1_description",
    image: require("../../assets/images/intro/1.0/account_summary.png"),
    backgroundColor: iOSColors.tealBlue
  },
  {
    key: "intro_2",
    title: "intro_2_title",
    text: "intro_2_description",
    image: require("../../assets/images/intro/1.0/transactions.png"),
    backgroundColor: iOSColors.green
  },
  {
    key: "intro_3",
    title: "intro_3_title",
    text: "intro_3_description",
    image: require("../../assets/images/intro/1.0/plans.png"),
    backgroundColor: iOSColors.orange
  },
  {
    key: "intro_4",
    title: "intro_4_title",
    text: "intro_4_description",
    image: require("../../assets/images/intro/1.0/settings.png"),
    backgroundColor: iOSColors.purple
  },
  {
    key: "intro_5",
    title: "intro_5_title",
    text: "intro_5_description",
    image: require("../../assets/images/intro/1.0/pincode.png"),
    backgroundColor: iOSColors.red
  },
  {
    key: "intro_6",
    title: "intro_6_title",
    text: "intro_6_description",
    image: require("../../assets/images/intro/1.0/categories.png"),
    backgroundColor: iOSColors.pink
  },
  {
    key: "intro_7",
    title: "intro_7_title",
    text: "intro_7_description",
    image: require("../../assets/images/intro/1.0/icon_packs.png"),
    backgroundColor: iOSColors.yellow
  },
];

class AppIntro extends React.Component {
  constructor(props) {
		super(props);
    this.state = {
      modalVisible: false
		};
		
		if(this.props.onRef){
			this.props.onRef(this);
		}
  }
  
  componentDidMount(){
    if (this.props.autoShow){
      this.setState({
        modalVisible: true
      })
    }
  }
	
	_toggleShowHide = (state)=>{
		this.setState({ modalVisible: state });
	}

  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon.Ionicons
          name="md-arrow-round-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
          style={{ backgroundColor: "transparent" }}
        />
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon.Ionicons
          name="md-checkmark"
          color="rgba(255, 255, 255, .9)"
          size={24}
          style={{ backgroundColor: "transparent" }}
        />
      </View>
    );
  };
  _renderItem = (item) => {
    return (
      <View style={{ ...styles.slide , backgroundColor: item.backgroundColor}}>
        <Image
          style={styles.image}
          source={item.image}
          resizeMode="contain"
        />
        <View style={{flex: 1, paddingHorizontal: 20}}>
          <AvenirFormattedMessage weight="demi" style={styles.title} message={item.title}/>
          <AvenirFormattedMessage style={styles.text} message={item.text}/>
        </View>
      </View>
    );
  }
  render() {
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={this.state.modalVisible}
      >
        <AppIntroSlider
          slides={slides}
          renderItem={this._renderItem}
          skipLabel={formatMessage(this.props.globalize, 'common_skip')}
          showSkipButton={true}
          renderDoneButton={this._renderDoneButton}
          renderNextButton={this._renderNextButton}
          onDone={() => {
            this.setState({ modalVisible: false });
            if (this.props.callback){
              this.props.callback();
            }
          }}
        />
      </Modal>
    );
  }
}

export default withGlobalize(AppIntro);
const styles = StyleSheet.create({
	slide: {
		alignItems:'center',
		justifyContent: 'center',
    flex: 1,
    paddingTop: 50
	},
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0, 0, 0, .2)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: '80%',
    height: '70%',
  },
  title:{
    color: '#fff',
    fontSize: 28,
    textAlign: 'center'
  },
  text:{
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  }
});
