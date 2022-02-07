import React, { useState } from 'react';
import { KeyboardAvoidingView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomSwitch } from '../../components/CustomSwitch';
import { styles } from '../../theme/appTheme';
import { CustomAlert } from '../../components/CustomAlert';
export const PerfilUsuario = () => {
    
    const {top} = useSafeAreaInsets();
    const [state, setState] = useState({
        isActive : true, 
        isHungry : false,
        isHappy : true
    })

    const {isActive, isHungry, isHappy} = state;

    const [inputState, setInputState] = useState({
        name : '',
        email : '',
        phone : '',
    })

    const onChange= (value : boolean, field : string) => {
        setState({
            ...state, 
            [field]: value
        })
    }
    const onInputChange = (value : string , field : string) => {
        setState({
            ...state, 
            [field]: value
        })
    }
    return( 
        <KeyboardAvoidingView
            behavior=''
        >
            <View style = {{
                ...styles.globalMargin,
                top : top+10,
            }}>
                <Text style = {styles.title}>Perfil de Usuario</Text>
                <CustomSwitch isOn={false} onChange={(value) => onChange(value, 'isActive')}/>
                <Text > {JSON.stringify(state, null, 5)}</Text>
                <TextInput 
                    style = {styles.inputStyle}
                    placeholder='nombre'
                    onChangeText={(value) => onInputChange(value, 'name')}
                />
                <TextInput 
                    style = {styles.inputStyle}
                />
                <TextInput 
                    style = {styles.inputStyle}
                />
                <TextInput 
                    style = {styles.inputStyle}
                />
                <TextInput 
                    style = {styles.inputStyle}
                />
                <CustomAlert
                    alertTitle = "Alerta"
                    message = "Esta es una alerta"
                    buttons = {[
                        {
                            text: 'Cancelar',
                            onPress: () => console.log('Cancel Pressed'),
                        
                        },
                        { text: 'OK', onPress: () => console.log('OK Pressed') }
                    ]}
                    buttonText = "Aceptare"
                />  
                <Text>{JSON.stringify(inputState, null, 5)}</Text>
            </View>
        </KeyboardAvoidingView>
            
            
            
        );
};
