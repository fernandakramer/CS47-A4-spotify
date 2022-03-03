import * as React from 'react';
import { Text, View, StyleSheet} from 'react-native';
import { WebView } from "react-native-webview";


export default function ScreenTwo({ navigation, route}) {  
    const params = route.params;
    console.log(params.paramName);
    return (
        <WebView
            source={{uri: params.paramName}}/>
    );
  }

const styles = StyleSheet.create({
    screenOne: {
        flex: 1, 
        width : '100%',
        alignItems: 'center', 
        justifyContent: 'center',
    }
  });