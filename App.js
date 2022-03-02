import { StyleSheet, Text, SafeAreaView, Pressable , Image, FlatList, View} from "react-native";
import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "./utils/constants";
import Colors from './Themes/colors';
import millisToMinutesAndSeconds from './utils/millisToMinuteSeconds';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ScreenOne from './components/ScreenOne';
import ScreenTwo from './components/ScreenTwo';

// Endpoints for authorizing with Spotify
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token"
};

const Stack = createStackNavigator();


export default function App() {
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      scopes: SCOPES,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: REDIRECT_URI
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    if (token) {
      // myTopTracks(setTracks, token);
      albumTracks(ALBUM_ID, setTracks, token);
    }
  }, [token]);

  
 let contentDisplayed = null;

 if (token) {
    contentDisplayed = 
    <View>
      <View style={styles.header}>
        <Image style={styles.header_logo} source={require('./assets/spotify-logo.png')}></Image>
        <Text style={styles.header_text}>Album Tracks</Text>
      </View>
      <FlatList 
      data={tracks}
      renderItem={({item}) => (renderItem(item))}
      keyExtractor={(item) => item.id}> </FlatList>
    </View>
  }
  else {
    contentDisplayed = 
      <Pressable
      onPress={() => promptAsync()}
      style={({ pressed }) => [styles.home_button]}>
      
        <Image style={styles.logo} source={require('./assets/spotify-logo.png')}></Image>
        <Text style={styles.home_text}>
          CONNECT WITH SPOTIFY
        </Text>
       
      </Pressable> 
  }

  const renderItem = (item) => {
    console.log(item, "\n")
    return (
    <AlbumTracks
      track_number={item.track_number}
      artist={item.artists[0].name}
      url={item.album.images[0].url}
      song_title={item.name}
      album_name={item.album.name}
      duration={item.duration_ms}
      song_screen={item.external_urls.spotify}
      sound_preview={item.preview_url}/>
  )};

  function AlbumTracks({artist, url, song_title, album_name, duration, sound_preview, song_screen}) {
    const navigation = useNavigation();
    console.log(sound_preview);
    console.log(song_screen);
    return (
    <View style={styles.item}>
      <View style={styles.index_box}>
        <Pressable 
          onPress={() => navigation.navigate('ScreenOne', {paramName: sound_preview})}> 
          <Ionicons name="play-circle" size={30} color="green" />
        </Pressable>
      </View>
        <Image style={styles.album_box}
            source={{
              uri: url
            }}/>
        <View style={styles.song_title_artist}>
          <Pressable onPress={() => navigation.navigate('ScreenTwo', {paramName: song_screen})}>
            <Text numberOfLines={1} style={styles.bold_text}>{song_title}</Text>
            <Text style={styles.artist_text}>{artist}</Text>
          </Pressable>
        </View>
        <View style={styles.album_title_box}>
          <Text style={styles.bold_text}>{album_name}</Text>
        </View>
        <View style={styles.duration_box}>
          <Text style={styles.bold_text}>{millisToMinutesAndSeconds(duration)}</Text>
        </View>
    </View>

    );
  }

  function Home() {
    return (
      <SafeAreaView style={styles.container}>
        {contentDisplayed}
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ScreenOne" component={ScreenOne} />
        <Stack.Screen name="ScreenTwo" component={ScreenTwo} />
      </Stack.Navigator>
    </NavigationContainer>
  );


}


const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  home_button: {
    flexDirection: 'row',
    width: '55%',
    height: '5%',
    backgroundColor: 'green',
    justifyContent: 'center',
    borderRadius: 99999,
  },
  home_text: {
    flex: 10,
    color: 'white',
    fontFamily: "ArialRoundedMTBold",
    fontSize: 11,
    textAlign: 'center',
    marginRight: '7%',
    alignSelf: 'center'
  },
  logo :{
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginLeft: '7%'
  },
  header: {
    justifyContent: 'center',
    height: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  header_logo:{
    resizeMode: 'contain',
    alignSelf: 'center',
    maxHeight: '40%',
    maxWidth: '15%',
    flex: 1,
  },
  header_text: {
    color: 'white',
    fontFamily: "ArialRoundedMTBold",
    fontSize: 20,
    flex: 1,
    maxWidth: '40%'
  },
  item: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
  index_box: {
    flex: 1,
    maxWidth: '10%',
    alignSelf: 'center',
    marginHorizontal: 5,
    alignItems: 'center'
  },
  index_text: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Avenir',
    alignSelf: 'center',
  },
  album_box: {
    flex: 2, 
    resizeMode: 'contain',
    maxWidth: 50,
    maxHeight: '80%',
    paddingHorizontal: 10,
  },
  song_title_artist: {
    flex: 2.5,
    justifyContent: 'center',
    textAlign: 'left'
  },
  album_title_box: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  duration_box: {
    flex: 1,
    fontSize: 15,
    justifyContent: 'center',
  },
  bold_text: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingLeft: 10,
  },
  artist_text: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Avenir',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingLeft: 10
  }
});

