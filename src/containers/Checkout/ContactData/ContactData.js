import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';

class ContactData extends Component {
    state={
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();

        this.setState({loading: true});
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
            customer: {
                name: 'JJ Burgery',
                address: {
                    street: 'test street 1',
                    zipCode: '12322',
                    country: 'Malaya'
                }
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false});
                this.props.history.push('/');
            })
            .catch(error => {this.setState({ loading: false})});
    }

    render () {
        let form = (
            <form>
                    <input type="text" name="name" placeholder='yourname'/>
                    <input type="email" name="email" placeholder='email'/>
                    <input type="text" name="street" placeholder='street name'/>
                    <input type="text" name="postalCode" placeholder='postal code'/>
                    <Button btnType="Success" clicked={this.orderHandler}>PLACE ORDER</Button>
                </form>
        );

        if (this.state.loading){
            form = <Spinner/>
        }

        return(
            <div className={classes.ContactData}>
                <h1>Please enter your contact details</h1>
                {form}
            </div>
        );
    }
}

export default ContactData;