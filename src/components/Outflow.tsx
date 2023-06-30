import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonContent, IonInput, IonRefresher, IonRefresherContent, IonToast, RefresherEventDetail } from '@ionic/react';
import "./Tables.css";

interface OutflowProps { // Create an interface for the props that are passed to this component - Otherwise TypeScript will complain
    selectedDate: string,
    searchTerm: string
}

// TODO: MAYBE: Inflow and Outflow could be combined into one component, with a prop to determine which one it is

class Outflow extends Component<OutflowProps> {
    state = { // Holds data in the component
        products: [],
        changedProducts: [],
        requestId: '',
        toastIsOpen: false,
        toastMessage: "",
        toastDuration: 0,
        productChanges: {} as { [key: number]: any },
        alert401IsOpen: false,
        alert401Message: ''
    }

    componentDidMount() { // Lifecycle method - When the component is mounted (on the screen)
        this.getProducts();
    }

    componentDidUpdate(prevProps: any, prevState: any) { // Lifecycle method - When the component is updated
        if (prevState.changedProducts.length !== this.state.changedProducts.length) { // If the changedProducts array has changed
            this.setState({ requestId: this.createRequestId() }); // Create a new request id
        }
    }

    getProducts() {
        axios.get(environment.apiUrl + '/getProducts.php', environment.config) // Get the products from the API via http request
            .then(response => {
                this.setState({ products: response.data }); // Set the state of the products array to the response data

                const productChanges: { [key: number]: any } = {};

                response.data.forEach((product: any) => {
                    productChanges[product.id] = null;
                });

                this.setState({ productChanges: productChanges });
            })
            .catch(error => { // Catch any errors
                if (error.response.status === 401) {
                    this.handle401(error);
                } else {
                    this.setToast(true, error.message + " " + error.response.data.message, 10000);
                }
            })
    }

    createRequestId() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*(){}[]<>?/-_+=';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < 15; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        console.log(result); // DEBUG
        return result;
    }

    groupByCategory(products: any) {
        const groupedProducts: { [categoryId: string]: { products: any[]; categoryName: string } } = products.reduce((grouped: any, product: any) => { // Iterate through the products array, accumulating the products into groups based on the callback function
            const category = product.category_id; // Get the category id of the current product
            const categoryName = product.category_name;
            if (!grouped[category]) { // If the category id doesn't exist in the groups object
                grouped[category] = { products: [], categoryName: categoryName };
            }
            grouped[category].products.push(product); // Push the product to the products array
            return grouped;
        }, {});
        return groupedProducts;
    }

    handleInputChange = (event: any, productId: any) => {
        const changedProducts: { productId: number, quantity: number }[] = [...this.state.changedProducts]; // Typescript doesn't like changedProducts.push({productId, quantity});
        const quantity = event.target.value; // Get the value of the input
        // Check if the product is already in the changedProducts array, and if so, update the quantity, otherwise add it to the array. Major Bug!
        if (changedProducts.find(product => product.productId === productId)) { // If the product is already in the array
            const index = changedProducts.findIndex(product => product.productId === productId); // Get the index of the product
            if (quantity === '') { // If the quantity is empty
                changedProducts.splice(index, 1); // Remove the product from the array
            } else {
                changedProducts[index].quantity = quantity; // Update the quantity
            }
        } else {
            changedProducts.push({ productId, quantity }); // Push the product id and quantity to the changedProducts array
        }

        this.setState({ changedProducts }); // Set the state of the changedProducts array to the new array

        const updatedProductChanges = {
            ...this.state.productChanges,
            [productId]: quantity
        };

        this.setState({ productChanges: updatedProductChanges });
    }

    handleSubmit = (event: any) => {
        event.preventDefault();
        if (this.state.changedProducts.length === 0) { // If there are no changed products
            this.setToast(true, "No products changed!", 3000);
            return;
        }
        // Check if enough stock is available
        const changedProducts: { productId: number, quantity: number }[] = this.state.changedProducts;
        const products: any[] = this.state.products;
        try {
            products.map(product => { // Iterate through the products array
                const changedProduct = changedProducts.find(changedProduct => changedProduct.productId === product.id); // Find the corresponding changed product
                // if changed product quantity is lower than stuck, return error, else continue
                if (changedProduct && changedProduct.quantity > product.stock) { // If the changed product quantity is higher than the stock
                    // Get the product name from the products array
                    const productName = products.find(product => product.id === changedProduct.productId).name;

                    this.setToast(true, `Not enough stock for ${productName} available!`, 5000);
                    throw new Error(`Not enough stock for ${productName} available!`);
                }
            });
        } catch {
            return;
        }

        const payload = this.createPayload();
        axios.post(environment.apiUrl + '/bookStockchange.php', payload, environment.config) // Post the payload to the API via http request
            .then(response => {
                this.setToast(true, response.data.message, 10000);
                this.setState({ changedProducts: [] }); // Reset the changedProducts array
                this.setState({ requestId: '' }); // Reset the request id
                this.setState({ productChanges: {} }); // Reset the productChanges array
            })
            .catch(error => { // Catch any errors
                if (error.response.status === 401) {
                    this.handle401(error);
                } else {
                    this.setToast(true, error.message + " " + error.response.data.message, 10000);
                }
            })
    }

    createPayload() {
        const changedProducts: { productId: number, quantity: number }[] = this.state.changedProducts;
        const payload = {
            date: this.props.selectedDate,
            type: 'Outflow',
            requestId: this.state.requestId,
            data: changedProducts
        };
        return payload;
    }

    setToast = (isOpen: boolean, message?: string, duration?: number) => {
        this.setState({ toastIsOpen: isOpen, toastMessage: message, toastDuration: duration });
    }

    handle401 = (error: any) => {
        this.setState({ alert401IsOpen: true, alert401Message: error.response.data.message });
    }

    handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
        this.getProducts();
        event.detail.complete();
    }

    render() { // Render the component
        const { products, productChanges } = this.state;
        const { searchTerm } = this.props;
        const groupedProducts = this.groupByCategory(products);

        return ( // "Normal HTML" to be rendered        
            <div>  { /* Only one element can be returned, so we wrap everything in a div. This div holds the table */}
                <form onSubmit={this.handleSubmit}>
                    {Object.entries(groupedProducts).map(([categoryId, { products, categoryName }]) => { // Object.entries returns an array of key-value pairs. 
                        // The key is the category id, and the value is the array of products. For each key-value pair, create an Table with the corresponding products
                        const filteredProducts = (products as any).filter((product: any) =>
                            product.name.toLowerCase().includes(searchTerm.toLowerCase()));

                        if (filteredProducts.length === 0) return null; // If there are no products, don't display the table

                        return (
                            <div key={categoryId}>
                                <IonCard>
                                    <div className="bannerDiv">
                                        <IonCardHeader className="vendorHeader">{categoryName}</IonCardHeader>
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
                                                    <th>Out</th>
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
                        )
                    })}
                    <IonButton type="submit">Submit</IonButton>
                </form>

                <IonToast
                    isOpen={this.state.toastIsOpen}
                    message={this.state.toastMessage}
                    onDidDismiss={() => this.setToast(false)}
                    duration={this.state.toastDuration}
                />
                <IonAlert
                    isOpen={this.state.alert401IsOpen}
                    onDidDismiss={() => {
                        this.setState({ alert401IsOpen: false });
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

            </div>

        )

    }
}

export default Outflow;