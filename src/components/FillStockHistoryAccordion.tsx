import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonAccordion, IonAccordionGroup, IonContent, IonItem, IonLabel, IonToast } from '@ionic/react';
import "./Tables.css";

interface FillAccordionProps {
    changeId: number;
    type: string;
}


class FillStockHistoryAccordion extends Component<FillAccordionProps>{
    state = { // Holds data in the component
        stockChanges: [],
        toastIsOpen: false,
        toastMessage: "",
        toastDuration: 0
    }

    componentDidMount() { // Lifecycle method - When the component is mounted (on the screen)
        axios.get(environment.apiUrl + '/getStockhistoryDetails.php', {// Get the stocks from the API via http request
            params: {
                changeId: this.props.changeId,
                type: this.props.type 
            }}) 
            .then(response => {
                this.setState({ stockChanges: response.data }); // Set the state of the stocks array to the response data
            })
            .catch(error => { // Catch any errors
                this.setToast(true, error.message + ": " + error.response.data.message, 10000);
            });
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

    render() { // Render the component
        return ( // "Normal HTML" to be rendered
                <div>
                    <table className="table" >
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Old Stock</th>
                                <th>Change</th>
                                <th>New Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.stockChanges.length > 0 && this.state.stockChanges.map((stockChange: any) => (
                                <tr key={`change${stockChange.change_id}`}>
                                    <td>{stockChange.name}</td>
                                    <td>{stockChange.old_Stock}</td>
                                    <td>{stockChange.quantity}</td>
                                    <td>{stockChange.new_Stock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <IonToast
                        isOpen={this.state.toastIsOpen}
                        onDidDismiss={() => this.setToast(false)}
                        message={this.state.toastMessage}
                        duration={this.state.toastDuration}
                    />
            </div>
        )
    }
}

export default FillStockHistoryAccordion;