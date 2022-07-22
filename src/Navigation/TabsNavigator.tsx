import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Estadisticas } from '../screens/Estadisticas/Estadisticas';
// import {ReservaCitasFCScreen} from '../screens/ReservaCitas/ReservaCitasFCScreen';
import {ClientesScreen} from '../screens/Clientes/ClientesScreen';
import {PedidosScreen} from '../screens/Pedidos/PedidosScreen';


import { PerfilUsuario } from '../screens/Usuario/PerfilUsuarioScreen';
import { colores } from '../theme/appTheme';
import { Platform, Text, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GaleriaImagenes } from '../screens/GaleriaImagenes/GaleriaImagenes';
import { AvancesScreen } from '../screens/AvancesTratamiento/AvancesScreen';
import {HomeScreen} from '../screens/Home/HomeScreen'
import { ProductosScreen } from '../screens/Productos/ProductosScreen';

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
                    case 'Home' : 
                        iconName = 'home';
                    break;
                    case 'Clientes':
                        iconName = 'people';
                    break
                    case 'Pedidos':
                        iconName = 'shopping-bag';
                    break
                    case 'Productos':
                        iconName = 'inventory';
                    break
                    case 'Galeria' :
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
        <BottomTabAndroid.Screen name="Clientes" options = {{tabBarLabel : 'Clientes'}} component={ClientesScreen} />
        <BottomTabAndroid.Screen name="Pedidos" options = {{tabBarLabel : 'Pedidos'}} component={PedidosScreen} />
        <BottomTabAndroid.Screen name="Productos" component={ProductosScreen} />
        <BottomTabAndroid.Screen name="Galeria" options = {{tabBarLabel : 'Productos'}} component={AvancesScreen} />
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
            tabBarIcon: ({focused, color}) => {
                console.log(route.name)
                let iconName : string =""; 
                switch(route.name){
                    case 'Home' : 
                        iconName = 'home';
                    break;
                    case 'Clientes':
                        iconName = 'people';
                    break
                    case 'Pedidos':
                        iconName = 'shopping-bag';
                    break
                    case 'Productos':
                        iconName = 'inventory';
                    break
                    case 'Galeria' :
                        iconName = 'visibility'
                    break

                }
                return <Text><Icon name={iconName} size={22} color={color} /></Text>;
            },
        }) }
    >
        <BottomTabIOS.Screen name="Home" options = {{tabBarLabel : 'Home'}} component={HomeScreen} />
        <BottomTabIOS.Screen name="Clientes" options = {{tabBarLabel : 'Clientes'}} component={ClientesScreen} />
        <BottomTabIOS.Screen name="Pedidos" options = {{tabBarLabel : 'Pedidos'}} component={Estadisticas} />
        <BottomTabIOS.Screen name="Productos"  options={{tabBarLabel : 'Productos'}} component={ProductosScreen} />
        <BottomTabIOS.Screen name="Galeria" options = {{tabBarLabel : 'Galeria'}} component={AvancesScreen} />
    </BottomTabIOS.Navigator>
  );
}