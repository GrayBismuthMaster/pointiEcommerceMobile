import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { View, Text, Dimensions, StyleSheet, SafeAreaView, TouchableOpacity, Image, Platform } from 'react-native'
import PushNotification from 'react-native-push-notification';
import { useNotification } from '../../hooks/useNotification';
import { ChannelId } from '../../interfaces/appInterfaces';
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;

export const HomeScreen = () => {
    const {sendNotification} = useNotification({channelId : ChannelId.UNO, message : "prueba", title : "prueba inicial"})
    useEffect(() => {
      return () => {
        console.log("salida homeScreen");
      }
    }, [])

  const navigation = useNavigation();
  return (
    <SafeAreaView
        style={{
            flex: 1,
            flexDirection : 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginVertical : heightScreen * 0.035,
        }}
    >
        <TouchableOpacity
            activeOpacity={0.6}
            onPress = { () =>{
                // setNotificacion()
                sendNotification({channelId : ChannelId.UNO, message : "pRUBEA", title : "ASDAS"});
                // navigation.navigate(('Clientes' as any))
                
            }}
        >
            <View style = {styles.card}>
                <Image
                    source={{uri : 'https://images.pexels.com/photos/3801426/pexels-photo-3801426.jpeg?cs=srgb&dl=pexels-andrea-piacquadio-3801426.jpg&fm=jpg'}}
                    style={{height:'50%', width:'30%'}}
                />
                <Text style={styles.textCard}>CLIENTES</Text>
            </View>
            
        </TouchableOpacity>
        
        <TouchableOpacity
            activeOpacity={0.6}
            onPress = { () =>{
                // setNotificacion({channelId : ChannelId.UNO, title : "Desde pedidos", message : "Mensaje desde pedidos"})
                sendNotification({channelId : ChannelId.UNO, title : "Desde pedidos", message : "Mensaje desde pedidos"});
                // navigation.navigate(('Pedidos')as any)

            }}
        >
            <View style = {styles.card}>
                    <Image
                        source={{uri : 'https://images.pexels.com/photos/5980870/pexels-photo-5980870.jpeg?cs=srgb&dl=pexels-karolina-grabowska-5980870.jpg&fm=jpg'}}
                        style={{height:'50%', width:'30%'}}
                    />
                <Text style={styles.textCard}>PEDIDOS</Text>
             </View>
       
        </TouchableOpacity>
        
        <TouchableOpacity
            activeOpacity={0.6}
            onPress = { () =>{
                navigation.navigate(('Productos') as any)
            }}
        >
            <View style = {styles.card}>
                    <Image
                        source={{uri : 'https://images.pexels.com/photos/1667077/pexels-photo-1667077.jpeg?auto=compress&cs=tinysrgb&w=600'}}
                        style={{height:'50%', width:'30%'}}
                    />
                <Text style={styles.textCard}>PRODUCTOS</Text>
            </View>

        </TouchableOpacity>
         
        {/* <TouchableOpacity
            activeOpacity={0.6}
            onPress = { () =>{
                navigation.navigate('Avance del tratamiento')
            }}
        >
            <View style = {styles.card}>
                    <Image
                        source={{uri : 'https://images.pexels.com/photos/8090147/pexels-photo-8090147.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'}}
                        style={{height:'50%', width:'30%'}}
                    />
                <Text style={styles.textCard}>Avances del paciente en el tratamiento</Text>
            </View>
        </TouchableOpacity> */}
        
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    card : {
        
            width : widthScreen*.6,
            height : heightScreen*.2,
            backgroundColor : 'rgba(0, 0, 102, .5)',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius : 10,
            shadowColor: "#714a4a",
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.30,
            shadowRadius: 4.65,

            elevation: 8,

        
    },
    textCard : {
        fontSize : widthScreen * 0.05,
        fontWeight : 'bold',
        color : '#fff',
        textAlign : 'center',
        marginTop : heightScreen * 0.02,
    }
})