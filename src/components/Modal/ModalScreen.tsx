import React, { useState, useEffect } from 'react'
import { Button, Modal, Text, View } from 'react-native'
import { HeaderTitle } from '../../components/HeaderTitle'
import {styles} from '../../theme/appTheme'
interface Props {
    visible: boolean;
    title : string;
    children : any;
}
export const ModalScreen = ({title, visible, children}: any) => {
    
    const [isVisible, setIsVisible] = useState(true)
    useEffect(() => {
      setIsVisible(!isVisible)
      return () => {
      }
    }, [visible])
    
    return (
        <View>
            <HeaderTitle title='Modal Screen' >
                <Text style = {[{...styles.subtitle,marginVertical: 20}] }>
                        {title}
                </Text>
            </HeaderTitle>
            {/* <Button
                title= "Abrir modal"
                onPress={() => setIsVisible(true)}
            /> */}
            <Modal
                animationType="slide"
                visible={isVisible}
                transparent
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>  
                    <View style={{ 
                            backgroundColor: 'white',
                            width: '80%', 
                            height: '70%', 
                            borderRadius: 10, 
                            justifyContent : 'center', 
                            alignItems : "center" 
                    }}>

                        <Button
                            title="Cerrar modal"
                            onPress={() => setIsVisible(false)}
                        />
                        
                        {children}
                    </View>
                </View>
            </Modal>
        </View>
    )
}

