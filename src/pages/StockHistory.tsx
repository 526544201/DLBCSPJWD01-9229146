import React, { useState } from 'react';
import { IonButtons, IonContent, IonHeader, IonLabel, IonMenuButton, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react';
import LoginComponent from '../components/LoginComponent';
import ChangeHistory from '../components/ChangeHistory';

const StockHistory: React.FC = () => {

    const [selectedTab, setSelectedTab] = useState("all"); // Save the selected tab in the state, default is "inflow", change it via setSelectedTab

    const handleTabChange = (event: CustomEvent) => { // Handle the click on another tab
        setSelectedTab(event.detail.value); // Set the selectedTab state to the value of the clicked tab
    };

    let componentToRender; // Initialize a variable to store the component to render

    switch (selectedTab) { // Switch the component to render based on the selectedTab state
        case "all":
            componentToRender = <ChangeHistory key="All" type="All" />; // Pass the vendorId to the component as a prop
            break;
        case "inflow":
            componentToRender = <ChangeHistory key="Inflow" type="Inflow" />; // Pass the vendorId to the component as a prop
            break;
        case "outflow":
            componentToRender = <ChangeHistory key="Outflow" type="Outflow" />; 
            break;
        case "inventory":
            componentToRender = <ChangeHistory key="Inventory" type="Inventory" />
            break;
        default:
            componentToRender = <ChangeHistory key="" type="" />; 
            break;
    }

    return (
        <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
                <IonMenuButton />
            </IonButtons>
            <IonTitle>Stock-History</IonTitle>
            </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Stock History</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonToolbar>
              <IonSegment value={selectedTab} onIonChange={handleTabChange}>
                <IonSegmentButton value="all">
                      <IonLabel>All</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="inflow">
                    <IonLabel>Inflow</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="outflow">
                    <IonLabel>Outflow</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="inventory">
                    <IonLabel>Inventory</IonLabel>
                </IonSegmentButton>
              </IonSegment>
          </IonToolbar>
          {componentToRender} {/* Render the component based on the selectedTab state */}
        </IonContent>
        </IonPage>
    );
};

export default StockHistory;
