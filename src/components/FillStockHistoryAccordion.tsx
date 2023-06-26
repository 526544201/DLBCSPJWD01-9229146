import React, { Component } from "react";
import axios from "axios";
import environment from "../environment";
import {
	IonAccordion,
	IonAccordionGroup,
	IonAlert,
	IonContent,
	IonItem,
	IonLabel,
	IonToast,
	RefresherEventDetail,
} from "@ionic/react";
import "./Tables.css";

interface FillAccordionProps {
	changeId: number;
	type: string;
}

/**
 * @class FillStockHistoryAccordion
 * @extends React.Component
 * @param {number} changeId - The id of the stockchange.
 * @param {string} type - The type of stockchange.
 * @description     This class displays the details of a stockchange in an accordion.
 *                  It receives the id and type of the stockchange as props.
 *                  It fetches the stockchange details from the API and fills an accordion with the stockchange details.
 */
class FillStockHistoryAccordion extends Component<FillAccordionProps> {
	state = {
		// Holds data in the component
		stockChanges: [],
		toastIsOpen: false,
		toastMessage: "",
		toastDuration: 0,
		alert401IsOpen: false,
		alert401Message: "",
	};

	componentDidMount() {
		// Lifecycle method - When the component is mounted (on the screen)
		this.getStocks();
	}

	/**
	 * Fetches stock data from the API and updates the component's state.
	 * @function getStocks
	 * @description  This function makes an HTTP GET request to retrieve stockhistory data from the API based on the `type`.
	 *               It updates the component's state `stockChanges` with the received data. If an error occurs,
	 *               appropriate error handling is performed based on the response status code.
	 *
	 *               If User is unauthorized, {@link handle401} is called. If other error, a toast is displayed with the error message sent by the API.
	 */
	getStocks() {
		axios
			.get(environment.apiUrl + "/getStockhistoryDetails.php", {
				...environment.config, // Spread Operator to merge the two objects and ensure that both are included in the request
				params: {
					changeId: this.props.changeId,
					type: this.props.type,
				},
			})
			.then((response) => {
				this.setState({ stockChanges: response.data });
			})
			.catch((error) => {
				// Catch any errors
				if (error.response.status === 401) {
					this.handle401(error);
				} else {
					this.setToast(
						true,
						error.message + " " + error.response.data.message,
						10000
					);
				}
			});
	}

	/**
	 * Sets the state to control the toast component.
	 * @function setToast
	 * @param {boolean} isOpen - Indicates whether the toast should be displayed (`true`) or hidden (`false`).
	 * @param {string} message - The message to be displayed in the toast. Optional, defaults to an empty string if not provided.
	 * @param {number} duration - The duration in milliseconds for which the toast should be visible. Optional, defaults to 0 if not provided.
	 */
	setToast(isOpen: boolean, message?: string, duration?: number) {
		this.setState({
			toastIsOpen: isOpen,
			toastMessage: message,
			toastDuration: duration,
		});
	}

	/**
	 * Handles a 401 error response by showing an alert.
	 * @function handle401
	 * @param {any} error - The error object containing the 401 response.
	 */
	handle401 = (error: any) => {
		this.setState({
			alert401IsOpen: true,
			alert401Message: error.response.data.message,
		});
	};

	render() {
		// Render the component
		let index = 0;
		const { stockChanges } = this.state;
		if (
			stockChanges.length === 0 ||
			stockChanges === undefined ||
			!Array.isArray(stockChanges)
		) {
			// If stockChanges state is empty or undefined or not an array (somehow stockChanges get the axios errormessage if there is no connection. Therefore check if Array),
			// 4do not display table, as maps() will throw an error and crash the app. Instead, display a loading message.
			return (
				<IonContent className="ion-padding">
					<div>Loading...</div>
					{/* Renders an IonToast component with dynamic duration and messages */}
					<IonToast
						isOpen={this.state.toastIsOpen}
						onDidDismiss={() => this.setToast(false)}
						message={this.state.toastMessage}
						duration={this.state.toastDuration}
					/>
					{/* Renders an IonAlert component to diplay an unauthorized access message */}
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
						buttons={["OK"]}
					/>
				</IonContent>
			);
		} else {
			return (
				<div>
					<table className="table">
						<thead>
							<tr>
								<th>Product</th>
								<th>Old Stock</th>
								<th>Change</th>
								<th>New Stock</th>
							</tr>
						</thead>
						<tbody>
							{this.state.stockChanges.length > 0 &&
								this.state.stockChanges.map(
									(stockChange: any) => (
										<tr key={index++}>
											<td>{stockChange.name}</td>
											<td>{stockChange.old_Stock}</td>
											<td>
												{this.props.type === "Outflow"
													? "- "
													: "+ "}
												{stockChange.quantity}
											</td>
											<td>{stockChange.new_Stock}</td>
										</tr>
									)
								)}
						</tbody>
					</table>
					{/* Renders an IonToast component with dynamic duration and messages */}
					<IonToast
						isOpen={this.state.toastIsOpen}
						onDidDismiss={() => this.setToast(false)}
						message={this.state.toastMessage}
						duration={this.state.toastDuration}
					/>
					{/* Renders an IonAlert component to diplay an unauthorized access message */}
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
						buttons={["OK"]}
					/>
				</div>
			);
		}
	}
}

export default FillStockHistoryAccordion;
