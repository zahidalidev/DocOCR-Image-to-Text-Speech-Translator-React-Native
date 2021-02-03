import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Image } from 'react-native';

import colors from '../config/colors';
import { readTextFile, updateTextFile } from '../component/SaveFile';
import Card from '../component/Card';
import { Text } from 'react-native';
const noDoc = require("../../assets/noDoc.png")

function History({ onNavigate }) {

    const [data, setData] = useState([false])
    const [render, setRender] = useState(false)
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(-2000);

    useEffect(() => {
        if (data[0] === false) {
            readData = async () => {
                setLoading(true)
                let data = await readTextFile();
                if (data === undefined) {
                    setData([true])
                } else {
                    setData(data)
                }
                setLoading(false)
            }
            readData()
        }

        setTimeout(getText = async () => {
            const data = await readTextFile();
            if (data === undefined) {
                setData([true])
            } else {
                setData(data)
            }
            setLoading(false)
        }, 5000)
    })


    const handleDeleteHistory = async (id) => {
        let oldData = data;
        oldData.splice(id, 1)

        if (oldData.length === 0) {
            setData([true])
        } else {
            setData(oldData)
        }

        await updateTextFile(oldData)
        setRender(!render)
    }

    const handleHistoryCard = async (text) => {
        setCount(count + 1)
        onNavigate.navigate('ResultScreen', { data: text, count: count })
    }

    return (
        <ScrollView style={{ width: "100%" }} >
            <Spinner
                color={colors.primary}
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: colors.primary, marginTop: -RFPercentage(5) }}
            />

            {(data[0] === false || data[0] === true || data.length === 0) ?
                <View style={{ marginTop: RFPercentage(2), width: "100%", justifyContent: "center", alignItems: "center" }} >
                    <Image style={{ width: RFPercentage(22), height: RFPercentage(22) }} source={noDoc} />
                    <Text style={{ color: "grey", marginTop: RFPercentage(2), fontSize: RFPercentage(2.2) }} >No document</Text>
                </View>
                :
                <View >
                    {data.map((item, i) => (
                        <Card key={i} onHandleHistoryData={handleHistoryCard} onPress={handleDeleteHistory} description={item.data} date={item.date} id={i} />
                    ))}
                </View>
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {

    }
})

export default History;