import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { StyleSheet, View } from 'react-native';


import colors from '../config/colors';
import SwipeCards from '../component/SwipeCards';
import { readTextFile, updateTextFile } from '../component/SaveFile';
import Card from '../component/Card';

function History(props) {

    const [data, setData] = useState([])
    const [render, setRender] = useState(false)

    useEffect(() => {
        setTimeout(getText = async () => {
            const data = await readTextFile();
            setData(data)
        }, 5000)
    })


    const handleHistory = async (id) => {
        let oldData = data;
        oldData.splice(id, 1)
        setData(oldData)
        setRender(!render)
        await updateTextFile(oldData)
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