import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Estadisticas } from '../screens/Estadisticas/Estadisticas';
import {ReservaCitasFCScreen} from '../screens/ReservaCitas/ReservaCitasFCScreen';
import { PerfilUsuario } from '../screens/Usuario/PerfilUsuarioScreen';
import { colores } from '../theme/appTheme';
import { Platform, Text, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GaleriaImagenes } from '../screens/GaleriaImagenes/GaleriaImagenes';
import { AvancesScreen } from '../screens/AvancesTratamiento/AvancesScreen';
import {HomeS}

export const TabsNavigator = () =>{
    return Platform.OS === 'ios' 
        ? <TabsIOSNavigator/>
        : <TabsAndroidNavigator/>
}


const BottomTabAndroid = createMaterialBottomTabNavigator();

const TabsAndroidNavigator = () => {
return (
    <BottomTabAndroid.Navigator
        sceneAnimationEnabled ={true}
        barStyle = {{
            backgroundColor: colores.primary,
            
        }}
        style ={{
            flex: 1,

            
        }}
                
        screenOptions={({route}) =>({           
            tabBarIcon: ({focused, color}) => {
                console.log(route.name)
                let iconName : string =""; 
                switch(route.name){
                    case 'Reserva de Citas':
                        iconName = 'event-note';
                    break
                    case 'Historial de visitas':
                        iconName = 'pie-chart';
                    break
                    case 'Perfil Usuario':
                        iconName = 'account-box';
                    break
                    case 'Avance del tratamiento' :
                        iconName = 'visibility'
                    break

                }
                return <Text><Icon name={iconName} size={22} color={color} /></Text>;
            },
            tabBarOptions : {
                tabStyle : {
                    fontSize : 25
                }
            }
        }) }


    >
        <BottomTabAndroid.Screen name="Home" options = {{tabBarLabel : 'Home'}} component={HomeScreen} />
        <BottomTabAndroid.Screen name="Reserva de Citas" options = {{tabBarLabel : 'Reserva de citas'}} component={ReservaCitasFCScreen} />
        <BottomTabAndroid.Screen name="Historial de visitas" options = {{tabBarLabel : 'Estadísticas'}} component={Estadisticas} />
        <BottomTabAndroid.Screen name="Perfil Usuario" component={PerfilUsuario} />
        <BottomTabAndroid.Screen name="Avance del tratamiento" options = {{tabBarLabel : 'Avances'}} component={AvancesScreen} />
     </BottomTabAndroid.Navigator>
);
}



//IOS
const BottomTabIOS = createBottomTabNavigator();

const TabsIOSNavigator = () => {
  return (
    <BottomTabIOS.Navigator
        sceneContainerStyle = {{
            backgroundColor: colores.background
        }}
        screenOptions={({route}) =>({
            tabBarIcon: ({focused, color, size}) => {
                console.log(route.name)
                let iconName : string =""; 
                switch(route.name){
                    case 'Reserva de Citas':
                        iconName = 'T1';
                    break
                    case 'Estadisticas':
                        iconName = 'T2';
                    break
                    case 'Perfil Usuario':
                        iconName = 'T3';
                    break

                }
                return <Text style={{color}}>{iconName}</Text>
            }
        }) }
    >
        <BottomTabIOS.Screen name="Reserva de Citas" component={ReservaCitasScreen}  />
        <BottomTabIOS.Screen name="Estadisticas" component={Estadisticas} />
        <BottomTabIOS.Screen name="Perfil Usuario" component={PerfilUsuario} />
        <BottomTabIOS.Screen name="Avance del tratamiento" options = {{tabBarLabel : 'Avances'}} component={GaleriaImagenes} />
    </BottomTabIOS.Navigator>
  );
}