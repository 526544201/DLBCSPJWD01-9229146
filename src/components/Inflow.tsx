import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonContent, IonInput, IonToast } from '@ionic/react';
import "./Tables.css";

interface InflowProps { // Create an interface for the props that are passed to this component - Otherwise TypeScript will complain
    selectedDate: string,
    searchTerm: string
}

// TODO: MAYBE: Inflow and Outflow could be combined into one component, with a prop to determine which one it is

class Inflow extends Component <InflowProps> {
    state = { // Holds data in the component
        products: [] , // Holds the products from the db
        changedProducts: [], // Holds the products where user changes the stock
        requestId: '',
        toastIsOpen: false,
        toastMessage: "",
        toastDuration: 0,
        productChanges: {} as { [key: number]: any}, // No idea, why this is necessary, but otherwise Input fields lose value on filtering. Working with changedProducts did not work.
    }

    componentDidMount() { // Lifecycle method - When the component is mounted (on the screen)
        axios.get(environment.apiUrl + '/getProducts.php', { 
            params: { 
                orderby: 'item_no_byvendor'
            }
        })
            .then(response => {
                this.setState({ products: response.data }); // Set the state of the products array to the response data
                const productChanges: { [key: number]: any} = {};

                response.data.forEach((product: any) => {
                    productChanges[product.id] = null;
                });

                this.setState({productChanges: productChanges});
            })
            .catch(error => { // Catch any errors
                this.setToast(true, error.message + " " + error.response.data.message, 10000);
            });
    }

    componentDidUpdate(prevProps: any, prevState: any) { // Lifecycle method - When the component is updated
        if (prevState.changedProducts.length !== this.state.changedProducts.length) { // If the changedProducts array has changed
            this.setState({requestId: this.createRequestId()}); // Create a new request id
        }
    }
    /**
        * Generates a random request ID. Gets called when the user changes the stock of a product.
        * @returns {string} The randomly generated request ID.
    */
    createRequestId() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*(){}[]<>?/-_+=';
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < 15; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    /**
         * Groups products by the vendor.
         * @param {Array} products - The array of products to be grouped.
         * @returns {Object} An object containing grouped products.
     */
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

    /**
         * Handles the input change event and updates the state changedProducts with an array of key-value pairs of the changed product ids and the quantities.
         * @param {Event} event - The event that triggered the function. Target is the input field the user changed.
         * @param {number} productId - The ID of the product being changed.
     */
    handleInputChange = (event: any, productId: number) => {
        const changedProducts: {productId: number, quantity: number}[] = [...this.state.changedProducts]; // Typescript doesn't like changedProducts.push({productId, quantity});
        const quantity = event.target.value; // Get the value of the input
        // Check if the product is already in the changedProducts array, and if so, update the quantity, otherwise add it to the array. Major Bug!
        if(changedProducts.find(product => product.productId === productId)) { // If the product is already in the array
            const index = changedProducts.findIndex(product => product.productId === productId); // Get the index of the product
            if (quantity === '') { // If the quantity is empty
                changedProducts.splice(index, 1); // Remove the product from the array
            } else {
                changedProducts[index].quantity = quantity; // Update the quantity
            }
        } else {
            changedProducts.push({productId, quantity}); // Push the product id and quantity to the changedProducts array
        }
        
        this.setState({changedProducts}); // Set the state of the changedProducts array to the new array

        const updatedProductChanges = {
            ...this.state.productChanges,
            [productId]: quantity
        };

        this.setState({productChanges: updatedProductChanges});
    }

    /**
         * Handles the form submission event, sends a POST request to the API, and displays a toast message.
         * 
         * @param {Event} event - The event that triggered the function. Target is the form that was submitted.
    */
    handleSubmit = (event: any) => {
        event.preventDefault();
        if(this.state.changedProducts.length === 0) { // If there are no changed products
            this.setToast(true, "No products changed!", 3000);
            return;
        }

        const payload = this.createPayload();
        axios.post(environment.apiUrl + '/bookStockchange.php', payload ) // Post the payload to the API via http request
            .then(response => {
                this.setToast(true, response.data.message, 10000);
                this.setState({changedProducts: []}); // Reset the changedProducts array
                this.setState({requestId: ''}); // Reset the request id
                this.setState({productChanges: {}}); // Reset the productChanges array
            })
            .catch(error => { // Catch any errors
                this.setToast(true, error.message + " " + error.response.data.message, 10000);
            });
    }

    handleDebugSubmit = (event: any) => {
        event.preventDefault();
        console.log("ProductChanges:");
        console.log(this.state.productChanges);
        console.log("changedProducts:");
        console.log(this.state.changedProducts);
        console.log("Payload:");
        console.log(this.createPayload());
    }

    /**
         * Creates a payload object with the changed products, the request ID, and the type of stockchange.
         * 
         * @returns {Object} The payload object.
     */
    createPayload() {
        const changedProducts: {productId: number, quantity: number}[] = this.state.changedProducts;
        const payload = {
            date: this.props.selectedDate,
            type: 'Inflow',
            requestId: this.state.requestId,
            data: changedProducts
        };
        return payload;
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
        const { products, productChanges } = this.state;
        const { searchTerm } = this.props;
        const groupedProducts = this.groupByVendor(products);

        return ( // "Normal HTML" to be rendered  
            <div>  { /* Only one element can be returned, so we wrap everything in a div. This div holds the table */ }
                <form onSubmit={this.handleDebugSubmit}>
                    <IonButton type="submit">Debug</IonButton>
                </form>
                <form onSubmit={this.handleSubmit}>
                {Object.entries(groupedProducts).map(([vendorName, products]) => { // Object.entries returns an array of key-value pairs. 
                    // The key is the category id, and the value is the array of products. For each key-value pair, create an Table with the corresponding products
                    const filteredProducts = (products as any).filter((product: any) =>
                        product.name.toLowerCase().includes(searchTerm.toLowerCase()));

                    if (filteredProducts.length === 0) return null; // If there are no products, don't display the table

                    const vendorLogo = filteredProducts[0].vendor_logo; // Get the vendor banner of the first product in the array
                    return(
                    <div key={vendorName}>
                        <IonCard>
                            <div className="bannerDiv">
                                <IonCardHeader className="vendorHeader">{<img src={vendorLogo} className="middle-logo"/>}{vendorName}</IonCardHeader>
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
                                        <th>Inflow</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(filteredProducts as any[]).map((product: any) => ( // Fill the table with the corresponding products
                                        <tr key={product.id}>
                                            <td>{product.name}</td>
                                            <td>{product.stock}</td>
                                            <td>
                                                <IonInput 
                                                    placeholder='0'
                                                    min={0}
                                                    type='number'
                                                    value={productChanges[product.id]}
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
                )})}   
                <IonButton type="submit">Submit</IonButton>
                </form>
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

export default Inflow;