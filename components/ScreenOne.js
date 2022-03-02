import * as React from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { WebView } from "react-native-webview";

export default function ScreenOne({navigation, route}) {  
    const params = route.params;
    console.log(params.paramName);
    return (
      <View style={styles.screenOne}>
            <WebView
                source={{uri: params.paramName}}/>
      </View>
    );
  }

const styles = StyleSheet.create({
    screenOne: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
  });