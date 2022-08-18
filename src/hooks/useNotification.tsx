import { useEffect, useState } from "react";
import PushNotification from "react-native-push-notification";
import { Notificacion } from "../interfaces/appInterfaces";

export const useNotification = ({channelId : canalId, title : titulo, message : mensaje}:Notificacion) => {
    
    // const [notification, setNotificacion] = useState({
    //     channelId : canalId || "1",
    //     title : titulo || "",
    //     message : mensaje || ""
    // });
    // useEffect(() => {

    
    //   return () => {
        
    //   }
    // }, [])
    
    const sendNotification = ({channelId, title, message} : Notificacion) => {
        // const {channelId, title, message} = notification;

        PushNotification.localNotification({
            channelId : channelId ? channelId  : canalId || "1",
            title : title ? title : titulo,
            message  : message ? message : mensaje || "",
        });
    }

  return {
    sendNotification,
    // setNotificacion,
  }
}
