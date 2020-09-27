import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

class ContactData extends Component {
    state={
        orderForm:{
            name: {
                elementType: 'input',
                elementConfig: {
                    type:'text',
                    placeholder:'your name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type:'email',
                    placeholder:'your email'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type:'text',
                    placeholder:'street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type:'text',
                    placeholder:'ZIP code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 6
                },
                valid: false,
                touched: false
            },
            country:{
                elementType: 'input',
                elementConfig: {
                    type:'text',
                    placeholder:'country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod:{
                elementType: 'select', 
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ],
                },
                value: 'fastest',
                valid: true
            }
        },
        formIsValid: false
    }

    orderHandler = (event) => {
        event.preventDefault();

        const userData = {}
        for(let formDataKey in this.state.orderForm){
            userData[formDataKey] = this.state.orderForm[formDataKey].value
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: userData,
            userId: this.props.userId
        }
        this.props.onOrderBurger(order, this.props.token);
    }

    checkValidity (value, rules) {
        let isValid = true;

        if(!rules){
            return true;
        }

        if (rules.required){
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }

        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) =>{
        const updatedOrderForm = {...this.state.orderForm};
        const updatedOrderFormElem = {...this.state.orderForm[inputIdentifier]};
        updatedOrderFormElem.value = event.target.value;
        updatedOrderFormElem.touched = true;
        updatedOrderFormElem.valid = this.checkValidity(updatedOrderFormElem.value, updatedOrderFormElem.validation);
        updatedOrderForm[inputIdentifier] = updatedOrderFormElem;
        
        let formIsValid = true;

        for(let inputIdentifier in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        this.setState({
            orderForm: updatedOrderForm,
            formIsValid: formIsValid
        })
    }

    render () {
        const formElementArray = [];
        
        for(let key in this.state.orderForm){
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                    {formElementArray.map(elem => (
                        <Input 
                            key={elem.id}
                            elementType={elem.config.elementType}
                            elementConfig={elem.config.elementConfig} 
                            value={elem.config.value}
                            invalid={!elem.config.valid}
                            shouldValidate={elem.config.validation}
                            touched={elem.config.touched}
                            changed={(event) => this.inputChangedHandler(event, elem.id)}/>
                    ))}
                    <Button btnType= "Success" disabled={!this.state.formIsValid}>PLACE ORDER</Button>
                </form>
        );

        if (this.props.loading){
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

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.idToken,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));