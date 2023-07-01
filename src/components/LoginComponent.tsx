import { IonContent, IonPopover, IonToast } from '@ionic/react';
import axios from 'axios';
import React, { Component } from 'react';
import environment from '../environment';
import './LoginComponent.css';

class LoginComponent extends Component {

    state = { // Holds data in the component
        email: '',
        password: '',
        toastIsOpen: false,
        toastMessage: "",
        toastDuration: 0
    }

    handleEmailChange = (event: any) => {
        this.setState({ email: event.target.value });
    }

    handlePasswordChange = (event: any) => {
        this.setState({ password: event.target.value });
    }

    handleSubmit = (event: any) => {
        event.preventDefault();
        // Send the email and password to the server
        axios.post(environment.apiUrl + '/login.php', {
            email: this.state.email,
            password: this.state.password
        })
        .then(response => {
            // Save the user data to local storage
            localStorage.setItem('username', JSON.stringify(response.data.username));
            localStorage.setItem('userId', JSON.stringify(response.data.userId));
            localStorage.setItem('token', JSON.stringify(response.data.token));
            localStorage.setItem('tokenExpires', JSON.stringify(response.data.tokenExpires));
            // Redirect to the next page
            switch(localStorage.getItem('userId')) {
                case `"1"`:
                    window.location.href = '/page/Products';
                    break;
                default:
                    window.location.href = '/page/Stock';
                    break;
            }
            
        })
        .catch(error => {
            this.setToast(true, error.message + ": " + error.response.data.message, 5000);
        });
    }  

    setToast = (isOpen: boolean, message?: string, duration?: number) => {
        this.setState({ toastIsOpen: isOpen, toastMessage: message, toastDuration: duration });
    }

    checkForToken() {
        if (localStorage.getItem("token") != null) {
            // Validate the token. If correct, redirect to the products page, if not, delete the token and render page as normal
        }
    }

    render() {
        this.checkForToken();
        return (
            <IonContent>
                <div className="container">     
                    <form className="login-form" onSubmit={this.handleSubmit}>
                    <img src="../assets/images/iu_logo.png" className="logo" />
                    <h2>Java and Web Development</h2>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="email" 
                            id="username" 
                            name="username" 
                            max="50"
                            value={this.state.email}
                            onChange={this.handleEmailChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            max="50"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}                          
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Login" />
                        <p className="message">
                        Forgot your password? <span id="click-trigger" className="link">View</span>
                        </p>
                        <p className="message">
                            Already logged in? <a href="./page/Products">Continue</a> {/* DEBUG: Automate & delete this */}
                        </p>
                    </div>
                    </form>
                </div>
                <IonToast
                    isOpen={this.state.toastIsOpen}
                    message={this.state.toastMessage}
                    onDidDismiss={() => this.setToast(false)}
                    duration={this.state.toastDuration}
                />
                <IonPopover
                    trigger="click-trigger"
                    triggerAction="click" 
                >
                    <IonContent className="ion-padding">
                        <p>Username: admin@admin.de</p>
                        <p>Password: 12345</p>
                        <p>Username: user@user.de</p>
                        <p>Password: abcdef</p>
                    </IonContent>
                </IonPopover>
            </IonContent>
        );
    }
}

export default LoginComponent;
