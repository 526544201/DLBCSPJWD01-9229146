import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonActionSheet, IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonListHeader, IonInput, IonFooter, IonSelect, IonSelectOption, IonFab, IonFabButton, IonIcon, IonToast, useIonAlert, IonAlert, IonRefresher, IonRefresherContent, RefresherEventDetail } from '@ionic/react';

import './Tables.css';
import { add } from 'ionicons/icons';

interface ProductsTableProps {
    searchTerm: string;
}

class ProductsTable extends Component <ProductsTableProps> {
    state = { // Holds data in the component
        products: [],
        vendors: [],
        categories: [],
        shelves: [],
        selectedProduct: null as any,
        modalProduct: null as any,
        modalType: null as any,
        modalIsOpen: false,
        toastIsOpen: false,
        toastDuration: 0,
        toastMessage: "",
        alertIsOpen: false,
        productToDelete: null as any,
        alert401IsOpen: false,
        alert401Message: "",
        alert401subHeader: "",
        alert401Route: "" as string
    }

    getProducts() {
        axios.get(environment.apiUrl + '/getProducts.php', environment.config) // Get the products from the API via http request
        .then(response => {
            this.checkForUserAuthentication();
            this.setState({ products: response.data }); // Set the state of the products array to the response data
        })
        .catch(error => { // Catch any errors
            if(error.response.status === 401) {
                this.handle401(error);
            } else {
                this.setToast(true, error.message + " " + error.response.data.message, 10000);
            }
        })
    }

    getVendors() {
        axios.get(environment.apiUrl + '/getVendors.php', environment.config) // Get the products from the API via http request
        .then(response => {
            this.setState({ vendors: response.data }); // Set the state of the products array to the response data
        })
        .catch(error => { // Catch any errors
            if(error.response.status === 401) {
                this.handle401(error);
            } else {
                this.setToast(true, error.message + " " + error.response.data.message, 10000);
            }
        })
    }

    getCategories() {
        axios.get(environment.apiUrl + '/getCategories.php', environment.config) // Get the products from the API via http request
        .then(response => {
            this.setState({ categories: response.data }); // Set the state of the products array to the response data
        })
        .catch(error => { // Catch any errors
            if(error.response.status === 401) {
                this.handle401(error);
            } else {
                this.setToast(true, error.message + " " + error.response.data.message, 10000);
            }
        })
    }

    getShelves() {
        axios.get(environment.apiUrl + '/getShelves.php', environment.config) // Get the products from the API via http request
        .then(response => {
            this.setState({ shelves: response.data }); // Set the state of the products array to the response data
        })
        .catch(error => { // Catch any errors
            if(error.response.status === 401) {
                this.handle401(error);
            } else {
                this.setToast(true, error.message + " " + error.response.data.message, 10000);
            }
        })
    }

    componentDidMount() { // Lifecycle method - When the component is mounted (on the screen)
        this.getProducts();
    }

    checkForUserAuthentication() {
        console.log("Checking for user authentication");
        if(!localStorage.userId || !localStorage.token) {
            this.setState({alert401IsOpen: true, alert401Message: "Please log in again.", alert401subHeader: "Unauthorized Access.", alert401Route: "/page/Login"});
        }
        if(localStorage.userId != `"1"`) {
            switch(localStorage.userId) {
                case `"2"`:
                    this.setState({alert401IsOpen: true, alert401Message: "Redirecting", alert401subHeader: "Insufficient Permission.", alert401Route: "/page/Stock"});
                    break;
                default: 
                    this.setState({alert401IsOpen: true, alert401Message: "Please log in again.", alert401subHeader: "Unauthorized Access.", alert401Route: "/page/Login"});
                    break;
            }    
        }
    }

    openActionSheet = (product: any) => { // Open the action sheet when a product is clicked
        this.setState({selectedProduct: product}); // Set the selectedProduct to the product that was clicked
    };

