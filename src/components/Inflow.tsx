import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonButton, IonInput } from '@ionic/react';

class Inflow extends Component {
    state = { // Holds data in the component
        products: [] ,
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

    handleInputChange = (event: any, productId: any) => {
        return;
    }

    handleSubmit = (event: any) => {
        return;
    }

    render() { // Render the component
        const { products } = this.state;
        const groupedProducts = this.groupByVendor(products);

        return ( // "Normal HTML" to be rendered
        
            <div>  { /* Only one element can be returned, so we wrap everything in a div. This div holds the table */ }
                <form onSubmit={this.handleSubmit}>
                {Object.entries(groupedProducts).map(([vendorId, products]) => ( // Object.entries returns an array of key-value pairs. 
                    // The key is the category id, and the value is the array of products. For each key-value pair, create an Table with the corresponding products
                    <div key={vendorId}>
                        <div className="ion-padding" slot="content">
                            <h2>{vendorId}</h2>
                            <table>
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
            </div>
        
        )
        
    }
}

export default Inflow;