import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useContext, useRef, useState } from 'react'
import { Text, View, ScrollView, StyleSheet, Button, TextInput, Alert, KeyboardAvoidingView } from 'react-native';
import Icon  from 'react-native-vector-icons/MaterialIcons';
import { GradientBackground } from '../../components/GradientBackground';
import {useEffect} from 'react';
import { ModalScreen } from '../../components/Modal/ModalScreen';
import { Pedido } from '../../interfaces/appInterfaces';
import { AsignarCliente } from './AsignarCliente';
import AsignarProductos from './AsignarProductos';
import Total from './Total';
import PedidoContext from '../../context/pedidos/PedidoContext';
import { Fab } from '../../components/Fab';
import { Picker } from '@react-native-picker/picker';

const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor{
        obtenerPedidosVendedor{
            id
            pedido{
                id
                nombre
                cantidad
                precio
            }
            cliente{
                id
                nombre
                apellido
                email
                telefono
            }
            vendedor
            total
            estado
        }
    }
`


const NUEVO_PEDIDO = gql`
    mutation nuevoPedido($input : PedidoInput){
      nuevoPedido(input : $input){
            id
      }
    }    
`


const ACTUALIZAR_PEDIDO = gql`
    mutation actualizarPedido($id : ID!, $input : PedidoInput){
        actualizarPedido(id : $id, input : $input){
            estado 
        }
    }
`

const ELIMINAR_PEDIDO = gql `
    mutation eliminarPedido($id :ID!){
        eliminarPedido(id:$id) 
    }
