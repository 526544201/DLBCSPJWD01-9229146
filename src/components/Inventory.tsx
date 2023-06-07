import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonContent, IonInput, IonRefresher, IonRefresherContent, IonToast, RefresherEventDetail } from '@ionic/react';
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
        requestId: "",
        alert401IsOpen: false,
        alert401Message: ""
    }

    componentDidMount() { // Lifecycle method - When the component is mounted (on the screen)
        this.getProducts();
    }

    getProducts() {
        axios.get(environment.apiUrl + '/getProducts.php', { 
            ...environment.config, // Spread Operator to merge the two objects and ensure that both are included in the request
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
        const groupedProducts: { [shelfId: string]: { products: any[]; shelfName: string} } = products.reduce((grouped: any, product: any) => { // Iterate through the products array, accumulating the products into groups based on the callback function
            const shelf = product.shelf_id; // Get the shelf id of the current product
            const shelfName = product.shelf_name;
            if (!grouped[shelf]) { // If the shelf name doesn't exist in the groups object
                grouped[shelf] = { products: [], shelfName: shelfName };
            }
            grouped[shelf].products.push(product); // Push the product to the products array
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
        axios.post(environment.apiUrl + '/bookStockchange.php', payload, environment.config ) // Post the payload to the API via http request
            .then(response => {
                this.setToast(true, response.data.message, 10000);
            })
            .catch(error => { // Catch any errors
                if(error.response.status === 401) {
                    this.handle401(error);
                } else {
                    this.setToast(true, error.message + " " + error.response.data.message, 10000);
                }
            })
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

    handle401 = (error: any) => {
        this.setState({alert401IsOpen: true, alert401Message: error.response.data.message});
    }

    handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
        this.getProducts();
        event.detail.complete();
    }

    render() { // Render the component
        const { products } = this.state;
        const groupedProducts = this.groupByShelf(products);

        return ( // "Normal HTML" to be rendered
        
            <div>  { /* Only one element can be returned, so we wrap everything in a div. This div holds the table */ }
                <form onSubmit={this.handleSubmit}>
                {Object.entries(groupedProducts).map(([shelfId, {products, shelfName}]) => ( // Object.entries returns an array of key-value pairs. 
                    // The key is the category id, and the value is the array of products. For each key-value pair, create an Table with the corresponding products
                    <div key={shelfId}>
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
            </div>
        
        )
        
    }
}

export default Inventory;