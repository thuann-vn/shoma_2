import React, { Component} from 'react';
import ReactNative, {Easing, Animated, StyleSheet, Modal, View, TouchableOpacity, PanResponder} from 'react-native';
import { BlurView } from 'expo-blur';
import { AvenirFormattedMessage } from '../text/StyledText';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

const modalOffsetTop = Layout.isIOS && Layout.isIphoneX ? 150 : 50;
const screenHeight = Layout.window.height;
const backgroundIntensity = 90;
const AnimatedBlurView = ReactNative.Animated.createAnimatedComponent(BlurView);

export class AnimatedModal extends Component {
    _results = [];
    _requests = [];

    state= {};
    constructor(props){
        super(props);

        this.state = {
            value: {},
            modalVisible: this.props.visible || false,
            intensity: new ReactNative.Animated.Value(0),
            disabledSwipeDown: false
        };

    }

    componentDidMount(){
        if (this.state.modalVisible) {
            this._setModalVisible(true);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.modalVisible !== nextProps.visible) {
            this._setModalVisible(nextProps.visible);
        }
        if (nextProps.disabledSwipeDown != this.state.disabledSwipeDown) {
            this.setState({ disabledSwipeDown: nextProps.disabledSwipeDown });
        }
    }

    _animatedValue = new Animated.Value(screenHeight);

    _onDismiss = ()=>{}

    _panResponder = PanResponder.create({
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => true,
        onPanResponderMove: (evt, gestureState) => {
            this._animatedValue.setValue(gestureState.dy > 0 ? gestureState.dy : 0);
        },
        onPanResponderRelease: (e, { dy}) => {
            //If swipe to 1/2 screen height -> hide modal
            if (Math.abs(dy) >= 0.3 * screenHeight) {
                this._setModalVisible(false)
            } else {
                //Make the panel go back
                Animated.spring(this._animatedValue, {
                    toValue: 0,
                    bounciness: 10
                }).start();
            }
        },
        onPanResponderTerminate: () => {

        },
    });

    _setModalVisible(visible) {
        if(visible){
            Animated.timing(this._animatedValue, {
                toValue: 0,
                bounciness: 20,
                duration: 200,
            }).start(()=>{
            });
        }else{
            Animated.timing(this._animatedValue, {
                toValue: screenHeight,
                duration: 200,
            }).start();

            if (this.props.onHideModal){
                this.props.onHideModal();
            }
        }
        this._animateBackdrop(visible);
    }

    //Aniate backdrop
    _showHideBackdrop = (isShow, callback) => {
        setTimeout(() => {
            ReactNative.Animated.timing(this.state.intensity, {
                duration: 500,
                toValue: isShow ? 1 : 0,
                easing: Easing.linear
            }).start(() => {
                if (callback) {
                    callback();
                }
            });
        }, 300);
    }
    _animateBackdrop = (isShow, callback) => {
        this._showHideBackdrop(isShow, callback);
        this.setState({ modalVisible: isShow });
    }

    //Done button
    _doneButton = ()=>{
        this._animateBackdrop(false, ()=>{
            if(this.props.onDonePress){
                this.props.onDonePress();
            }
        })
    }

    //Render header with search input
    _renderHeader = () => {
        if(this.props.customHeader){
            return(
                <View style={styles.searchBarWrap}>
                    {this.props.customHeader()}
                </View>
            )
        }
        
        return (
            <BlurView style={styles.searchBarWrap} intensity={100} tint='light'>
                <View style={{ ...styles.header, alignItems: this.props.hideDoneButton ? 'center' : 'flex-start'}}>            
                    <AvenirFormattedMessage weight='demi' style={styles.headerTitle} message={this.props.title}></AvenirFormattedMessage>
                    {!this.props.hideDoneButton?(
                        <TouchableOpacity style={styles.doneButton} onPress={this._doneButton}>
                            <AvenirFormattedMessage weight="demi" style={{ fontSize: 16, color: Colors.mainColor }} message={this.props.doneButtonLabel || 'done'}></AvenirFormattedMessage>
                        </TouchableOpacity>
                    ):null}
                </View>
                {this.props.searchInputComponent?this.props.searchInputComponent():null}
            </BlurView>
        );
    };

    //MAIN VIEW 
    render() {
        let contentStyle = { ...styles.content, ...this.props.contentContainerStyle, transform: [{ translateY: this._animatedValue }] };
        let handlerStyle = { ...styles.handlerWrap, transform: [{ translateY: this._animatedValue }] };
        let modalOverlayStyle = styles.hideModalOverlay;

        if(this.props.height){
            contentStyle.flex = 0;
            contentStyle.height = this.props.height;

            handlerStyle.top =  Layout.window.height - this.props.height;
            modalOverlayStyle.height = Layout.window.height - this.props.height;
        }

        return (
            <Modal
                    hardwareAccelerated={true}
                    animationType="slide"
                    presentationStyle='overFullScreen'
                    visible={this.state.modalVisible}
                    transparent={true}
                    onRequestClose = {() => {}}
                >   
                    <ReactNative.Animated.View style={{opacity: this.state.intensity,...styles.backdropContainer}}/>
                    <View style={{ flex: 1, position: 'relative', justifyContent: 'flex-end', paddingTop: modalOffsetTop }}>
                        <TouchableOpacity style={modalOverlayStyle} onPress={()=>{this._setModalVisible(false)}}></TouchableOpacity>
                        <ReactNative.Animated.View style={contentStyle}>
                            {this.props.children}
                            {this._renderHeader()}
                        </ReactNative.Animated.View>
                    </View>
                    <ReactNative.Animated.View style={handlerStyle} {...this._panResponder.panHandlers}>
                        <View style={styles.handler}></View>
                    </ReactNative.Animated.View>  
                </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'rgba(0,0,0,.5)',
    },
    content: {
        flex:1,
        position: 'relative',
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        overflow: 'hidden',
        maxHeight: Layout.window.height,
    },
    header:{
        height: 45,
        paddingTop: 14,
        paddingLeft: 15,
        paddingBottom: 0,
        // backgroundColor: '#F8F8F8',
    },
    headerTitle: {
        textAlign: 'left',
        fontSize: 18,
    },
    searchBarWrap:{
        position:'absolute',
        top: 0,
        left: 0,
        right: 0, 
        zIndex: 1000
    },
    doneButton:{
        position: 'absolute',
        right: 20, 
        top: 15
    },
    handlerWrap:{
        height: 30,
        position: 'absolute',
        left: '50%',
        marginLeft: -30,
        top: modalOffsetTop,
        width: 60,
        zIndex: 200,
    },
    handler: { 
        height: 5, 
        borderRadius: 6, 
        backgroundColor: '#E4E4E5', 
        opacity: .9,
        marginTop: 5
    },
    hideModalOverlay:{
        height: modalOffsetTop,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0
    },
    backdropContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0, .5)'
    }
  });