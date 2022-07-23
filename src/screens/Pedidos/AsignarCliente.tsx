import { gql, useQuery } from '@apollo/client';
import { Picker } from '@react-native-picker/picker';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { View } from 'react-native';
import PedidoContext from '../../context/pedidos/PedidoContext';
//SECCION DE AGREGAR PRODUCTO
const OBTENER_CLIENTES_USUARIO = gql`
      query obtenerClientesVendedor {
        obtenerClientesVendedor{
          id
          nombre
          apellido
          empresa
          email
          telefono
        }
      }
`;

export const AsignarCliente = () => {
    const pickerRef = useRef();
    const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);
    const [clientes, setClientes] = useState([]);
    const [selectedClient, setSelectedClient] = useState("Primer cliente");
    
    
  //Context e pedidos
  const pedidoContext = useContext(PedidoContext);
  const {agregarCliente}:any = pedidoContext;
  
    useEffect(() => {

        console.log("CLientes del asignar cliente",data);
        if (data) {
            setClientes(data.obtenerClientesVendedor);
        }
      return () => {
        console.log("retorno")
        setClientes([]);
      }
    }, [data])
    
    useEffect(() => {
        
        console.log("CLientes asignados al estado global",selectedClient);
        if (selectedClient) {
            agregarCliente(selectedClient);
        }
      return () => {
        console.log("retorno")
        // setClientes([]);
      }
    }, [selectedClient])
        return (
                <Picker
                    style={{
                        height: 40,
                        width: "80%",
                        backgroundColor: "rgba(255,255,255,0.4)",
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
                    selectedValue={selectedClient}
                    onValueChange={(itemValue, itemIndex) =>{
                        console.log("itemValue",itemValue);
                        console.log("itemIndex",itemIndex);

                        setSelectedClient(itemValue)
                    }}>
                    
                    {clientes.map((cliente:any) => (
                        <Picker.Item
                            key={cliente.id}
                            label={`${cliente.nombre} ${cliente.apellido}`}
                            value={JSON.stringify({id : cliente.id, nombre : cliente.nombre, apellido : cliente.apellido, empresa : cliente.empresa, email : cliente.email, telefono : cliente.telefono})}
                        />
                    ))}
                        {/* <Picker.Item
                            label="Primer cliente"
                            value="Primer cliente"
                        /> */}
                </Picker>
            
          )
  
}
