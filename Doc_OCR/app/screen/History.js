import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { StyleSheet, View, Text } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

import colors from '../config/colors';
import SwipeCards from '../component/SwipeCards';
import { readTextFile } from '../component/SaveFile';
import Card from '../component/Card';

function History(props) {

    const [data, setData] = useState([])

    useEffect(() => {
        setTimeout(getText = async () => {
            const data = await readTextFile();
            setData(data)
        }, 5000)
    })


    const handleHistory = (id) => {
        console.log(id)
    }

    return (
        <ScrollView style={{ width: "100%" }} >
            <View >
                {data.map((item, i) => (
                    <Card onPress={handleHistory} description={item.data} date={item.date} id={i} />
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {

    }
})

export default History;