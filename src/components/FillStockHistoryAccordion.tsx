import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel } from '@ionic/react';

interface FillAccordionProps {
    changeId: number;
    type: string;
}


class FillStockHistoryAccordion extends Component<FillAccordionProps>{
    state = { // Holds data in the component
        stockChanges: [],
    }

    componentDidMount() { // Lifecycle method - When the component is mounted (on the screen)
        axios.get(environment.apiUrl + '/getStockhistoryDetails.php') // Get the stocks from the API via http request
            .then(response => {
                console.log(response); // DEBUG: Log the response to the console 
                this.setState({ stockChanges: response.data }); // Set the state of the stocks array to the response data
            })
            .catch(error => { // Catch any errors
                console.log(error); // DEBUG: Log the error to the console
            });
    }

    render() { // Render the component
        return ( // "Normal HTML" to be rendered
        <div>
            <table>
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
                        <tr key={stockChange.id}>
                            <td>{stockChange.name}</td>
                            <td>{stockChange.old_Stock}</td>
                            <td>{stockChange.quantity}</td>
                            <td>{stockChange.new_Stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        )
    }
}

export default FillStockHistoryAccordion;