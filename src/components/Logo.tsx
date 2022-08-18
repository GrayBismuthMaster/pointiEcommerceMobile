import React from 'react'
import { Image, View } from 'react-native'

export const Logo = () => {
    return (
        <View 
            style={{
                alignItems: 'center'
            }}
        >
            <Image
                source={require('../assets/Home/Logo.jpeg')}
                style={{
                    width: 110,
                    height: 100,
                    borderRadius : 10
                }}
            >
                
            </Image>
        </View>
    )
}
