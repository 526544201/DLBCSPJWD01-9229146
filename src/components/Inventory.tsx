import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonContent, IonInput, IonToast } from '@ionic/react';
import "./Tables.css";

interface InventoryProps {
    selectedDate: string
}

class Inventory extends Component <InventoryProps> {
    state = { // Holds data in the component
        products: [],
        updatedStocks: [],
        toastIsOpen: false,
        toastMessage: "",
        toastDuration: 0,
        requestId: ""
    }

    componentDidMount() { // Lifecycle method - When the component is mounted (on the screen)
        axios.get(environment.apiUrl + '/getProducts.php', { 
            params: {
                orderby: 'shelf_order'
            }
        }) 
            .then(response => {
                this.setState({ products: response.data }); // Set the state of the products array to the response data
            })
            .catch(error => { // Catch any errors
                this.setToast(true, error.message + " " + error.response.data.message, 10000);
            });
    }

    /**
    * Generates a random request ID. Gets called when the user changes the stock of a product.
    * @returns {string} The randomly generated request ID.
    */
    createRequestId() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < 15; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    groupByShelf(products: any) {
        const groupedProducts = products.reduce((grouped: any, product: any) => { // Iterate through the products array, accumulating the products into groups based on the callback function
            const shelf = product.shelf_name; // Get the shelf name of the current product
            if (!grouped[shelf]) { // If the shelf name doesn't exist in the groups object
                grouped[shelf] = []; // Create a new array for the shelf name
            }
            grouped[shelf].push(product); // Push the product to the array
            return grouped;
        }, {});
        return groupedProducts;       
    }

    handleInputChange = (event: any, productId: any) => {
        const updatedStocks: {productId: number, quantity: number}[] = [...this.state.updatedStocks]; // Typescript doesn't like updatedStocks.push({productId, quantity});
        const quantity = event.target.value; // Get the value of the input
        updatedStocks.push({productId, quantity}); // Push the product id and quantity to the updatedStocks array
        this.setState({updatedStocks}); // Set the state of the updatedStocks array to the new array
    }

    handleSubmit = (event: any) => {
        event.preventDefault();

        // Check if the user has changed the stock of any products
        if (Object.keys(this.state.updatedStocks).length === 0 || Object.keys(this.state.updatedStocks).length === undefined) {
            this.setToast(true, "No products have been updated!", 3000);
            return;
        }
        const payload = this.createPayload();
        axios.post(environment.apiUrl + '/bookStockchange.php', payload ) // Post the payload to the API via http request
            .then(response => {
                this.setToast(true, response.data.message, 10000);
            })
            .catch(error => { // Catch any errors
                this.setToast(true, error.message + " " + error.response.data.message, 10000);
            });
    }

    createPayload() {
        const changedProducts: {productId: number, quantity: number}[] = this.state.updatedStocks;
        const payload = {
            date: this.props.selectedDate,
            type: 'Inventory',
            requestId: this.state.requestId,
            data: changedProducts
        };
        return payload;
    }

    setToast = (isOpen: boolean, message?: string, duration?: number) => {
        this.setState({ toastIsOpen: isOpen, toastMessage: message, toastDuration: duration });
    }

    render() { // Render the component
        const { products } = this.state;
        const groupedProducts = this.groupByShelf(products);

        return ( // "Normal HTML" to be rendered
        
            <div>  { /* Only one element can be returned, so we wrap everything in a div. This div holds the table */ }
                <form onSubmit={this.handleSubmit}>
                {Object.entries(groupedProducts).map(([shelfName, products]) => ( // Object.entries returns an array of key-value pairs. 
                    // The key is the category id, and the value is the array of products. For each key-value pair, create an Table with the corresponding products
                    <div key={shelfName}>
                        <IonCard>
                            <div className="bannerDiv">
                                <IonCardHeader className="vendorHeader">{shelfName}</IonCardHeader>
                            </div>             
                            <IonCardContent className="cardTable">
                            <table className="table">
                                <colgroup>
                                    <col style={{ width: '50%' }} />
                                    <col style={{ width: '25%' }} />
                                    <col style={{ width: '25%' }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Stock</th>
                                        <th>New Stock</th>
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
                            </IonCardContent>                      
                        </IonCard>
                    </div>
                    ))}   
                <IonButton type="submit">Submit</IonButton>
                </form>
                <IonToast
                    isOpen={this.state.toastIsOpen}
                    message={this.state.toastMessage}
                    onDidDismiss={() => this.setToast(false)}
                    duration={this.state.toastDuration}
                />
            </div>
        
        )
        
    }
}

export default Inventory;