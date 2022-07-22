import { gql, useQuery } from '@apollo/client';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native';
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
    
        return (
                <Picker
                    style={{
                        height: 40,
                        width: "80%",
                        backgroundColor: "rgba(0,0,0,0.4)",
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRadius: 30,
                        marginTop: 10,
                        marginBottom: 10,
                        paddingLeft: 10,
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
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedClient(itemValue)
                    }>
                        
                    {clientes.map((cliente:any) => (
                        <Picker.Item
                            key={cliente.id}
                            label={`${cliente.nombre} ${cliente.apellido}`}
                            value={cliente.id}
                        />
                    ))}
                        {/* <Picker.Item
                            label="Primer cliente"
                            value="Primer cliente"
                        /> */}
                </Picker>
            
          )
  
}
