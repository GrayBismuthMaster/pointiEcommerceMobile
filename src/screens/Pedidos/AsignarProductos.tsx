import React, { useContext, useEffect, useRef, useState } from 'react'
import MultiSelect from 'react-native-multiple-select';
import {gql, useQuery} from '@apollo/client'
import { ScrollView, Text, TextInput, View, KeyboardAvoidingView, LogBox } from 'react-native';
import PedidoContext from '../../context/pedidos/PedidoContext';
import ResumenProducto from './ResumenProducto';
const OBTENER_PRODUCTOS = gql`
    query obtenerProductos{
        obtenerProductos{
            id
            nombre
            precio
            existencia
        }
    }
`


const AsignarProductos = () => {
    const multiSelectRef = useRef();
    const [productos, setProductos] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState<any>([]);
    //Consulta a la bsae de datos
    const {data, loading, error} = useQuery(OBTENER_PRODUCTOS);
    //CONTEXT
    
    const pedidoContext = useContext(PedidoContext);
    const {agregarProductos}:any = pedidoContext;

   
    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        console.log("productos del asignar producto",data);
        if (data) {
            const arrayNuevo = data.obtenerProductos.map((producto : any) => {
                return {
                    id: JSON.stringify({id : producto.id, nombre : producto.nombre, precio: producto.precio}),
                    name: `${producto.nombre} - ${producto.existencia}`,
                    price: producto.precio,
                    quantity: producto.existencia
                }
            })
            setProductos(arrayNuevo);
        }
      return () => {
        console.log("retorno")
        setProductos([]);
      }
    }, [data])
    
    useEffect(() => {
        if(productosSeleccionados){
            let productosEstadoGlobal : any= [];
            productosSeleccionados.map((producto : any)=>{
                productosEstadoGlobal.push(JSON.parse(producto))
            })
            console.log("Productos enviados al estado global",productosEstadoGlobal);
            agregarProductos(productosEstadoGlobal )
        }
        
      return () => {
        console.log("unmount")
      }
    }, [JSON.stringify(productosSeleccionados)])
    
    if (loading) return null;
    // const {obtenerProductos} = data;
    const seleccionarProductos = (selectedProductos:any)=>{
        // console.log(selectedProductos);
        // console.log("Productos seleccionados",JSON.parse(selectedProductos));
        setProductosSeleccionados([...selectedProductos]);
    }
  return (
    <>
        <KeyboardAvoidingView 
            style={{flex: 1}} 
            behavior="padding"
            enabled
            
        >
            <ScrollView
                style={{flex: 1}}
                // horizontal={true}
            >
                <MultiSelect
                    // hideTags
                    // tagTextColor='red'
                    items={productos}
                    uniqueKey={'id'}
                    ref={multiSelectRef}
                    onSelectedItemsChange={seleccionarProductos}
                    selectedItems={productosSeleccionados}
                    // selectText="Elige los productos"
                    searchInputPlaceholderText="Busca el item"
                    // onChangeInput={ (text)=> console.log(text)}
                    textInputProps={{
                        placeholder: 'Busca el item',
                        style: {
                            display: 'flex',
                            borderColor: 'white',
                            borderWidth: 1,
                            borderRadius: 30,
                            marginTop: 10,
                            marginBottom: 10,
                            paddingLeft: 20,
                            paddingRight: 10,
                            paddingTop: 10,
                            paddingBottom: 10,
                            color: 'black',
                            fontSize: 20,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            flexDirection : 'column'
                        }
                    }}
                    tagRemoveIconColor="red"

                />
                {
                    
                    <Text style={{
                        fontSize : 15,
                        marginVertical : 5
                    }}>                       
                        3. Ajustar las cantidades del producto
                    </Text>
                }
                {
                    productosSeleccionados.length > 0 ?
                    
                    productosSeleccionados.map((producto : any)=>{
                        return(
                                <KeyboardAvoidingView
                                    style={{
                                        flex : 1,
                                        flexDirection : 'column',
                                        justifyContent : 'center',
                                        alignItems : 'center',
                                        marginTop : 10,
                                        marginBottom : 10,
                                        marginLeft : 10,
                                        marginRight : 10,
                                        borderWidth : 1,
                                        borderColor : 'white',
                                        borderRadius : 10,
                                        backgroundColor : 'rgba(255,255,255,0.5)',
                                        padding : 10,
                                    }}

                                >
                                    <ResumenProducto
                                        key={JSON.parse(producto).id}
                                        producto={JSON.parse(producto)}
                                    />
                                </KeyboardAvoidingView>
                        )
                    })
                        
                    :
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: 'green'
                        }}
                    >
                        No hay productos seleccionados
                    </Text>
                }
                
            </ScrollView>
        </KeyboardAvoidingView>
        {/* <Select
            className='mt-3'
            options = {obtenerProductos}
            isMulti
            onChange={(option)=>seleccionarProductos(option)}
            getOptionValue = {(opciones)=>opciones.id}
            getOptionLabel = {(opciones)=>`${opciones.nombre} - ${opciones.existencia} Disponibles`}
            placeholder = {'Seleccione los productos'}
            noOptionsMessage = {"No hay resultados"}
        /> */}
    </>
  )
}

export default AsignarProductos