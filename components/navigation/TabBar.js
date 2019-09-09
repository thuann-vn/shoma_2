import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { BottomTabBar } from 'react-navigation-tabs';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import { Platform } from '@unimodules/core';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0, 
        backgroundColor: 'transparent'
    },
    bottomTabBar: {
        backgroundColor: Colors.mainColor,
        position: 'relative',
        zIndex: 1,
        paddingTop: 12,
    },
});

export default function TabBar(props) {
    return (
        <View style={styles.container}>
            <BottomTabBar {...props} style={styles.bottomTabBar} onTabLongPress={()=>{}}/>
        </View>
    );
}