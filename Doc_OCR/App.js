/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';


import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useWindowDimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import HomeScreen from './app/screen/HomeScreen';
import AppDrawer from './app/component/AppDrawer';
import ReadTextScreen from './app/screen/ReadTextScreen';
import TranslateScreen from './app/screen/TranslateScreen';
import CameraScreen from './app/screen/CameraScreen';
import ResultScreen from './app/screen/ResultScreen';
import colors from './app/config/colors';
import TextToVoice from './app/screen/TextToVoice';

const Stack = createDrawerNavigator();


class App extends Component {
  state = {
    image: null,
  }

  getPermissionAsync = async () => {
    // Camera roll Permission 
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY());
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
    // Camera Permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });
  }


  imagePickerBody = (response, navigation) => {
    // Same code as in above section!
    if (response.cancelled) {
      console.log('User cancelled image picker');
      this.props.navigation.navigate('Home')
    }
    else if (response.error) {
      console.log('Image Picker Error: ', response.error);
    }

    else {
      // let source = { uri: response.uri };
      this.setState({ image: response })
      navigation.navigate('ResultScreen', { data: response })


      // You can also display the image using data:
      // let source = { uri: 'data:image/jpeg;base64,' + response.data };

      // response['uri'] = response.path;
      // response['name'] = response.fileName;

      // this.setState({
      //     avatarSource: source,
      //     pic: response,
      //     loading: true
      // });

      // this.uploadOnCloudinary(response)
    }
  }

  getImg = async (selection, navigation) => {
    this.getPermissionAsync()

    if (selection === "camera") {
      let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      let pickerResult = await ImagePicker.launchCameraAsync();
      this.imagePickerBody(pickerResult, navigation)

    } else {
      let permissionResult = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      let pickerResult = await ImagePicker.launchImageLibraryAsync();
      this.imagePickerBody(pickerResult, navigation)
    }

  }

  render() {
    return (
      <>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="TranslateScreen"
            drawerType={"front"}
            overlayColor="transparent"
            edgeWidth={100}
            drawerStyle={{
              backgroundColor: colors.white,
              width: "75%"
            }}
            drawerContent={(props) => <AppDrawer {...props} />}
          >

            {/* Two Method to navigate to components */}
            <Stack.Screen name="Home">{(props) => <HomeScreen {...props} onGetImg={this.getImg} />}</Stack.Screen>
            {/* <Stack.Screen name="CameraScreen">{(props) => <CameraScreen {...props} />}</Stack.Screen> */}
            <Stack.Screen name="ResultScreen">{(props) => <ResultScreen {...props} />}</Stack.Screen>
            <Stack.Screen name="ReadTextScreen" options={{ title: "ReadTextScreen" }} component={ReadTextScreen} />
            <Stack.Screen name="TextToVoice" options={{ title: "TextToVoice" }} component={TextToVoice} />
            <Stack.Screen name="TranslateScreen" options={{ title: "TranslateScreen" }} component={TranslateScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
};


export default App;
