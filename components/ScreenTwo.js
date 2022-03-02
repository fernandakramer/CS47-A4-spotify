import * as React from 'react';
import { Text, View, StyleSheet} from 'react-native';
import { WebView } from "react-native-webview";

//import GoBackButton from './GoBack';


export default function ScreenTwo({ navigation, route}) {  
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
        width : '100%',
        alignItems: 'center', 
        justifyContent: 'center',
    },
    nav_bar: {
        maxHeight: '15%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    back: {
        maxWidth: '15%',
        alignSelf: 'center',
    },
    title_box: {
        width: '85',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    title: {
        color: 'white',
        fontFamily: "ArialRoundedMTBold",
        fontSize: 11,
        textAlign: 'center',
    },
    sound: {
        justifyContent:'center',
    }
  });