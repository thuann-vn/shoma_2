import React from 'react';
import {
    StyleSheet,
    View,
    Image
} from 'react-native';
import { AvenirText, AvenirFormattedMessage } from '../text/StyledText';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import LottieView from 'lottie-react-native';
import Layout from '../../constants/Layout';

export class EmptyState extends React.Component {
    render() {
        return (
          <View style={[styles.container, this.props.style]}>
            {this.props.animation ? (
              <LottieView
                source={this.props.animation}
                autoPlay
                loop
                style={styles.animation}
              />
            ) : (
              <Image
                style={styles.image}
                source={Images.emptyTransaction}
              />
            )}

            <AvenirFormattedMessage
              style={styles.title}
              weight="demi"
              message={this.props.title}
              {...this.props.extraData}
            />
            <AvenirFormattedMessage
              style={styles.description}
              message={this.props.description}
              {...this.props.extraData}
            />

            {this.props.button ? this.props.button : null}
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 40,
        paddingBottom: Layout.bottomOffset
    },
    image:{
        opacity: .8,
        marginBottom: 10,
    },
    animation:{
      width: '50%',
      marginBottom: 10
    },
    title:{
        fontSize: 20,
        marginBottom: 5,
        color: Colors.textGray,
        textAlign: 'center'
    },
    description: {
        color: Colors.textGray,
        textAlign: 'center'
    }
});
