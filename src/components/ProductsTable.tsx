import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonActionSheet, IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/react';

import './Tables.css';

class ProductsTable extends Component {
    state = { // Holds data in the component
        products: [],
        selectedProduct: null as any,
        modalProduct: null as any,
        modalIsOpen: false
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

    openActionSheet = (product: any) => {
        this.setState({selectedProduct: product});
    };

    showModal = (product: any) => {
        console.log('Edit clicked on ' + product.name);
        this.setState({modalProduct: product});
        this.setState({modalIsOpen: true});
    }

    render() { // Render the component
        const { products, selectedProduct } = this.state;
        return ( // "Normal HTML" to be rendered
            <IonContent className="ion-padding">  { /* Only one element can be returned, so we wrap everything in a IonContent. This IonContent holds the table */ }

                <IonActionSheet
                    isOpen = {selectedProduct !== null} // If the user did not click on a product, do not show action sheet
                    header={selectedProduct?.name ? selectedProduct.name : "Error - This should not happen!"} // If selectedProduct is not null, set header to nane of product. Otherwise display error
                    onDidDismiss={() => this.setState({selectedProduct: null})} // When the action sheet is dismissed, set selectedProduct to null
                    buttons={[
                        {
                            text: 'Edit',
                            handler: () => this.showModal(selectedProduct)
                        },
                        {
                            text: 'Delete',
                            role: 'destructive',
                            handler: () => console.log('Delete clicked on ' + selectedProduct?.name),
                        },
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            data: {
                            action: 'cancel',
                            }
                        }
                      ]}
                    />

                    <IonModal isOpen={this.state.modalIsOpen}>
                        <IonHeader>
                            <IonToolbar>
                            <IonTitle>{this.state.modalProduct?.name}</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => this.setState({modalIsOpen: false})}>Close</IonButton>
                            </IonButtons>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent className="ion-padding">
                            <h2>{this.state.modalProduct?.name}</h2>
                        </IonContent>
                        </IonModal>
        
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
                            <tr key={product.id} 
                                className="clickable"
                                onClick={() => this.openActionSheet(product)}
                                > 
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