import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react'
import { Text, View, ScrollView, StyleSheet, Button, TextInput, Alert } from 'react-native';
import Icon  from 'react-native-vector-icons/MaterialIcons';
import { GradientBackground } from '../../components/GradientBackground';
import {useEffect} from 'react';
import { ModalScreen } from '../../components/Modal/ModalScreen';
import { Producto } from '../../interfaces/appInterfaces';
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


const NUEVO_PRODUCTO = gql `
    mutation nuevoProducto($input: ProductoInput){
        nuevoProducto(input: $input){
            id
            nombre 
            precio
            existencia
        }
    }
`;


const ACTUALIZAR_PRODUCTO = gql `
  mutation actualizarProducto($id : ID!, $input : ProductoInput){
    actualizarProducto(id: $id, input : $input){
      nombre
      existencia
      precio
    }
  }
`

const ELIMINAR_PRODUCTO = gql `
    mutation eliminarProducto($id :ID!){
        eliminarProducto(id:$id) 
    }
`
export const ProductosScreen = () => {
    
    const [productos , setProductos] = useState<Array<any>>([]);
    const [modalVisible, setModalVisible] = useState(false);
    //AGREGAR PRODUCTO
    const [confirmarAgregar, setConfirmarAgregar] = useState(false);
    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        update(cache, { data:{ nuevoProducto}}) {
            //Obtener el objeto de cach'e que deseamos actualizar 
            //Tomar una copia del cache
            const {obtenerProductos }:any = cache.readQuery({query: OBTENER_PRODUCTOS})
            //Reescribimos el caché 
            cache.writeQuery({
                query:OBTENER_PRODUCTOS,
                data:{
                    //Actualizar la información 
                    obtenerProductos:[...obtenerProductos, nuevoProducto]
                }
            })
        }
    })

    //ELIMINAR PRODUCTO
    const [actionIcon, setActionIcon] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
    const [eliminarProductoDB] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache, { data:{ eliminarProducto}}) {
            //Obtener el objeto de cach'e que deseamos actualizar
            //Tomar una copia del cache
            const {obtenerProductos }:any = cache.readQuery({query: OBTENER_PRODUCTOS})
            //Reescribimos el caché
            cache.writeQuery({
                query:OBTENER_PRODUCTOS,
                data:{
                    //Actualizar la información
                    obtenerProductos:obtenerProductos.filter((producto : Producto)  => producto.id !== (productoSeleccionado as any).id)
                }
            })
        }
    })

    //ACTUALIZAR CLIENTE
    const [upActionIcon, setUpActionIcon] = useState(false);
    const [productoActualizar, setProductoActualizar] = useState(null);
    const [confirmarUpdate, setConfirmarUpdate] = useState(false);
    //ACTUALIZAR CLIENTE
    const [actualizarProductoDB] = useMutation(ACTUALIZAR_PRODUCTO);


    const [datosProducto, setDatosProducto] = useState({
        nombre: '',
        precio: '',
        existencia: '',
    });
    const [tipoAccion, setTipoAccion] = useState('');
    
    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);
    useEffect(() => {
        if(data){
            setProductos(data.obtenerProductos);
        }
        return () => {
            setProductos([]);
        }
    }
    ,[data]);

    useEffect(() => {
      console.log("Productos modificacod")
        console.log(productos)
      return () => {
        
      }
    }, [JSON.stringify(productos)])
    
    useEffect(() => {
        if(confirmarEliminacion){
            eliminarProducto();
            setConfirmarEliminacion(false);
            setTipoAccion('');
        }
        if(confirmarUpdate){
            actualizarProducto();
            setConfirmarUpdate(false);
            setTipoAccion('');
        }
        if(confirmarAgregar){
            agregarProducto();
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
        console.log("Nuevo delete de producto", JSON.parse(e._dispatchInstances.memoizedProps.prop).id)
        setTipoAccion('eliminar');
        setProductoSeleccionado(JSON.parse(e._dispatchInstances.memoizedProps.prop).id);
    }

    const updateActionIcon = (prop : any)=>{
        setUpActionIcon(!upActionIcon);
        setModalVisible(!modalVisible);
        setTipoAccion('editar');
        const {id, nombre, precio, existencia} = JSON.parse(prop._dispatchInstances.memoizedProps.prop);
        setDatosProducto({
            nombre,
            precio : precio.toString(),
            existencia : existencia.toString()
        })
        setProductoActualizar(id);
    }

    const eliminarProducto = async ()=>{
        try{
            await eliminarProductoDB({
                variables:{
                    id: productoSeleccionado
                }
            })
            //Use omit to remove the prop
            let productosLocal = (productos as any).filter((producto: any) => (producto as any).id !== productoSeleccionado);
            setProductos(productosLocal);
            Alert.alert('Eliminado', 'El producto ha sido eliminado correctamente');
        }
        catch(error){
            console.log(error);
        }
    }
    const actualizarProducto =  async ()=>{
        const {nombre, precio, existencia} = datosProducto;
        try{
            const {data} = await actualizarProductoDB({
                variables:{
                  id : productoActualizar,
                  input : {
                    nombre,  
                    precio : parseFloat(precio),
                    existencia : parseInt(existencia)
                  }
                }
              })
              console.log("datos de respuesta de actualizar",data);
              if(data.actualizarProducto){
                //use edit to change the prop
                let productosLocal = productos.map((producto)=>{
                    console.log("cliente", (producto as any).id)
                    if((producto as any).id === productoActualizar){
                        return {
                            ...producto,
                            nombre: datosProducto.nombre,
                            precio : Number(datosProducto.precio),
                            existencia : Number(datosProducto.existencia),
                        }
                    }
                    return producto;
                }
                );
        
                setProductos(productosLocal);
                Alert.alert('Exito', 'Producto actualizado correctamente');
              }
            
        }catch(error){
            console.log(error);
        }
    }

    const agregarProducto = async ()=>{
        
        const {nombre, precio, existencia} = datosProducto;
        const {data} = await nuevoProducto ({
            variables:{
                input:{
                    nombre,
                    precio : Number(precio),
                    existencia : Number(existencia),
                }
            }
        }) 
        //ID DEL CLIENTE RETORNADO DE LA BASE DE DATOS
        console.log(data.nuevoProducto)
        setProductos([...productos, {...datosProducto, id: data.nuevoProducto.id}]);
        
        Alert.alert('Exito', 'Producto creado correctamente');
    }
  return (
    <GradientBackground> 
        <View style = {styles.mainContainer}>
            <ScrollView > 
                
                <Button title = "Agregar Producto" onPress = {()=>{
                    setModalVisible(!modalVisible);
                    setTipoAccion('agregar');
                }}/>
                <ModalScreen visible = {modalVisible}>
                    {
                        tipoAccion === 'eliminar' 
                            ?
                        <>
                            <Text>Eliminar Producto</Text>
                            <Text>¿Estas seguro que deseas eliminar este producto?</Text>
                            <Button
                                title="Eliminar"
                                onPress={() => setConfirmarEliminacion(!confirmarEliminacion)}
                            />
                        </>
                            :
                        tipoAccion === 'editar'
                            ?
                        <>
                            <Text style={{backgroundColor : 'green'}}>Editar Producto</Text>
                            <TextInput style={{backgroundColor : 'green'}} placeholder='Nombre' value={datosProducto.nombre} onChangeText={(e)=>{setDatosProducto({...datosProducto, nombre : e})}}/>
                            <TextInput style={{backgroundColor : 'green'}} placeholder='Precio' value={datosProducto.precio} onChangeText={(e)=>{setDatosProducto({...datosProducto, precio : e})}}/>
                            <TextInput style={{backgroundColor : 'green'}} placeholder='Existencia' value={datosProducto.existencia} onChangeText={(e)=>{setDatosProducto({...datosProducto, existencia: e})}}/>
                            <Button
                                title="Editar"
                                onPress={() => setConfirmarUpdate(!confirmarUpdate)}
                            />
                        </>
                            :
                        tipoAccion === 'agregar'
                            ?
                        <>
                            <Text style={{backgroundColor : 'green'}}>Agregar Producto</Text>
                            <TextInput style={{backgroundColor : 'green'}} placeholder='Nombre' value={datosProducto.nombre} onChangeText={(e)=>{setDatosProducto({...datosProducto, nombre : e})}}/>
                            <TextInput style={{backgroundColor : 'green'}} placeholder='Precio' value={datosProducto.precio} onChangeText={(e)=>{setDatosProducto({...datosProducto, precio : e})}}/>
                            <TextInput style={{backgroundColor : 'green'}} placeholder='Existencia' value={datosProducto.existencia} onChangeText={(e)=>{setDatosProducto({...datosProducto, existencia: e})}}/>
                            <Button
                                title="Agregar"
                                onPress={() => setConfirmarAgregar(!confirmarAgregar)}
                            />
                        </>
                            :
                        <>
                        </>
                    }
                    
                </ModalScreen>
                <Text style= {styles.mainTitle}> PRODUCTOS</Text>
                <View style = {styles.titlesContainer}>
                    <Text style = {styles.title}>Nombre</Text>
                    <Text style = {styles.title}>Precio</Text>
                    <Text style = {styles.title}>Existencia</Text>
                    <Text style = {styles.title}>Acciones</Text>
                </View>
                {
                    productos.length > 0
                        ?
                    productos.map((producto :Producto) => (
                    <View 
                        key={producto.id}
                        style={styles.clienteContainer}
                    >
                        <View style = {styles.valuesContainer}>
                            <Text style={styles.value}>{producto.nombre}</Text>
                            <Text style={styles.value}>{producto.precio}</Text>
                            <Text style={styles.value}>{producto.existencia}</Text>
                            <Text style={styles.value}>
                                {!actionIcon ? <Icon onPress={(e)=>{deleteActionIcon(e )}} name={"delete-outline"} size={22} color={"red"} prop = {JSON.stringify({id:producto.id})}/> : <Icon onPress={(e)=>{deleteActionIcon(e )}} name={"delete"} size={22} color={"red"} prop = {JSON.stringify({id:producto.id})} /> }
                                {!upActionIcon ? <Icon onPress={(e)=>{updateActionIcon(e )}} name={"update"} size={22} color={"yellow"} prop = {JSON.stringify({id:producto.id, nombre : producto.nombre, precio : producto.precio, existencia : producto.existencia})}/> : <Icon onPress={(e)=>{updateActionIcon(e )}} name={"done"} size={22} color={"yellow"}  prop = {JSON.stringify({id:producto.id, nombre : producto.nombre, precio : producto.precio, existencia : producto.existencia})} /> }
                            </Text>
                        </View>
                        
                    </View>
                    ))
                        :
                    <View>
                        <Text style= {styles.mainTitle}>No hay Productos</Text>
                    </View>
                }
            </ScrollView>
        </View>     
        
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
        color : 'red',
        alignSelf : 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        paddingHorizontal : '3%',
    },
    titlesContainer: {
        flex : 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'blue',
        
    },
    clienteContainer : {
        backgroundColor : 'red',
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
        backgroundColor : 'blue',
    },
    value : {
        flex: 1,
        fontSize : 10,
        marginHorizontal : '2%',

    },
})