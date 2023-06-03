import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonAccordion, IonAccordionGroup, IonContent, IonItem, IonLabel, IonToast } from '@ionic/react';
import FillStockHistoryAccordion from './FillStockHistoryAccordion';

interface changeHistoryProps {
    type: string;
}

class ChangeHistory extends Component<changeHistoryProps> {
    state = { // Holds data in the component
        stocks: [],
        toastIsOpen: false,
        toastMessage: "",
        toastDuration: 0
    }

    componentDidMount() { // Lifecycle method - When the component is mounted (on the screen)
        axios.get(environment.apiUrl + '/getStockhistory.php', {
            params: {
                type: this.props.type
            }
        }) // Get the stocks from the API via http request
            .then(response => {
                this.setState({ stocks: response.data }); // Set the state of the stocks array to the response data
            })
            .catch(error => { // Catch any errors
                this.setToast(true, error.message + ": " + error.response.data.message, 10000)
            });
    }

    setToast(isOpen: boolean, message?: string, duration?: number) {
        this.setState({ toastIsOpen: isOpen, toastMessage: message, toastDuration: duration });
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
            </IonContent>
        )
    }
}

export default ChangeHistory;