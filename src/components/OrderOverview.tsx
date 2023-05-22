import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import environment from '../environment';

interface OrderOverviewProps { // Create an interface for the props that are passed to this component - Otherwise TypeScript will complain
    vendorId: string 
}

class OrderOverview extends Component<OrderOverviewProps> {

    state = { // Holds data in the component
        products: []
    }

    componentDidMount() { // Lifecycle method - When the component is mounted (on the screen)
        const vendorId = this.props.vendorId; 
        axios.get(environment.apiUrl + '/getProductsToOrder.php', {
            params: { // Set the parameters for the request
                vendor: vendorId
            }
        }) // Get the products from the API via http request
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
            <div>  { /* Only one element can be returned, so we wrap everything in a div. This div holds the table */ }
                <table>
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
            </div>
        )
    }
}

export default OrderOverview;