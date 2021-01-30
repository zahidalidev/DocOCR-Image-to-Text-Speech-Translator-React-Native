import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from 'expo-linear-gradient';

import SwipeCards from 'react-native-swipe-cards';
import colors from '../config/colors';
import { TouchableOpacity } from 'react-native';

class Card extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <LinearGradient start={{ x: 0.0, y: 1 }} end={{ x: 1, y: 1 }} locations={[0, 1, 0.6]} colors={['rgb(130, 198, 241)', "rgb(149, 196, 237)"]} style={{ marginTop: RFPercentage(4), borderRadius: RFPercentage(3), flex: 1, width: RFPercentage(40), height: RFPercentage(15) }}>
                <View style={{ padding: RFPercentage(3), flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }} >

                    <Text style={{ fontWeight: "bold", color: "white", fontSize: RFPercentage(2.3) }} >22 sep 2020</Text>
                    <View style={{ marginTop: RFPercentage(1), flexDirection: "row", justifyContent: "center", maxWidth: "80%" }} >
                        <Text numberOfLines={3} style={{ color: "white", fontSize: RFPercentage(2) }} >

                        </Text>
                    </View>
                </View>

                <LinearGradient start={{ x: 0.0, y: 1 }} end={{ x: 1, y: 1 }} locations={[0, 1, 0.6]} colors={['rgb(129, 188, 241)', "rgb(149, 196, 237)"]} style={{ alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), borderBottomLeftRadius: 100, borderTopLeftRadius: 100, top: -10, left: "80%", right: 0, bottom: 0, position: "absolute" }} >
                    <TouchableOpacity activeOpacity={0.1} >
                        <MaterialCommunityIcons size={RFPercentage(2.5)} name="delete" color="white" />
                    </TouchableOpacity>
                </LinearGradient>
            </LinearGradient>
        )
    }
}

class NoMoreCards extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text style={styles.noMoreCardsText}>No more cards</Text>
            </View>
        )
    }
}

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [
                { text: 'Tomato', backgroundColor: 'red' },
                { text: 'red', backgroundColor: 'green' },
                { text: 'black', backgroundColor: 'blue' },
                { text: 'green', backgroundColor: 'yellow' },
            ]
        };
    }

    handleYup(card) {
        console.log(`Yup for ${card.text}`)
    }
    handleNope(card) {
        console.log(`Nope for ${card.text}`)
    }
    handleMaybe(card) {
        console.log(`Maybe for ${card.text}`)
    }

    render() {
        return (
            <SwipeCards
                cards={this.state.cards}
                renderCard={(cardData) => <Card {...cardData} />}
                renderNoMoreCards={() => <NoMoreCards />}
                loop={false}
                handleYup={this.handleYup}
                handleNope={this.handleNope}
                // handleMaybe={this.handleMaybe}
                hasMaybeAction
            />
        )
    }
}

const styles = StyleSheet.create({
    card: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 300,
    },
    noMoreCardsText: {
        fontSize: 22,
    }
})