import React, { useEffect, useState } from 'react';
import { IonButton, IonButtons, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonLabel, IonMenuButton, IonModal, IonPage, IonSearchbar, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react';
import Inflow from '../components/Inflow';
import Outflow from '../components/Outflow';
import Inventory from '../components/Inventory';

const Stockmanagement: React.FC = () => {

    const [selectedTab, setSelectedTab] = useState("inflow"); // Save the selected tab in the state, default is "inflow", change it via setSelectedTab
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString()); // Save the selected date in the state, default is today, change it via setDate
    const [searchTerm, setSearchTerm] = useState("");  // Save the search term in the state, default is empty string, change it via setSearchTerm

    const handleInput = (event: any) => {
        const term = event.target.value;
        setSearchTerm(term);
    };

    const handleTabChange = (event: CustomEvent) => { // Handle the click on another tab
        setSelectedTab(event.detail.value); // Set the selectedTab state to the value of the clicked tab
        if(event.detail.value === "inventory") { // If the tab is inventory, set the selectedDate state to today
            setSelectedDate(new Date().toISOString()); // NO IDEA WHY, but this finally kills the time!
        }
    };

    let componentToRender; // Initialize a variable to store the component to render

    switch (selectedTab) { // Switch the component to render based on the selectedTab state
        case "inflow":
            componentToRender = <Inflow key="inflow" selectedDate={selectedDate} searchTerm={searchTerm} />; // Pass the selectedDate to the component as a prop
            break;
        case "outflow":
            componentToRender = <Outflow key="outflow" selectedDate={selectedDate} searchTerm={searchTerm} />; 
            break;
        case "inventory":
            componentToRender = <Inventory key="inventory" selectedDate={selectedDate} searchTerm={searchTerm} />
            break;
        default:
            componentToRender = <Inflow key="inflow" selectedDate={selectedDate} searchTerm={searchTerm} />; 
            break;
    }

    const handleDateChange = (event: CustomEvent) => { // Handle the click on another date
      setSelectedDate(event.detail.value); // Set the selectedDate state to the value of the clicked date
    };

    useEffect(() => {
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            const timeButton = document.getElementById("dateTimeButton");
            if (timeButton !== null) {
              const shadowRoot = timeButton.shadowRoot;
              if (shadowRoot !== null) {
                const time_Button = shadowRoot.querySelector("#time-button") as HTMLButtonElement;
                if (time_Button !== null) {
                  time_Button.style.display = "none";
                  observer.disconnect();
                }
              }
            }
          }
        }
      });
  
      observer.observe(document, { childList: true, subtree: true });
  
      return () => {
        observer.disconnect();
      };
    }, []);

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Stock Management</IonTitle>
          </IonToolbar>
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
          <IonToolbar>
            <IonSearchbar debounce={1000} onIonInput={handleInput}showClearButton="always" placeholder="Searchbar" ></IonSearchbar>
            <IonButtons slot="end">
              <IonDatetimeButton 
                datetime='datetime'
                id="dateTimeButton"
                disabled={selectedTab === "inventory" ? true : false} // Disable the button if the selected tab is inventory
              ></IonDatetimeButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Stock Management</IonTitle>
            </IonToolbar>
          </IonHeader>

          {componentToRender} {/* Render the component based on the selectedTab state */}
          <IonModal keepContentsMounted={true}>
            <IonDatetime 
              id='datetime' // Id for the IonDatetimeButton
              min={
                new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() - 2,  // Set the min date to 2 months ago
                  new Date().getDate()
                ).toISOString()
              }
              max={new Date().toISOString()} // Set the max date to today
              firstDayOfWeek={1} // Set monday as the first day of the week
              showDefaultButtons={true} // Show the default buttons (Cancel + Done)
              onIonChange={handleDateChange} // Handle the click on another date
              value={selectedDate} // Set the value of the IonDatetimeButton to the selectedDate state
            ></IonDatetime>
          </IonModal>
        </IonContent>
      </IonPage>  
    );
};

export default Stockmanagement;
