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
        alert401Message: "",
        alert401subHeader: "",
        alert401Route: ""
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
                this.checkForUserAuthentication();
            })
            .catch(error => { // Catch any errors
                if (error.response) {
                    if (error.response.status === 401) {
                        this.handle401(error);
                    } else if (error.response.data && error.response.data.message) {
                        this.setToast(true, error.response.data.message, 10000);
                    } else {
                        this.setToast(true, error.message, 10000);
                    }
                } else {
                    this.setToast(true, error.message, 10000);
                }
            });
    }

    setToast(isOpen: boolean, message?: string, duration?: number) { // Set the toast message
        this.setState({ toastIsOpen: isOpen, toastMessage: message, toastDuration: duration });
    }

    checkForUserAuthentication() {
        if(!localStorage.userId || !localStorage.token) {
            this.setState({alert401IsOpen: true, alert401Message: "Please log in again.", alert401subHeader: "Unauthorized Access.", alert401Route: "/page/Login"});
        }
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
                                    <th>Min</th>
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
                                            {product.size > 1 ? " Box" : ""} {/* If the product is sold in boxes, add "Boxes". Otherwise, leave the number alone */}
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
							this.setState({ alert401IsOpen: false });
							if(this.state.alert401Route == "/page/Login") {
								localStorage.clear();
							}
							window.location.href = this.state.alert401Route;
						}}
						header="Unauthorized Access"
						subHeader={this.state.alert401subHeader}
						message={this.state.alert401Message}
						buttons={["OK"]}
					/>
                <IonRefresher slot="fixed" onIonRefresh={this.handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
            </IonContent>
        )
    }
}

export default OrderOverview;