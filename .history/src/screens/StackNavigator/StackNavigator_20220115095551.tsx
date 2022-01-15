import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {LoginScreen} from '../../Authentication/LoginScreen';
import { RegisterScreen } from '../../Authentication/RegisterScreen';
import { ProtectedScreen } from '../../Authentication/ProtectedScreen';
import { AuthContext } from '../../context/AuthContext';

/*
import {PrimeraScreen} from '../Navigation/PrimeraScreen';
import {SegundaScreen} from '../Navigation/SegundaScreen';
import {TerceraScreen} from '../Navigation/TerceraScreen';
*/
 export type RootStackParams = {
     LoginScreen: undefined,
     RegisterScreen: undefined,
     ProtectedScreen : undefined
 }
 const RootStack = createNativeStackNavigator<RootStackParams>();
export const StackNavigator = () => {
    const ^status = useContext(AuthContext)

    return(
        <RootStack.Navigator
            screenOptions={{
                headerShown : false,
                headerStyle:{
                    backgroundColor: 'white'
                },
                contentStyle :{
                    backgroundColor: 'white'
                }
            }}

            initialRouteName="LoginScreen"
            
        >
            <RootStack.Screen name="LoginScreen" options={{title:"Login"}} component={LoginScreen} />
            <RootStack.Screen name="RegisterScreen" options={{title:"Registro"}} component={RegisterScreen} />
            <RootStack.Screen name="ProtectedScreen" options={{title:"Protected"}} component={ProtectedScreen} />
       
        </RootStack.Navigator>

    )
}