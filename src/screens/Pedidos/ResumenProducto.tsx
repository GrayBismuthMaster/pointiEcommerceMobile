import React, { useContext, useState, useEffect } from 'react'
import { KeyboardAvoidingView, ScrollView, Text, TextInput, View } from 'react-native';
import PedidoContext from '../../context/pedidos/PedidoContext';

const ResumenProducto = ({producto}:any) => {
    //Context de Pedidos
    const pedidoContext = useContext(PedidoContext);
    const {cantidadProductos, actualizarTotal}:any = pedidoContext;
    const [cantidad, setCantidad] = useState(0);
    useEffect(()=>{
      actualizarCantidad();
      actualizarTotal();
    }, [cantidad])
    
    const actualizarCantidad = ()=>{
      const nuevoProducto = {...producto, cantidad: Number(cantidad)}
      cantidadProductos(nuevoProducto);
      console.log(nuevoProducto);
    }
    const {nombre, precio} = producto;
    console.log(nombre);
  return (
    
    <KeyboardAvoidingView 
    // style={{flex: 1}} 
    
>
        <View >
            <Text style={{
                color : '#000',
            }} >{nombre}</Text>
            <Text style={{
                color : '#000',
            }}>$ {precio}</Text>
        </View>
        <TextInput 
            keyboardType="numeric" 
            placeholder='Escribe aquí la cantidad' 
            style = {{
                color : 'black',
            }} 
            placeholderTextColor={"black"}
            onChangeText={(number)=>{
                setCantidad(parseInt(number));
            }}
        />
    </KeyboardAvoidingView>
  )
}

export default ResumenProducto