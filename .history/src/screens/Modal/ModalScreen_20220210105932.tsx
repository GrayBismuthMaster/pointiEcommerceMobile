import React, { useState } from 'react'
import { Button, Modal, Text, View } from 'react-native'
import { HeaderTitle } from '../../components/HeaderTitle'
import {styles} from '../../theme/appTheme'
export const ModalScreen = () => {
  return (
    <View>
        <HeaderTitle title='Modal Screen' >
            <Text style = {[{...styles.subtitle,marginVertical: 20}] }>
                    Escoja su diagnóstico
            </Text>
        </HeaderTitle>
        <Button
            title= "Abrir modal"
            onPress={() => {}}
        />
        <Modal>

        </Modal>
    </View>
  )
}

