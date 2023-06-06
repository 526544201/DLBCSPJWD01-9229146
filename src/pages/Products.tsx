import React, { useState } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import ProductsTable from '../components/ProductsTable';

const Products: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInput = (event: any) => {
        const term = event.target.value;
        setSearchTerm(term);
    };

    return (
        <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
                <IonMenuButton />
            </IonButtons>
            <IonTitle>Products</IonTitle>
            </IonToolbar>
            <IonToolbar>
                <IonSearchbar debounce={1000} onIonInput={handleInput}showClearButton="always" placeholder="Searchbar" ></IonSearchbar>
            </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
            <IonHeader collapse="condense">
            <IonToolbar>
                <IonTitle size="large">Products</IonTitle>
            </IonToolbar>
            </IonHeader>
            <ProductsTable searchTerm={searchTerm}/>
        </IonContent>
        </IonPage>
    );
};

export default Products;
