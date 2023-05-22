import React, { useState } from 'react';
import { IonButtons, IonContent, IonHeader, IonLabel, IonMenuButton, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react';
import Inflow from '../components/Inflow';
import Outflow from '../components/Outflow';
import Inventory from '../components/Inventory';


const Stockmanagement: React.FC = () => {

    const [selectedTab, setSelectedTab] = useState("inflow"); // Save the selected tab in the state, default is "inflow", change it via setSelectedTab

    const handleTabChange = (event: CustomEvent) => { // Handle the click on another tab
        setSelectedTab(event.detail.value); // Set the selectedTab state to the value of the clicked tab
    };

    let componentToRender; // Initialize a variable to store the component to render

    switch (selectedTab) { // Switch the component to render based on the selectedTab state
        case "inflow":
            componentToRender = <Inflow key="inflow" />; // Pass the vendorId to the component as a prop
            break;
        case "outflow":
            componentToRender = <Outflow key="outflow" />; 
            break;
        case "inventory":
            componentToRender = <Inventory key="inventory" />
            break;
        default:
            componentToRender = <Inflow key="inflow" />; 
            break;
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Stockmanagement</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Stockmanagement</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonToolbar>
              <IonSegment value={selectedTab} onIonChange={handleTabChange}>
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

export default Stockmanagement;
