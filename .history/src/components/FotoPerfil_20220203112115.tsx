import React from 'react'
import { Image, View } from 'react-native'
interface Props {
    foto : string
}
export const FotoPerfil = ({foto} :Props) => {
    console.log(foto)
    const fotoPerfil = foto ? {uri: foto} : require('../../assets/img/foto-perfil.png')
    return (
        <View 
            style={{
                alignItems: 'center'
            }}
        >
            <Image
                source={require()}
                style={{
                    width: 110,
                    height: 100
                }}
            >
                
            </Image>
        </View>
    )
}
