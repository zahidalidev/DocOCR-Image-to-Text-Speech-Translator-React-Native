import React from 'react';
import { StatusBar, Text } from 'react-native';

const RegularBanner = ({ text }) => (
    <>
        <StatusBar barStyle="light-content" backgroundColor="red" />
        <Text
            style={{
                color: 'white',
                fontSize: 15,
                fontWeight: 'bold',
                marginHorizontal: 20,
            }}>
            {text}
        </Text>
    </>
);

export const bannerConfig = (hideBanner, data) => {
    return {
        contentView: <RegularBanner text={data} />,
        backgroundColor: 'red',
        onPress: () => {
            hideBanner();
        },
    }
}