import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonActionSheet, IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonListHeader, IonInput, IonFooter, IonSelect, IonSelectOption } from '@ionic/react';

import './Tables.css';

class ProductsTable extends Component {
    state = { // Holds data in the component
        products: [],
        vendors: [],
        categories: [],
        shelves: [],
        selectedProduct: null as any,
        modalProduct: null as any,
        modalIsOpen: false
    }

    getProducts() {
        axios.get(environment.apiUrl + '/getProducts.php') // Get the products from the API via http request
        .then(response => {
            console.log(response); // DEBUG: Log the response to the console 
            this.setState({ products: response.data }); // Set the state of the products array to the response data
        })
        .catch(error => { // Catch any errors
            console.log(error); // DEBUG: Log the error to the console
        });
    }

    getVendors() {
        axios.get(environment.apiUrl + '/getVendors.php') // Get the products from the API via http request
        .then(response => {
            console.log(response); // DEBUG: Log the response to the console 
            this.setState({ vendors: response.data }); // Set the state of the products array to the response data
        })
    }

    getCategories() {
        axios.get(environment.apiUrl + '/getCategories.php') // Get the products from the API via http request
        .then(response => {
            console.log(response); // DEBUG: Log the response to the console 
            this.setState({ categories: response.data }); // Set the state of the products array to the response data
        })
    }

    getShelves() {
        axios.get(environment.apiUrl + '/getShelves.php') // Get the products from the API via http request
        .then(response => {
            console.log(response); // DEBUG: Log the response to the console 
            this.setState({ shelves: response.data }); // Set the state of the products array to the response data
        })
    }

    componentDidMount() { // Lifecycle method - When the component is mounted (on the screen)
        this.getProducts();
    }

    openActionSheet = (product: any) => { // Open the action sheet when a product is clicked
        this.setState({selectedProduct: product}); // Set the selectedProduct to the product that was clicked
    };

    showModal = (product: any) => { // Open the modal with info about the product that was clicked
        console.log('Edit clicked on ' + product.name);  // DEBUG
        //For population of the form, get the vendors, categories and shelves
        this.getVendors();
        this.getCategories();
        this.getShelves();
        this.setState({modalProduct: product}); // Set the modalProduct to the product that was clicked
        this.setState({modalIsOpen: true}); // Open the modal
    }

    handleModalSubmit = (event: any) => { 
        event.preventDefault(); 
        // TODO: Add save functionality!
        console.log('Submit clicked on ' + this.state.modalProduct.name); // DEBUG
        this.setState({modalIsOpen: false, modalProduct: null}); // Close the modal
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
                            <IonTitle>Product Form</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => {this.setState({modalIsOpen: false, modalProduct: null})}}>Close</IonButton>
                            </IonButtons>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent className="ion-padding">
                            {  /* TODO: Seperate component for modal? */}
                            <form onSubmit={this.handleModalSubmit}>
                                <IonList>
                                    <IonListHeader lines="full">
                                        <IonLabel>{this.state.modalProduct?.name}</IonLabel>
                                    </IonListHeader>
                                    <IonItem>
                                        <IonLabel slot="start">Name</IonLabel>
                                        <IonInput id="name" aria-label="Name" slot="end" className="ion-text-right" value={this.state.modalProduct?.name} required></IonInput>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel slot="start">Category</IonLabel>
                                        <IonSelect aria-label="Category" interface="action-sheet" slot="end" value={this.state.modalProduct?.category_id} >
                                            {this.state.categories.map((category: any) => (
                                                <IonSelectOption key={category.id} value={category.id}>{category.name}</IonSelectOption>
                                            ))}
                                        </IonSelect>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel slot="start">Order Size</IonLabel>
                                        <IonInput id="size" aria-label="Order Size" type="number" slot="end" className="ion-text-right" value={this.state.modalProduct?.size} min='1' required></IonInput>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel slot="start">Min Amount</IonLabel>
                                        <IonInput id="minAmount" aria-label="Min Amount" type="number" slot="end" className="ion-text-right" value={this.state.modalProduct?.minAmount} min='1' required></IonInput>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel slot="start">Vendor</IonLabel>
                                        <IonSelect aria-label="Vendor" interface="action-sheet" slot="end" value={this.state.modalProduct?.vendor_id} >
                                            {this.state.vendors.map((vendor: any) => (
                                                <IonSelectOption key={vendor.id} value={vendor.id}>{vendor.name}</IonSelectOption>
                                            ))}
                                        </IonSelect>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel slot="start">ItemNo.</IonLabel>
                                        <IonInput id="itemNo" aria-label="Item Number" type="number" slot="end" className="ion-text-right" value={this.state.modalProduct?.item_no_byvendor} min='1' required></IonInput>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel slot="start">Shelf</IonLabel>
                                        <IonSelect aria-label="Shelf" interface="action-sheet" slot="end" value={this.state.modalProduct?.shelf_id} >
                                            {this.state.shelves.map((shelf: any) => (
                                                <IonSelectOption key={shelf.id} value={shelf.id}>{shelf.name}</IonSelectOption>
                                            ))}
                                        </IonSelect>
                                    </IonItem>
                                </IonList>
                                <IonFooter>
                                    <IonToolbar>
                                        <IonButtons slot="start">
                                            <IonButton onClick={() => {this.setState({modalIsOpen: false, modalProduct: null})}}>Cancle</IonButton>
                                        </IonButtons>
                                        <IonButtons slot="end">
                                            <IonButton type="submit">Submit</IonButton>
                                        </IonButtons>
                                    </IonToolbar>
                                </IonFooter>
                            </form>
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