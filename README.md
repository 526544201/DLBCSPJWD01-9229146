![alt text](https://github.com/526544201/DLBCSPJWD01-9229146/blob/master/public/assets/images/iu_logo.png?raw=true)
# Introduction

This project is the Portfolio Project for my Java and Web Development course at the IU Internationale Hochschule.    

The app is a simple inventoy management app. It allows user to add, edit and delete products and change stock levels. Also it recommends (based on set minimum stock levels) the order quantity for the next order.  
All the stockchanges can be viewed in a list.


## Tech Stack

**Client:** React

**Server:** MySQL


## Original Concept

### Login & Security

The user needs to login to access any of the APIs except the login API. If the user logs in successfully the server will generate a JWT which expires in 1 hour. This token will be saved on client side in the local storage and will be sent along every further request. Then the server validates it before processing any queries to the database. 

### The App

After successfully logging in, the user gets on the products overview page, which contains 1 component. This component shows a table of all the products, their stocklevel, their minimum stock level and further information.  
If the user clicks on a product, an actionsheet / modal will be opened, allowing the user to change or delete a product. A  floating action button also pops up the modal but with no entries. This allows the user to add a product.  
 

On the left is a sidemenu for navigation for the different pages.  

Another view is the stockmanagement page. This page consists of 3 components. The user can switch freely between them via tabs:
- Inflow
- Outflow
- Inventory

#### Inflow component
The products are displayed in multiple tables. For every vendor there is one separate table. This tables are hidden in accordions for better overview. The products are listed ordered by the article no. from the vendor, as this is the order they are listed on the delivery notes.  
The table shows the name of the product, it's current stock level and a number input field (> 0). If a user changes an input field, the component saves the value of the input field along with the product id in an array as a state. After hitting the submit button, this array will be sent via a POST request to the API for updating the database. A toast component will inform the user of the success or failure of such an action.
#### Outflow component
Similar to the inflow component, this component will display the products, but in a single table, ordered alphabetically. The functionality stays the same.
#### Inventory component
This component displays the products in multiple tables. Every shelf in the storage gets a separate table. The products are ordered by their place on the shelf to allow a quick inventory take with a tablet or phone without much searching. The functionality stays the same. 

Lastly, there is the orderoverview page. This page of 2 components navigatable via 3 tabs. The first 2 tabs are different views for the same component showing the products which are below the minimum stock level and the recommended order amount. The 2 views are for the 2 main vendors. The products are ordered by the arrangement of the platforms where the user can order from.  
The third view is a different component which displays products grouped by smaller vendors which do not need to be ordered that much.

### APIs & Server

There will be numerous APIs split after their functionality. The main ones are:
- Fetching product data
- Fetching products to order
- Inserting stockchanges
- Updating stocklevels

Every request from the app will be checked first for the JWT. This token will be validated. If it is missing or invalid, the script will exit with an appropiate error message and http code.  
Every request needs to be sanitized and prepared before a query can happen to prevent SQL injections and other security vulnerabilities.  
INSERT and UPDATE requests will be hashed and this hash will be saved in a field in the appropiate database table to provide idempotency.

## ER Diagram

![alt text](https://github.com/526544201/DLBCSPJWD01-9229146/blob/master/Documentation/ER_Diagram_DB.png?raw=true)

## Run Locally

Clone the project

```bash
  git clone TODO: Add link
```
### 1. TODO: PHP installation / xampp setup

### 2. App setup
Before proceeding, make sure your computer has Node.js installed.

Install dependencies

```bash
  npm install -g @ionic/cli
```



Go to the project directory

```bash
  cd project
```

Start the server

```bash
  ionic serve
```
