import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import environment from '../environment';
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel } from '@ionic/react';

class OtherOrders extends Component {

    state = { // Holds data in the component
        products: []
    }

    componentDidMount() { // Lifecycle method - When the component is mounted (on the screen)
        axios.get(environment.apiUrl + '/getProductsToOrderOther.php') // Get the products from the API via http request
            .then(response => {
                console.log(response); // DEBUG: Log the response to the console 
                this.setState({ products: response.data }); // Set the state of the products array to the response data
            })
            .catch(error => { // Catch any errors
                console.log(error); // DEBUG: Log the error to the console
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

    render() { // Render the component
        const { products } = this.state;
        const groupedProducts = this.groupByVendor(products);

        if (groupedProducts.length === 0) return ( // If there are no products
            null // TODO: Add a loading indicator
        )


        return ( // "Normal HTML" to be rendered
            <IonAccordionGroup>
                {Object.entries(groupedProducts).map(([vendorId, products]) => ( // Typescript shenanigans / Object.entries returns an array of key-value pairs. 
                    // The key is the vendor id, and the value is the array of products. For each key-value pair, create an IonAccordion
                    <IonAccordion key={vendorId}> 
                        <IonItem slot="header" color="light">
                            <IonLabel>{vendorId}</IonLabel>
                        </IonItem>
                        <div className="ion-padding" slot="content">
                            <table>
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
        )
    }
}

export default OtherOrders;