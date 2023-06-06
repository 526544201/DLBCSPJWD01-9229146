import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonButton, IonContent, IonInput, IonToast } from '@ionic/react';
import "./Tables.css";

class Inventory extends Component {
    state = { // Holds data in the component
        products: [],
        toastIsOpen: false,
        toastMessage: "",
        toastDuration: 0
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
        return; // TODO: Implement functionality!
    }

    handleSubmit = (event: any) => {
        return; // TODO: Implement functionality!
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
                        <div className="ion-padding" slot="content">
                            <h2>{shelfName}</h2>
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
                        </div>
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