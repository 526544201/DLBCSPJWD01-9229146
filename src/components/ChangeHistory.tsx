import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonAccordion, IonAccordionGroup, IonAlert, IonContent, IonItem, IonLabel, IonRefresher, IonRefresherContent, IonToast, RefresherEventDetail } from '@ionic/react';
import FillStockHistoryAccordion from './FillStockHistoryAccordion';

interface changeHistoryProps {
    type: string;
}

class ChangeHistory extends Component<changeHistoryProps> {
    state = { // Holds data in the component
        stocks: [], // Holds the list of stockchanges
        toastIsOpen: false, // Tracks the visibility of the toast
        toastMessage: "", // Holds the message to be displayed in the toast
        toastDuration: 0, // Holds the duration for which the toast should be visible
        alert401IsOpen: false,
        alert401Message: ""
    }

    componentDidMount() { // Lifecycle method - When the component is mounted (on the screen)
        this.getStocks();
    }

    getStocks() {
        axios.get(environment.apiUrl + '/getStockhistory.php', {
            ...environment.config, // Spread Operator to merge the two objects and ensure that both are included in the request
            params: {
                type: this.props.type
            }
        }) // Get the stocks from the API via http request
            .then(response => {
                this.setState({ stocks: response.data }); // Set the state of the stocks array to the response data
            })
            .catch(error => { // Catch any errors
                if(error.response.status === 401) {
                    this.handle401(error);
                } else {
                    this.setToast(true, error.message + " " + error.response.data.message, 10000);
                }
            })
    }

    /**
        Sets the state to control the toast component.
        @param {boolean} isOpen - Indicates whether the toast should be displayed (true) or hidden (false).
        @param {string} message - The message to be displayed in the toast. Optional, defaults to an empty string if not provided.
        @param {number} duration - The duration in milliseconds for which the toast should be visible. Optional, defaults to 0 if not provided.
    */
    setToast(isOpen: boolean, message?: string, duration?: number) {
        this.setState({ toastIsOpen: isOpen, toastMessage: message, toastDuration: duration });
    }

    handle401 = (error: any) => {
        this.setState({alert401IsOpen: true, alert401Message: error.response.data.message});
    }

    handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
        this.getStocks();
        event.detail.complete();
    }

    render() { // Render the component
        return ( // "Normal HTML" to be rendered
            <IonContent className="ion-padding">
                <IonAccordionGroup >
                    {this.state.stocks.map((stock: any) => (
                        <IonAccordion value={stock.id} key={stock.id} >
                            <IonItem slot="header" color="light">
                                <IonLabel>{stock.date} - {stock.type}</IonLabel>
                            </IonItem>
                            <div className="ion-padding" slot="content">
                                <FillStockHistoryAccordion changeId={stock.id} type={stock.type} />
                            </div>
                        </IonAccordion>
                    ))}
                </ IonAccordionGroup>
                <IonToast
                    isOpen={this.state.toastIsOpen}
                    onDidDismiss={() => this.setToast(false)}
                    message={this.state.toastMessage}
                    duration={this.state.toastDuration}
                />
                <IonAlert
                    isOpen={this.state.alert401IsOpen}
                    onDidDismiss={() => { 
                        this.setState({alert401IsOpen: false});
                        localStorage.clear;
                        window.location.href = "/page/Login";
                    }}
                    header="Unauthorized Access"
                    subHeader="Please log in again."
                    message={this.state.alert401Message}
                    buttons={['OK']}
                />
                <IonRefresher slot="fixed" onIonRefresh={this.handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
            </IonContent>
        )
    }
}

export default ChangeHistory;