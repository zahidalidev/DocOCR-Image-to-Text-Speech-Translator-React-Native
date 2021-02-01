import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { RFPercentage } from 'react-native-responsive-fontsize';

import colors from '../config/colors';
import SwipeCards from '../component/SwipeCards';
import { readTextFile, updateTextFile } from '../component/SaveFile';
import Card from '../component/Card';

function History(props) {

    const [data, setData] = useState([])
    const [render, setRender] = useState(false)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data.length === 0) {
            readData = async () => {
                setLoading(true)
                let data = await readTextFile();
                setData(data)
                setLoading(false)
            }
            readData()
        }

        setTimeout(getText = async () => {
            const data = await readTextFile();
            setData(data)
            setLoading(false)
        }, 5000)
    })


    const handleHistory = async (id) => {
        let oldData = data;
        oldData.splice(id, 1)
        setData(oldData)
        await updateTextFile(oldData)
        setRender(!render)
    }

    return (
        <ScrollView style={{ width: "100%" }} >
            <Spinner
                color={colors.primary}
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: colors.primary, marginTop: -RFPercentage(5) }}
            />

            <View >
                {data.map((item, i) => (
                    <Card key={i} onPress={handleHistory} description={item.data} date={item.date} id={i} />
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