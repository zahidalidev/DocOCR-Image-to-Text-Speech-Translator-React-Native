import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { TouchableWithoutFeedback } from 'react-native';

function Card({ description, date, id, onPress }) {
    const gradColors = [
        {
            color1: "#81c5f1",
            color2: "#8cadf4",
            color3: "rgb(149, 196, 237)",
        },
        {
            color1: "#c5c6c9",
            color2: "#949caa",
            color3: "#949caa",
        },
        {
            color1: "#bcd6cd",
            color2: "#9fcebe",
            color3: "#9fcebe",
        },

    ]

    const index = id % 3;

    const ListItemDeleteAction = () => {
        return (
            <TouchableWithoutFeedback key={id + 'i'} onPress={() => onPress(id)} >
                <View style={styles.container}>
                    <MaterialCommunityIcons name="trash-can" size={RFPercentage(4)} color="#d36969" />
                </View>
            </TouchableWithoutFeedback>
        );
    }

    return (
        <Swipeable key={id} renderRightActions={ListItemDeleteAction} >
            <View style={{
                width: "83%", marginLeft: "8%", borderWidth: 0.7, borderColor: gradColors[index].color1, backgroundColor: "#e2e2e2",
                marginTop: RFPercentage(2), borderRadius: RFPercentage(3), flex: 1, height: RFPercentage(15)
            }}>
                <View style={{ padding: RFPercentage(3), flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }} >
                    <Text style={{ fontWeight: "bold", color: "black", fontSize: RFPercentage(2.3) }} >{date}</Text>
                    <View style={{ marginTop: RFPercentage(1), flexDirection: "row", justifyContent: "center", maxWidth: "80%" }} >
                        <Text numberOfLines={3} style={{ color: "black", fontSize: RFPercentage(2) }} >
                            {description}
                        </Text>
                    </View>
                </View>

                <LinearGradient start={{ x: 0.0, y: 1 }} end={{ x: 1, y: 1 }} locations={[0, 1]} colors={[gradColors[index].color1, gradColors[index].color3]} style={{ alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), borderBottomLeftRadius: 100, borderTopLeftRadius: 100, top: -5, left: "85%", right: 0, bottom: 0, position: "absolute" }} >
                    <TouchableOpacity activeOpacity={0.1} >
                        <MaterialCommunityIcons size={RFPercentage(2.8)} name="chevron-left" color="white" />
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "#d36969",
        width: "16%",
        marginRight: "8%",
        marginLeft: -RFPercentage(5),
        justifyContent: "center",
        alignItems: "center"
    }
})

export default Card;