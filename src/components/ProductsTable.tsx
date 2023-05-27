import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';


import './Tables.css';
import { IonContent } from '@ionic/react';

class ProductsTable extends Component {
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

    render() { // Render the component
        return ( // "Normal HTML" to be rendered
            <IonContent className="ion-padding">  { /* Only one element can be returned, so we wrap everything in a IonContent. This IonContent holds the table */ }
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Vendor</th>
                            <th>Stock</th>
                            <th>Minimum</th>
                        </tr>
                    </thead>
                    <tbody>
                        { /* Loop through the products array and create a row for each product */ }
                        {this.state.products.map((product: any) => (
                            <tr key={product.id} className="clickable"> 
                                <td>{product.name}</td>
                                <td>{product.vendor_id}</td>
                                <td>{product.stock}</td>
                                <td>{product.minAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </IonContent>
        )
    }
}

export default ProductsTable;