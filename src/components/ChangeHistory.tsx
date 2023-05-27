import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel } from '@ionic/react';
import FillStockHistoryAccordion from './FillStockHistoryAccordion';

interface changeHistoryProps {
    type: string;
}

class ChangeHistory extends Component<changeHistoryProps> {
    state = { // Holds data in the component
        stocks: [],
    }

    componentDidMount() { // Lifecycle method - When the component is mounted (on the screen)
        axios.get(environment.apiUrl + '/getStockhistory.php', {
            params: {
                type: this.props.type
            }
        }) // Get the stocks from the API via http request ---- TODO: Add type to POST
            .then(response => {
                console.log(response); // DEBUG: Log the response to the console 
                this.setState({ stocks: response.data }); // Set the state of the stocks array to the response data
            })
            .catch(error => { // Catch any errors
                console.log(error); // DEBUG: Log the error to the console
            });
    }

    render() { // Render the component
        return ( // "Normal HTML" to be rendered
            <IonAccordionGroup >
                {this.state.stocks.map((stock: any) => (
                    <IonAccordion value={stock.id} key={stock.id} >
                        <IonItem slot="header" color="light">
                            <IonLabel>{stock.type}</IonLabel>
                        </IonItem>
                        <div className="ion-padding" slot="content">
                            <FillStockHistoryAccordion changeId={stock.id} type={stock.type} />
                        </div>
                    </IonAccordion>
                ))}
            </ IonAccordionGroup>
        )
    }
}

export default ChangeHistory;