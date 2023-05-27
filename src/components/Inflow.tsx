import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonButton, IonContent, IonInput } from '@ionic/react';
import "./Tables.css";

// TODO: MAYBE: Inflow and Outflow could be combined into one component, with a prop to determine which one it is

class Inflow extends Component {
    state = { // Holds data in the component
        products: [] , // Holds the products from the db
        changedProducts: [], // Holds the products where user changes the stock
        requestId: ''
    }

    componentDidMount() { // Lifecycle method - When the component is mounted (on the screen)
        axios.get(environment.apiUrl + '/getProducts.php') // Get the products from the API via http request
            .then(response => {
                console.log(response); // DEBUG: Log the response to the console 
                this.setState({ products: response.data }); // Set the state of the products array to the response data
            })
            .catch(error => { // Catch any errors
                console.log(error); // DEBUG: Log the error to the console
            });
    }

    componentDidUpdate(prevProps: any, prevState: any) { // Lifecycle method - When the component is updated
        if (prevState.changedProducts.length !== this.state.changedProducts.length) { // If the changedProducts array has changed
            console.log('changedProducts changed'); // DEBUG
            this.setState({requestId: this.createRequestId()}); // Create a new request id
        }
    }

    createRequestId() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < 15; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    groupByVendor(products: any) {
        const groupedProducts = products.reduce((grouped: any, product: any) => { // Iterate through the products array, accumulating the products into groups based on the callback function
            const vendor = product.vendor_name; // Get the vendor of the current product
            if (!grouped[vendor]) { // If the vendor doesn't exist in the groups object
                grouped[vendor] = []; // Create a new array for the vendor
            }
            grouped[vendor].push(product); // Push the product to the array
            return grouped;
        }, {});
        return groupedProducts;       
    }

    handleInputChange = (event: any, productId: number) => {
        const changedProducts: {productId: number, quantity: number}[] = [...this.state.changedProducts]; // Typescript doesn't like changedProducts.push({productId, quantity});
        const quantity = event.target.value; // Get the value of the input
        changedProducts.push({productId, quantity}); // Push the product id and quantity to the changedProducts array
        this.setState({changedProducts}); // Set the state of the changedProducts array to the new array
        console.log(this.state.changedProducts); // DEBUG
    }

    handleSubmit = (event: any) => {
        event.preventDefault();
        const payload = this.createPayload();
        axios.post(environment.apiUrl + '/bookStockchange.php', payload ) // Post the payload to the API via http request
            .then(response => {
                console.log(response); // DEBUG: Log the response to the console
            })
            .catch(error => { // Catch any errors
                console.log(error); // DEBUG: Log the error to the console
            });
    }

    createPayload() {
        const changedProducts: {productId: number, quantity: number}[] = this.state.changedProducts;
        const payload = {
            timestamp: new Date().toISOString(),
            type: 'Inflow',
            requestId: this.state.requestId,
            data: changedProducts
        };

        console.log(payload); // DEBUG
        return payload;
    }

    render() { // Render the component
        const { products } = this.state;
        const groupedProducts = this.groupByVendor(products);

        return ( // "Normal HTML" to be rendered
        
            <IonContent className="ion-padding">  { /* Only one element can be returned, so we wrap everything in a IonContent. This IonContent holds the table */ }
                <form onSubmit={this.handleSubmit}>
                {Object.entries(groupedProducts).map(([vendorName, products]) => ( // Object.entries returns an array of key-value pairs. 
                    // The key is the category id, and the value is the array of products. For each key-value pair, create an Table with the corresponding products
                    <div key={vendorName}>
                        <div className="ion-padding" slot="content">
                            <h2>{vendorName}</h2>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Stock</th>
                                        <th>Inflow</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(products as any[]).map((product: any) => ( // Fill the table with the corresponding products
                                        <tr key={product.id}>
                                            <td>{product.name}</td>
                                            <td>{product.stock}</td>
                                            <td>
                                                <IonInput 
                                                    placeholder='0'
                                                    min={0}
                                                    type='number'
                                                    onInput={(event) => this.handleInputChange(event, product.id)}    
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    ))}   
                <IonButton type="submit">Submit</IonButton>
                </form>
            </IonContent>
        
        )
        
    }
}

export default Inflow;