    deleteProduct = (product: any) => { // Delete the product that was clicked
        axios.post(environment.apiUrl + '/deleteProduct.php', {id: product.id}, environment.config) // Send the id of the product to the API via http request
        .then(response => {
            this.setToast(true, "Product successfully deleted", 5000);
            this.getProducts(); // Update the products
        })
        .catch(error => { // Catch any errors
            if(error.response.status === 401) {
                this.handle401(error);
            } else {
                this.setToast(true, error.message + " " + error.response.data.message, 10000);
            }
        })
    }

    showModal = (product: any, type: any) => { // Open the modal with info about the product that was clicked
        //For population of the form, get the vendors, categories and shelves
        this.getVendors();
        this.getCategories();
        this.getShelves();
        this.setState({modalProduct: product}); // Set the modalProduct to the product that was clicked
        this.setState({modalType: type}); // Set the modalType to new or edit product
        this.setState({modalIsOpen: true}); // Open the modal
    }

    handleModalSubmit = (event: any) => { 
        event.preventDefault(); 

        const name = this.state.modalProduct.name;
        const categoryId = this.state.modalProduct.category_id;
        const size = this.state.modalProduct.size;
        const minAmount = this.state.modalProduct.minAmount;
        const vendorId = this.state.modalProduct.vendor_id;
        const itemNo = this.state.modalProduct.item_no_byvendor;
        const shelfId = this.state.modalProduct.shelf_id;
        const shelfOrder = this.state.modalProduct.shelf_order;

        let payload;

        // Check if the product is new or should be updated
        if (this.state.modalProduct.id === null) { // If the product is new
            payload = {
                name: name,
                categoryId: categoryId,
                size: size,
                minAmount: minAmount,
                vendorId: vendorId,
                itemNo: itemNo,
                shelfId: shelfId,
                shelfOrder: shelfOrder
            }
        } else { // If the product should be updated
            payload = {
                id: this.state.modalProduct.id,
                name: name,
                categoryId: categoryId,
                size: size,
                minAmount: minAmount,
                vendorId: vendorId,
                itemNo: itemNo,
                shelfId: shelfId,
                shelfOrder: shelfOrder
            }
        }

        // Send the payload to the API
        axios.post(environment.apiUrl + '/updateProduct.php', payload, environment.config)
        .then(response => {
            this.setToast(true, "Product successfully updated", 5000);
            this.getProducts(); // Update the products
        })
        .catch(error => { // Catch any errors
            if(error.response.status === 401) {
                this.handle401(error);
            } else {
                this.setToast(true, error.message + " " + error.response.data.message, 10000);
            }
        })

        this.setState({modalIsOpen: false, modalProduct: null, modalType: null}); // Close the modal
    }

    handleInputChange = (field: string, value: any) => {
        this.setState((prevState: any) => ({
            modalProduct: {
                ...prevState.modalProduct,
                [field]: value
                },
            }));
        };

    setToast = (isOpen: boolean, message?: string, duration?: number) => {
        this.setState({ toastIsOpen: isOpen, toastMessage: message, toastDuration: duration });
    }

    handle401 = (error: any, subheader?: string) => {
        this.setState({alert401IsOpen: true, alert401Message: error.response.data.message, alert401Route: "/page/Login"});
        if(subheader) {
            this.setState({alert401subHeader: subheader});
        } else {
            this.setState({alert401subHeader: "Please log in again."});
        }
    }

    handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
        this.getProducts();
        event.detail.complete();
    }

    render() { // Render the component
        const { products, selectedProduct } = this.state;
        const { searchTerm } = this.props;
        const { alert401Route } = this.state;

        const filteredProducts = products.filter((product: any) => {
            return product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.vendor_name.toLowerCase().match(searchTerm.toLowerCase());
        });

        return ( // "Normal HTML" to be rendered
            <IonContent className="ion-padding">  { /* Only one element can be returned, so we wrap everything in a IonContent. This IonContent holds the table */ }
                <IonFab 
                    slot="fixed" 
                    vertical="bottom" 
                    horizontal="end" 
                    style={{zIndex: "999"}} 
                    onClick= {() => this.showModal({id: null, name: "", category_id: null, size: null, minAmount: null, vendor_id: null, item_no_byvendor: null, shelf_id: null, shelf_order: null}, "add")} // When the fab is clicked, open the modal with an empty product
                    > 
                    <IonFabButton>
                        <IonIcon icon={add}></IonIcon>
                    </IonFabButton>
                </IonFab>
                <IonActionSheet
                    isOpen = {selectedProduct !== null} // If the user did not click on a product, do not show action sheet
                    header={selectedProduct?.name ? selectedProduct.name : "Error - This should not happen!"} // If selectedProduct is not null, set header to nane of product. Otherwise display error
                    onDidDismiss={() => this.setState({selectedProduct: null})} // When the action sheet is dismissed, set selectedProduct to null
                    buttons={[
                        {
                            text: 'Edit',
                            handler: () => this.showModal(selectedProduct, "edit")
                        },
                        {
                            text: 'Delete',
                            role: 'destructive',
                            handler: () =>  {
                                this.setState({productToDelete: selectedProduct});
                                this.setState({alertIsOpen: true});
                            }
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

                    <IonModal isOpen={this.state.modalIsOpen} style={{ '--height': '80vh' }}>
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
                                        <IonLabel>
                                            {this.state.modalType === "add" ? "New Product" : "Edit Product"}
                                        </IonLabel>
                                    </IonListHeader>
                                    <IonItem>
                                        <IonLabel slot="start">Name</IonLabel>
                                        <IonInput 
                                            id="name" 
                                            aria-label="Name" 
                                            slot="end" 
                                            className="ion-text-right" 
                                            max="255"
                                            value={this.state.modalProduct?.name} 
                                            onInput={(e) => this.handleInputChange('name', (e.target as HTMLInputElement).value)}
                                            required
                                            ></IonInput>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel slot="start">Category</IonLabel>
                                        <IonSelect 
                                            id="category"
                                            aria-label="category" 
                                            interface="action-sheet" 
                                            slot="end" 
                                            value={this.state.modalProduct?.category_id} 
                                            onIonChange = {(e) => this.handleInputChange('category_id', e.detail.value)}
                                            >
                                            {this.state.categories.map((category: any) => (
                                                <IonSelectOption key={category.id} value={category.id}>{category.name}</IonSelectOption>
                                            ))}
                                            required
                                        </IonSelect>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel slot="start">Order Size</IonLabel>
                                        <IonInput 
                                            id="size" 
                                            aria-label="Order Size" 
                                            type="number" 
                                            slot="end" 
                                            className="ion-text-right" 
                                            value={this.state.modalProduct?.size} 
                                            min="1" 
                                            max="999"
                                            onInput={(e) => this.handleInputChange('size', (e.target as HTMLInputElement).value)}
                                            required
                                            ></IonInput>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel slot="start">Min Amount</IonLabel>
                                        <IonInput 
                                            id="minAmount" 
                                            aria-label="Min Amount" 
                                            type="number" 
                                            slot="end" 
                                            className="ion-text-right" 
                                            value={this.state.modalProduct?.minAmount} 
                                            min="1"
                                            max="999"
                                            onInput={(e) => this.handleInputChange('minAmount', (e.target as HTMLInputElement).value)}
                                            required
                                            ></IonInput>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel slot="start">Vendor</IonLabel>
                                        <IonSelect 
                                            aria-label="vendor"
                                            interface="action-sheet" 
                                            slot="end" 
                                            value={this.state.modalProduct?.vendor_id} 
                                            onIonChange = {(e) => this.handleInputChange('vendor_id', e.detail.value)}
                                            >
                                            {this.state.vendors.map((vendor: any) => (
                                                <IonSelectOption key={vendor.id} value={vendor.id}>{vendor.name}</IonSelectOption>
                                            ))}
                                            required
                                        </IonSelect>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel slot="start">ItemNo.</IonLabel>
                                        <IonInput 
                                            id="itemNo" 
                                            aria-label="Item Number" 
                                            type="number" 
                                            slot="end" 
                                            className="ion-text-right" 
                                            value={this.state.modalProduct?.item_no_byvendor} 
                                            min="1"
                                            max="999999999999999"
                                            onInput={(e) => this.handleInputChange('item_no_byvendor', (e.target as HTMLInputElement).value)}
                                            required
                                            ></IonInput>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel slot="start">Shelf</IonLabel>
                                        <IonSelect 
                                            aria-label="shelf" 
                                            interface="action-sheet" 
                                            slot="end" 
                                            value={this.state.modalProduct?.shelf_id} 
                                            onIonChange = {(e) => this.handleInputChange('shelf_id', e.detail.value)}
                                            >
                                            {this.state.shelves.map((shelf: any) => (
                                                <IonSelectOption key={shelf.id} value={shelf.id}>{shelf.name}</IonSelectOption>
                                            ))}
                                            required
                                        </IonSelect>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel slot="start">Place in shelf</IonLabel>
                                        <IonInput 
                                            id="shelf_order" 
                                            aria-label="shelfPlace" 
                                            type="number" 
                                            slot="end" 
                                            className="ion-text-right" 
                                            value={this.state.modalProduct?.shelf_order} 
                                            min="1"
                                            max="99"
                                            onInput={(e) => this.handleInputChange('shelf_order', (e.target as HTMLInputElement).value)}                                            
                                            required
                                            ></IonInput>
                                    </IonItem>
                                </IonList>
                                <IonFooter>
                                    <IonToolbar>
                                        <IonButtons slot="start">
                                            <IonButton onClick={() => {this.setState({modalIsOpen: false, modalProduct: null})}}>Cancel</IonButton>
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
                    <colgroup>
                        <col style={{ width: '20%' }} />
                        <col className="no-mobile" style={{ width: '20%' }} />
                        <col className="no-mobile" style={{ width: '20%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '5%' }} />
                    </colgroup>                    
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className="no-mobile">Category</th>
                            <th className="no-mobile">Item Nr.</th>
                            <th>Vendor</th>
                            <th>Stock</th>
                            <th>Min.</th>
                        </tr>
                    </thead>
                    <tbody>
                        { /* Loop through the products array and create a row for each product */ }
                        {filteredProducts.map((product: any) => (
                            <tr key={product.id} 
                                className="clickable"
                                onClick={() => this.openActionSheet(product)}
                                > 
                                    <td>{product.name}</td>
                                    <td className="no-mobile">{product.category_name}</td>
                                    <td className="no-mobile">{product.item_no_byvendor}</td>
                                    <td>
                                        <span className="vendor-field">
                                            {product.vendor_logo ? (
                                                <span className="tiny-symbol">
                                                    <img src={product.vendor_logo} alt={product.vendor_name} ></img>
                                                </span>
                                            ): null}
                                            <span className="vendor-name">
                                                {product.vendor_name}
                                            </span>
                                        </span>
                                    </td>
                                    <td>{product.stock}</td>
                                    <td>{product.minAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <IonToast
                    isOpen={this.state.toastIsOpen}
                    message={this.state.toastMessage}
                    onDidDismiss={() => this.setToast(false)}
                    duration={this.state.toastDuration}
                />

                <IonAlert
                    isOpen={this.state.alertIsOpen}
                    onDidDismiss={() => { 
                        this.setState({productToDelete: null});
                        this.setState({alertIsOpen: false})}}
                    header={'Delete Product'}
                    message={'Are you sure you want to delete ' + this.state.productToDelete?.name + '?'}
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel'
                        },
                        {
                            text: 'Delete',
                            handler: () => this.deleteProduct(this.state.productToDelete)
                        }
                    ]}
                />

                <IonAlert
                    isOpen={this.state.alert401IsOpen}
                    onDidDismiss={() => { 
                        if(alert401Route == "/page/Login") {
                            localStorage.clear();
                        }
                        window.location.href = alert401Route;
                        this.setState({alert401IsOpen: false});
                    }}
                    header="Unauthorized Access"
                    subHeader={this.state.alert401subHeader}
                    message={this.state.alert401Message}
                    buttons={['OK']}
                />

                <IonRefresher slot="fixed" onIonRefresh={this.handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

            </IonContent>
        )
    }
}

export default ProductsTable;