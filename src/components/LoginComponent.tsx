import React, { Component } from 'react';
import axios from 'axios';
import environment from '../environment';
import { IonButton, IonInput } from '@ionic/react';

class LoginComponent extends Component {
    state = { // Holds data in the component
        email: '',
        password: ''
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
            // Redirect to the home page
            window.location.href = '/Page/Products';
        })
        .catch(error => {
            console.log(error);
        });
    }  

    render() { // Render the component
        return ( // "Normal HTML" to be rendered
            <div>  { /* Only one element can be returned, so we wrap everything in a div. This div holds the table */ }
                <form onSubmit={this.handleSubmit}>
                    <IonInput
                        type="email"
                        placeholder="Email"
                        value={this.state.email}
                        onIonChange={this.handleEmailChange}
                        required
                    /> 
                    <IonInput
                        type="password"
                        placeholder="Password"
                        value={this.state.password}
                        onIonChange={this.handlePasswordChange}
                        required
                    />
                    <IonButton type="submit">Log In</IonButton>
                </form>
            </div>
        )
    }
}

export default LoginComponent;