import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { StyleSheet, View, Text } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

import colors from '../config/colors';

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
        <ScrollView >
            <Text>Zahi </Text>
            <TouchableOpacity style={{ width: "30%", flex: 1, marginTop: 100, padding: RFPercentage(2), backgroundColor: colors.primary }} onPress={() => saveFile()} >
                <Text style={{ color: "white" }} >save</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {

    }
})

export default History;