import React from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import LoginComponent from '../components/LoginComponent';

const Login: React.FC = () => {

    return (
        <IonPage>
        <IonContent fullscreen>
            <LoginComponent />
        </IonContent>
        </IonPage>
    );
};

export default Login;
