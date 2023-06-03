import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import environment from '../environment';
import { IonAccordion, IonAccordionGroup, IonContent, IonItem, IonLabel, IonToast } from '@ionic/react';
import "./Tables.css";

class OtherOrders extends Component {

    state = { // Holds data in the component
        products: [],
        toastIsOpen: false,
        toastMessage: "",
        toastDuration: 0
    }

    componentDidMount() { // Lifecycle method - When the component is mounted (on the screen)
        axios.get(environment.apiUrl + '/getProductsToOrderOther.php') // Get the products from the API via http request
            .then(response => {
                this.setState({ products: response.data }); // Set the state of the products array to the response data
            })
            .catch(error => { // Catch any errors
                this.setToast(true, error.message + ": " + error.response.data.message, 10000);
            });
    }

    groupByVendor(products: any) {
        const groupedProducts = products.reduce((grouped: any, product: any) => { // Iterate through the products array, accumulating the products into groups based on the callback function
            const vendor = product.vendor_id; // Get the vendor id of the current product
            if (!grouped[vendor]) { // If the vendor id doesn't exist in the groups object
                grouped[vendor] = []; // Create a new array for the vendor id
            }
            grouped[vendor].push(product); // Push the product to the array
            return grouped;
        }, {});
        return groupedProducts;       
    }

    setToast(isOpen: boolean, message?: string, duration?: number) {
        this.setState({ toastIsOpen: isOpen, toastMessage: message, toastDuration: duration });
    }

    render() { // Render the component
        const { products } = this.state;
        const groupedProducts = this.groupByVendor(products);

        if (groupedProducts.length === 0) return ( // If there are no products
            null // TODO: Add a loading indicator
        )


        return ( // "Normal HTML" to be rendered
            <IonContent className="ion-padding">
                <IonAccordionGroup>
                    {Object.entries(groupedProducts).map(([vendorId, products]) => ( // Typescript shenanigans / Object.entries returns an array of key-value pairs. 
                        // The key is the vendor id, and the value is the array of products. For each key-value pair, create an IonAccordion
                        <IonAccordion key={vendorId}> 
                            <IonItem slot="header" color="light">
                                <IonLabel>{vendorId}</IonLabel>
                            </IonItem>
                            <div className="ion-padding" slot="content">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Stock</th>
                                            <th>Minimum</th>
                                            <th>Order Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(products as any[]).map((product: any) => ( // Again, Typescript shenanigans / Fill the table with the corresponding products
                                            <tr key={product.id}>
                                                <td>{product.name}</td>
                                                <td>{product.stock}</td>
                                                <td>{product.minAmount}</td>
                                                <td>
                                                    {Math.ceil((product.minAmount - product.stock) / product.size)}
                                                    {product.size > 1 ? " Boxes" : ""}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </IonAccordion>
                    ))}
                </IonAccordionGroup>
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

export default OtherOrders;