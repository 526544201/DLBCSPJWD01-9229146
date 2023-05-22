import React, { useState } from 'react';
import { IonButtons, IonContent, IonHeader, IonLabel, IonMenuButton, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react';
import OrderOverview from '../components/OrderOverview';

const Order: React.FC = () => {

    const [selectedTab, setSelectedTab] = useState("ganter"); // Save the selected tab in the state, default is "ganter", change it via setSelectedTab

    const handleTabChange = (event: CustomEvent) => { // Handle the click on another tab
        setSelectedTab(event.detail.value); // Set the selectedTab state to the value of the clicked tab
    };

    let componentToRender; // Initialize a variable to store the component to render

    switch (selectedTab) { // Switch the component to render based on the selectedTab state
        case "ganter":
            componentToRender = <OrderOverview key="ganter" vendorId="1" />; // Pass the vendorId to the component as a prop
            break;
        case "star":
            componentToRender = <OrderOverview key="star" vendorId="2" />; 
            break;
        case "other":
            componentToRender = <OrderOverview key="other" vendorId="3" />; {/* TODO: Seperate component */}
            break;
        default:
            componentToRender = <OrderOverview key="default" vendorId="1" />; 
            break
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Orderoverview</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Orderoverview</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonToolbar>
              <IonSegment value={selectedTab} onIonChange={handleTabChange}>
                  <IonSegmentButton value="ganter">
                      <IonLabel>Ganter</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="star">
                      <IonLabel>Südstar</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="other">
                      <IonLabel>Other</IonLabel>
                  </IonSegmentButton>
              </IonSegment>
          </IonToolbar>
          {componentToRender} {/* Render the component based on the selectedTab state */}
        </IonContent>
      </IonPage>
    );
};

export default Order;