`
export const PedidosScreen = () => {
    const pickerRef = useRef();

    const [pedidos , setPedidos] = useState<Array<any>>([]);
    const [modalVisible, setModalVisible] = useState(false);
    //AGREGAR PRODUCTO
    const [confirmarAgregar, setConfirmarAgregar] = useState(false);
    const [nuevoPedido] = useMutation(NUEVO_PEDIDO)

    //ELIMINAR PRODUCTO
    const [actionIcon, setActionIcon] = useState(false);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
    const [eliminarPedidoDB] = useMutation(ELIMINAR_PEDIDO, {
        update(cache, { data:{ eliminarPedido}}) {
            //Obtener el objeto de cach'e que deseamos actualizar
            //Tomar una copia del cache
            const {obtenerPedidosVendedor }:any = cache.readQuery({query: OBTENER_PEDIDOS})
            //Reescribimos el caché
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data:{
                    //Actualizar la información
                    obtenerPedidosVendedor: obtenerPedidosVendedor.filter((pedido : Pedido)  => pedido.id !== (pedidoSeleccionado as any).id)
                }
            })
        }
    })

    //ACTUALIZAR CLIENTE
    const [upActionIcon, setUpActionIcon] = useState(false);
    const [pedidoActualizar, setPedidoActualizar] = useState(null);
    const [confirmarUpdate, setConfirmarUpdate] = useState(false);
    //ACTUALIZAR PEDIDO
    const [actualizarPedidoDB] = useMutation(ACTUALIZAR_PEDIDO);
    const [estadoPedido, setEstadoPedido] = useState()

    //PEDIDOS
    
  //Utilizar context y extraer sus funciones
  const pedidoContext = useContext(PedidoContext);
  const {cliente, productos, total}:any = pedidoContext;

    const [datosPedido, setDatosPedido] = useState({
        id: '',
        pedido: [],
        cliente: {},
        vendedor: '',
        total: 0,
        estado: ''
    });
    const [tipoAccion, setTipoAccion] = useState('');
    
    const { data, loading, error } = useQuery(OBTENER_PEDIDOS);
    
    useEffect(() => {
        console.log("Datos desde el inicio", data);
        if(data === undefined){
            console.log('nulo')
            setPedidos([]);
        }else{
            if(data !==null){
                setPedidos(data.obtenerPedidosVendedor);
            }
        }
        // if(!data){
        //     setPedidos([]);
        // }else{
        //     
        // }
        return () => {
            setPedidos([]);
        }
    }
    ,[data]);

    useEffect(() => {
    //   console.log("Peiddo modificacod")
    //     console.log(pedidos)
      return () => {
        
      }
    }, [JSON.stringify(pedidos)])
    
    useEffect(() => {
        if(confirmarEliminacion){
            eliminarPedido();
            setConfirmarEliminacion(false);
            setTipoAccion('');
        }
        if(confirmarUpdate){
            actualizarPedido();
            setConfirmarUpdate(false);
            setTipoAccion('');
        }
        if(confirmarAgregar){
            agregarPedido();
            setConfirmarAgregar(false);
            setTipoAccion('');
        }
      return () => {
        
      }
    }, [confirmarEliminacion, confirmarUpdate, confirmarAgregar])
    

    if(loading) return <Text>Cargando...</Text>;
    console.log(data);
    
    
    const deleteActionIcon = (e : any)=>{
        setActionIcon(!actionIcon)
        setModalVisible(!modalVisible);
        console.log("Nuevo delete de pedido", JSON.parse(e._dispatchInstances.memoizedProps.prop).id)
        setTipoAccion('eliminar');
        setPedidoSeleccionado(JSON.parse(e._dispatchInstances.memoizedProps.prop).id);
    }

    const updateActionIcon = (prop : any)=>{
        setUpActionIcon(!upActionIcon);
        setModalVisible(!modalVisible);
        setTipoAccion('editar');
        //NECESARIO ID DE VENDEDOR, id de cliente y estado
        console.log("PROPS DE ACTUAL PEDIDO",prop._dispatchInstances.memoizedProps.prop)
        const {id, pedido, cliente, vendedor, total, estado} = JSON.parse(prop._dispatchInstances.memoizedProps.prop);
        setDatosPedido({
           id,
           pedido,
           cliente,
           vendedor,
           total,
           estado
        })
        setPedidoActualizar(id);
    }

    const eliminarPedido = async ()=>{
        try{
            await eliminarPedidoDB({
                variables:{
                    id: pedidoSeleccionado
                }
            })
            //Use omit to remove the prop
            let pedidosLocal = (pedidos as any).filter((pedido: any) => (pedido as any).id !== pedidoSeleccionado);
            setPedidos(pedidosLocal);
            Alert.alert('Eliminado', 'El producto ha sido eliminado correctamente');
        }
        catch(error){
            console.log(error);
        }
    }
    const actualizarPedido =  async ()=>{
        console.log("Datos de pedido desde actualizar",datosPedido);
        const {id, cliente, estado} = datosPedido;
        try{
            const {data} = await actualizarPedidoDB({
                variables : {
                    id,
                    input : {
                        estado : estado,
                        cliente : (cliente as any).id
                    }
                }
            })
            setEstadoPedido(data.actualizarPedido.estado)
            console.log("Datos que devuelve el actualizar pedido en backend",data);
            const pedidosActualizados = pedidos.map((pedido: any) => {
                if(pedido.id === id){
                    return {
                        ...pedido,
                        estado: estado
                    }
                }
                return pedido;
            })
            setPedidos(pedidosActualizados);
            Alert.alert('Actualizado', 'El pedido ha sido actualizado correctamente');
        }catch(error){
            console.log(error)
        }
    }


    const agregarPedido = async ()=>{
        //Remover atributos que no van 
        console.log('PRODUCTOS DESDE AGREGAR PEDIDO')
        console.log(productos);
        console.log("CLIENTE ASIGNADO", cliente);
        const pedido = productos.map(({existencia,__typename, ...producto}:any)=>{
            return{
                ...producto,
                id : producto.id,
                cantidad : parseInt(producto.cantidad),
                nombre : producto.nombre,
                precio : parseFloat(producto.precio)
            }
        });
        // console.log("Pedido a enviar al estado", pedido);
        // console.log("Total a enviar al estado", total);
        
        try{
          const {data} = await nuevoPedido({
            variables : {
              input : {
                cliente : JSON.parse(cliente).id,
                total : parseFloat(total), 
                pedido
              }
            }
          })
          const pedidoAgregarEstado = {
            cliente : {
                ...JSON.parse(cliente)
            }, 
            total,
            pedido,
            id : data.nuevoPedido.id,
            estado : 'PENDIENTE'
          }
            console.log("datos de respuesta de nuevo pedido",data);
            if(data.nuevoPedido){
                setPedidos([...pedidos, pedidoAgregarEstado]);
            }
          Alert.alert('Exito', 'Pedido creado correctamente');
        }catch(error){
            console.log("Error al envio", error);
            Alert.alert('Error', 'Error al crear pedido');
        }
      }
  return (
    <GradientBackground> 
        <View style = {styles.mainContainer}>
            <ScrollView > 
                
                <ModalScreen visible = {modalVisible}>
                        {
                            tipoAccion === 'eliminar' 
                                ?
                            <>
                                <Text>Eliminar Pedido</Text>
                                <Text>¿Estas seguro que deseas eliminar este producto?</Text>
                                <Button
                                    title="Eliminar"
                                    onPress={() => setConfirmarEliminacion(!confirmarEliminacion)}
                                />
                            </>
                                :
                            tipoAccion === 'editar'
                                ?
                            <View
                                style={{
                                    flex: 1,
                                    width : '90%',
                                    height : '80%',
                                    // backgroundColor : 'rgba(0,0,0,0.8)',
                                }}
                            >
                                <Picker
                                    style={{
                                        height: 40,
                                        width: "80%",
                                        backgroundColor: "rgba(0,0,0,0.8)",
                                        borderColor: "gray",
                                        borderWidth: 1,
                                        borderRadius: 30,
                                        marginTop: 10,
                                        marginBottom: 10,
                                        paddingLeft: 20,
                                        marginHorizontal: "10%",
                                        paddingRight: 10,
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                        color: "white",
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        textAlign: "center"
                                        
                                    }}
                                    mode='dropdown'
                                    ref={pickerRef}
                                    // style={{ backgroundColor: "blue", marginTop: "10px" }}
                                    selectedValue={datosPedido.estado}
                                    onValueChange={(itemValue, itemIndex) =>{
                                        console.log("itemValue",itemValue);
                                        console.log("itemIndex",itemIndex);

                                        setDatosPedido({...datosPedido, estado : itemValue})
                                    }}
                                    >
                                        <Picker.Item 
                                            label="PENDIENTE"
                                            value="PENDIENTE"
                                        />
                                        <Picker.Item 
                                            label="COMPLETADO"
                                            value="COMPLETADO"
                                        />
                                        <Picker.Item 
                                            label="CANCELADO"
                                            value="CANCELADO"
                                        />
                                </Picker>
                                <Button
                                    title="Editar"
                                    onPress={() => setConfirmarUpdate(!confirmarUpdate)}
                                />
                            </View>
                                :
                            tipoAccion === 'agregar'
                                ?
                            <KeyboardAvoidingView
                                behavior="padding"
                                enabled
                                style={{
                                    flex: 1,
                                
                                    width : '90%',
                                    height : '80%',
                                    backgroundColor : 'rgba(0,0,0,0.8)',
                                }}
                            >
                                <ScrollView>
                                    <Text style={{
                                        fontSize : 25,
                                        marginVertical : 10,
                                        alignSelf : 'center',

                                    }}>
                                        Agregar Pedido
                                    </Text>
                                    
                                    <Text style={{
                                        fontSize : 15,
                                        marginVertical : 10
                                    }}>                       
                                        1. Asigna un cliente al Pedido
                                    </Text>
                                        
                                    <AsignarCliente/>
                                    
                                    <Text style={{
                                        fontSize : 15,
                                        marginVertical : 10
                                    }}>                       
                                        2. Selecciona o busca los productos
                                    </Text>
                                    <AsignarProductos/>
                                    <Text style={{
                                        fontSize : 15,
                                        marginVertical : 10
                                    }}>                       
                                        4. Ajustar las cantidades del producto
                                    </Text> 
                                    <Total/>
                                </ScrollView>
                                

                            <Button
                                    title="Agregar"
                                    onPress={() => setConfirmarAgregar(!confirmarAgregar)}
                                />
                            </KeyboardAvoidingView>
                                :
                            <>
                            </>
                        }
                </ModalScreen>
                <Text style= {styles.mainTitle}> PEDIDOS</Text>
                <View style = {styles.titlesContainer}>
                    <Text style = {styles.title}>Cliente</Text>
                    <Text style = {styles.title}>Resumen</Text>
                    <Text style = {styles.title}>Acciones</Text>
                </View>
                {
                    pedidos.length > 0
                        ?
                    pedidos.map((pedido :Pedido) => (
                    <View 
                        key={pedido.id}
                        style={styles.clienteContainer}
                    >
                        <View style = {styles.valuesContainer}>
                            <Text style={styles.value}>{pedido.cliente.nombre}
                                {'\n'}
                                {pedido.cliente.email}
                                {'\n'}
                                {pedido.cliente.telefono}
                                {'\n'}
                                {'\n'}
                                {'\n'}
                                Estado Pedido : {pedido.estado}
                            </Text>
                            <Text style={styles.value}>
                                {
                                pedido.pedido.map((producto : any)=>{
                                    return 'Producto : '+producto.nombre + '\n' 
                                    +'Cantidad : '+producto.cantidad + '\n' 
                                })
                                }
                                {'\n'}
                                {'\n'}
                                Total a Pagar : {pedido.total}

                            </Text>
                            <Text style={styles.value}>
                                {!actionIcon ? <Icon onPress={(e)=>{deleteActionIcon(e )}} name={"delete-outline"} size={22} color={"red"} prop = {JSON.stringify({id:pedido.id})}/> : <Icon onPress={(e)=>{deleteActionIcon(e )}} name={"delete"} size={22} color={"red"} prop = {JSON.stringify({id:pedido.id})} /> }
                                {!upActionIcon ? <Icon onPress={(e)=>{updateActionIcon(e )}} name={"update"} size={22} color={"yellow"} prop = {JSON.stringify({id:pedido.id, cliente : pedido.cliente, pedido : pedido.pedido, total: pedido.total, vendedor : pedido.vendedor, estado : pedido.estado})}/> : <Icon onPress={(e)=>{updateActionIcon(e )}} name={"done"} size={22} color={"yellow"}  prop = {JSON.stringify({id:pedido.id, cliente : pedido.cliente, pedido : pedido.pedido, total: pedido.total, vendedor : pedido.vendedor, estado : pedido.estado})} /> }
                            </Text>
                        </View>
                        
                    </View>
                    ))
                        :
                    <View>
                        <Text style= {styles.mainTitle}>No hay Pedidos</Text>
                    </View>
                }
            </ScrollView>
        </View>     
        
        <Fab 
            title = "+" 
            onPress = {()=>{
                setModalVisible(!modalVisible);
                setTipoAccion('agregar');
            }}
            position = "right"
        />
    </GradientBackground>
  )
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    mainTitle : {
        fontSize: 30,
        fontWeight: 'bold',
        marginVertical : '8%',
        color : 'rgba(0,0,0,0.8)',
        alignSelf : 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        paddingHorizontal : '3%',
        color : 'rgba(255,255,255,0.8)',
    },
    titlesContainer: {
        flex : 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        marginHorizontal : '2%',
        
    },
    clienteContainer : {
        flex : 1,
        marginVertical : '3%',
        justifyContent : 'center',
        alignItems : 'center',
    },
    valuesContainer : {
        // flex : 5,
        width : '95%',
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center',
        backgroundColor : 'rgba(255,255,255,0.8)',
    },
    value : {
        flex: 1,
        fontSize : 10,
        marginHorizontal : '2%',
        color : 'rgba(0,0,0,0.8)',
    },
    modalContainer : {
        width : '90%',
        height : '80%',
        backgroundColor : 'rgba(0,0,0,0.8)',
    },
    modalTitle : {
        fontSize : 20,
        fontWeight : 'bold',
        color : 'rgba(255,255,255,0.8)',
        marginVertical : '3%',
        marginHorizontal : '3%',
        alignSelf : 'center'
    }
})