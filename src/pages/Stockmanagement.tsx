import React, { useState } from 'react';
import { IonButtons, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonLabel, IonMenuButton, IonModal, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react';
import Inflow from '../components/Inflow';
import Outflow from '../components/Outflow';
import Inventory from '../components/Inventory';

const Stockmanagement: React.FC = () => {

    const [selectedTab, setSelectedTab] = useState("inflow"); // Save the selected tab in the state, default is "inflow", change it via setSelectedTab
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString()); // Save the selected date in the state, default is today, change it via setDate

    const handleTabChange = (event: CustomEvent) => { // Handle the click on another tab
        setSelectedTab(event.detail.value); // Set the selectedTab state to the value of the clicked tab
    };

    let componentToRender; // Initialize a variable to store the component to render

    switch (selectedTab) { // Switch the component to render based on the selectedTab state
        case "inflow":
            componentToRender = <Inflow key="inflow" selectedDate={selectedDate} />; // Pass the selectedDate to the component as a prop
            break;
        case "outflow":
            componentToRender = <Outflow key="outflow" selectedDate={selectedDate} />; 
            break;
        case "inventory":
            componentToRender = <Inventory key="inventory" />
            break;
        default:
            componentToRender = <Inflow key="inflow" selectedDate={selectedDate} />; 
            break;
    }

    const handleDateChange = (event: CustomEvent) => { // Handle the click on another date
      setSelectedDate(event.detail.value); // Set the selectedDate state to the value of the clicked date
    };

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Stockmanagement</IonTitle>
            <IonButtons slot="end">
              <IonDatetimeButton 
                datetime='datetime'
              ></IonDatetimeButton>
            </IonButtons>
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
          <IonModal keepContentsMounted={true}>
            <IonDatetime 
              id='datetime' // Id for the IonDatetimeButton
              max={new Date().toISOString()} // Set the max date to today
              firstDayOfWeek={1} // Set monday as the first day of the week
              showDefaultButtons={true} // Show the default buttons (Cancel + Done)
              onIonChange={handleDateChange} // Handle the click on another date
            ></IonDatetime>
          </IonModal>
        </IonContent>
      </IonPage>
    );
};

export default Stockmanagement;
