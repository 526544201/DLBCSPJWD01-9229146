import React from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import LoginComponent from '../components/LoginComponent';

const Login: React.FC = () => {

    return (
        <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
                <IonMenuButton />
            </IonButtons>
            <IonTitle>Login</IonTitle>
            </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
            <IonHeader collapse="condense">
            <IonToolbar>
                <IonTitle size="large">Login</IonTitle>
            </IonToolbar>
            </IonHeader>
            <LoginComponent />
        </IonContent>
        </IonPage>
    );
};

export default Login;
