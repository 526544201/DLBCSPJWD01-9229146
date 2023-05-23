import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonButton, IonInput } from '@ionic/react';

class Outflow extends Component {
    state = { // Holds data in the component
        products: [],
        changedProducts: [],
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
        console.log(result); // DEBUG
        return result;
    }

    groupByCategory(products: any) {
        const groupedProducts = products.reduce((grouped: any, product: any) => { // Iterate through the products array, accumulating the products into groups based on the callback function
            const category = product.category_id; // Get the category id of the current product
            if (!grouped[category]) { // If the category id doesn't exist in the groups object
                grouped[category] = []; // Create a new array for the category id
            }
            grouped[category].push(product); // Push the product to the array
            return grouped;
        }, {});
        return groupedProducts;       
    }

    handleInputChange = (event: any, productId: any) => {
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
            type: 'Outflow',
            requestId: this.state.requestId,
            data: changedProducts
        };

        console.log(payload); // DEBUG
        return payload;
    }

    render() { // Render the component
        const { products } = this.state;
        const groupedProducts = this.groupByCategory(products);

        return ( // "Normal HTML" to be rendered
        
            <div>  { /* Only one element can be returned, so we wrap everything in a div. This div holds the table */ }
                <form onSubmit={this.handleSubmit}>
                {Object.entries(groupedProducts).map(([categoryId, products]) => ( // Object.entries returns an array of key-value pairs. 
                    // The key is the category id, and the value is the array of products. For each key-value pair, create an Table with the corresponding products
                    <div key={categoryId}>
                        <div className="ion-padding" slot="content">
                            <h2>{categoryId}</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Stock</th>
                                        <th>Out</th>
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
            </div>
        
        )
        
    }
}

export default Outflow;