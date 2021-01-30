import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { StyleSheet, View, Text } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

import colors from '../config/colors';
import SwipeCards from '../component/SwipeCards';

function History(props) {

    const saveFile = async () => {
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

        if (status === "granted") {
            let fileUri = FileSystem.documentDirectory + "DocOcrHistory.txt";

            let res = await FileSystem.readAsStringAsync(fileUri)
            let fileResponce = JSON.parse(res)
            console.log(fileResponce.data)


            // await FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ "data": "zahid", "date": "date" }));
            // const asset = await MediaLibrary.createAssetAsync(fileUri)
            // await MediaLibrary.createAlbumAsync("Download", asset, false)
        }
    }

    return (
        <ScrollView style={{ width: "100%" }} >
            <View>
                <SwipeCards style={{ width: "100%", flex: 1 }} />
            </View>
            <View >
                <SwipeCards style={{ width: "100%", flex: 1 }} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {

    }
})

export default History;