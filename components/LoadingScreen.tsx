import React from 'react';
import {View, StyleSheet, Text} from 'react-native'

function LoadingScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.verticalLine} />
            <Text style={styles.topWords}> Project{'\n'} Plan</Text>
            <Text style={styles.bottomWords}> Your Planning {'\n'}            Solution</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    verticalLine: {
        width: 4,
        height: 750,
        backgroundColor: 'black',
        marginLeft: 20,

    },
    container:{
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
    },
    topWords:{
        color: 'black',
        position:'absolute',
        top: 110,
        left: 40,
        fontSize: 30,
    },
    bottomWords:{
        color: 'black',
        position: 'absolute',
        bottom: 110,
        right: 30,
        fontSize: 30
    }
    

});

export default LoadingScreen;