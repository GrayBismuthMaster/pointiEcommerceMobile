import React, { useContext } from 'react'
import { KeyboardAvoidingView, Text, View } from 'react-native';
import PedidoContext from '../../context/pedidos/PedidoContext';

const Total = () => {
  const pedidoContext = useContext(PedidoContext)
  const {total}:any = pedidoContext;
  
  return (
    <KeyboardAvoidingView 
        style={{
            flexDirection : 'row',
            justifyContent : 'space-between',
            alignItems : 'center',
            padding : 10,
            borderWidth : 1,
            borderColor : 'white',
            borderRadius : 10,
            backgroundColor : 'rgba(0,0,0,0.5)',
            marginTop : 10,
            marginBottom : 10,
            marginLeft : 10,
            marginRight : 10,
        }}
    >
        <Text 
            style={{
                fontSize : 20,
                color : 'white',
                fontWeight : 'bold',
                textAlign : 'center'
            }}

        >Total a pagar: </Text>
        <Text
            style={{
                fontSize : 20,
                color : 'white',
                fontWeight : 'bold',
                textAlign : 'center'
            }}
        >$ {total}</Text>
    </KeyboardAvoidingView>
  )
}

export default Total