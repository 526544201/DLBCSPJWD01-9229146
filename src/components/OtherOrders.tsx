import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import environment from '../environment';
import { IonAccordion, IonAccordionGroup, IonAlert, IonContent, IonItem, IonLabel, IonRefresher, IonRefresherContent, IonToast, RefresherEventDetail } from '@ionic/react';
import "./Tables.css";

class OtherOrders extends Component {

    state = { // Holds data in the component
        products: [] as any[],
        toastIsOpen: false,
        toastMessage: "",
        toastDuration: 0,
        alert401IsOpen: false,
        alert401Message: ""
    }

    componentDidMount() { // Lifecycle method - When the component is mounted (on the screen)
        this.getOrders();
    }

    getOrders() {
        axios.get(environment.apiUrl + '/getProductsToOrderOther.php', environment.config) // Get the products from the API via http request
            .then(response => {
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

    groupByVendor(products: any) {
        const groupedProducts: { [vendorId: string]: { products: any[]; vendorLogo: string, vendorName: string} } = products.reduce((grouped: any, product: any) => { // Iterate through the products array, accumulating the products into groups based on the callback function
            const vendor = product.vendor_id; // Get the vendor id of the current product
            const vendorLogo = product.vendor_logo;
            const vendorName = product.vendor_name;
            if (!grouped[vendor]) { // If the vendor id doesn't exist in the groups object
                grouped[vendor] = { products: [], vendorLogo: vendorLogo, vendorName: vendorName };
            }
            grouped[vendor].products.push(product); // Push the product to the products array
            return grouped;
        }, {});
        return groupedProducts;      
    }

    setToast(isOpen: boolean, message?: string, duration?: number) {
        this.setState({ toastIsOpen: isOpen, toastMessage: message, toastDuration: duration });
    }

    handle401 = (error: any) => {
        this.setState({alert401IsOpen: true, alert401Message: error.response.data.message});
    }

    handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
        this.getOrders();
        event.detail.complete();
    }

    render() { // Render the component
        const { products } = this.state;
        const groupedProducts = this.groupByVendor(products);

        // TODO: Add check for empty products array!

        return ( // "Normal HTML" to be rendered
            <IonContent className="ion-padding">
                <IonAccordionGroup>
                    {Object.entries(groupedProducts).map(([vendorId, { products, vendorLogo, vendorName}]) => ( // Typescript shenanigans / Object.entries returns an array of key-value pairs. 
                        // The key is the vendor id, and the value is the array of products. For each key-value pair, create an IonAccordion
                        // Get the vendor logo from the first product in the array
                        <IonAccordion key={vendorId}> 
                            <IonItem slot="header" color="light">
                                <IonLabel><img src={vendorLogo} className="middle-logo" /> {vendorName} </IonLabel>
                            </IonItem>
                            <div className="ion-padding" slot="content">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Stock</th>
                                            <th>Minimum</th>
                                            <th>Order Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(products as any[]).map((product: any) => ( // Again, Typescript shenanigans / Fill the table with the corresponding products
                                            <tr key={product.id}>
                                                <td>{product.name}</td>
                                                <td>{product.stock}</td>
                                                <td>{product.minAmount}</td>
                                                <td>
                                                    {Math.ceil((product.minAmount - product.stock) / product.size)}
                                                    {product.size > 1 ? " Boxes" : ""}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </IonAccordion>
                    ))}
                </IonAccordionGroup>
                <IonToast
                    isOpen={this.state.toastIsOpen}
                    onDidDismiss={() => this.setToast(false)}
                    message={this.state.toastMessage}
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
            </IonContent>
        )
    }
}

export default OtherOrders;