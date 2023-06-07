import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import environment from '../environment';
import "./Tables.css";
import { IonAlert, IonCard, IonCardContent, IonContent, IonRefresher, IonRefresherContent, IonToast, RefresherEventDetail } from '@ionic/react';

interface OrderOverviewProps { // Create an interface for the props that are passed to this component - Otherwise TypeScript will complain
    vendorId: string 
}

class OrderOverview extends Component<OrderOverviewProps> {

    state = { // Holds data in the component
        products: [] as any,
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
        const vendorId = this.props.vendorId; 
        axios.get(environment.apiUrl + '/getProductsToOrder.php',  {
            ...environment.config, // Spread Operator to merge the two objects and ensure that both are included in the request
            params: { // Set the parameters for the request
                vendor: vendorId
            }, 
            
        } ) // Get the products from the API via http request
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

    setToast(isOpen: boolean, message?: string, duration?: number) { // Set the toast message
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

        const vendorBanner = products.length > 0 ? products[0].vendor_banner : ""; // Get the vendor name from the first product in the array

        return ( // "Normal HTML" to be rendered
            <IonContent className="ion-padding">  { /* Only one element can be returned, so we wrap everything in a IonContent. This IonContent holds the table */ }
                <IonCard>
                    <img src={vendorBanner} className="banner" />
                    <IonCardContent className="cardTable">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Stock</th>
                                    <th>Minimum</th>
                                    <th>To Order</th>
                                </tr>
                            </thead>
                            <tbody>
                                { /* Loop through the products array and create a row for each product */ }
                                {this.state.products.map((product: any) => (
                                    <tr key={product.id}> 
                                        <td>{product.name}</td>
                                        <td>{product.stock}</td>
                                        <td>{product.minAmount}</td>
                                        <td>
                                            {Math.ceil((product.minAmount - product.stock) / product.size)} {/* Calculate the amount of boxes to order. Round up to the nearest full box */}
                                            {product.size > 1 ? " Boxes" : ""} {/* If the product is sold in boxes, add "Boxes". Otherwise, leave the number alone */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </IonCardContent>
                </IonCard>
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

export default OrderOverview;