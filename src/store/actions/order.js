import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const initPurchase = () => {
    return {
        type: actionTypes.INIT_PURCHASE
    };
};

export const purchaseBurgerStart = () => {
    return{
        type: actionTypes.PURCHASE_BURGER_START
    };
}

export const purchaseBurger = (order, token) =>{
    return dispatch => {
        dispatch(purchaseBurgerStart());
        axios.post('/orders.json?auth=' + token, order)
            .then(response => {
                dispatch(purchaseBurgerSuccess(response.data.name, order));
            })
            .catch(error => {
                dispatch(purchaseBurgerFail(error));
            });
    }
}

export const purchaseBurgerSuccess = (id, orderData) =>{
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    };
}

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    };
}

export const fetchOrderStart = () => {
    return{
        type: actionTypes.FETCH_ORDER_START
    };
}

export const fetchOrder = (token, userId) =>{
    return dispatch => {
        dispatch(fetchOrderStart());
        const queryParam = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
        axios.get('/orders.json' + queryParam)
            .then(res => {
                const fetchedOrders = [];

                for (let key in res.data){
                    fetchedOrders.push({
                        ...res.data[key], 
                        id: key
                    });
                }
                dispatch(fetchOrderSuccess(fetchedOrders));
            })
            .catch(err => {
                dispatch(fetchOrderFail(err));
            })
    }
}

export const fetchOrderSuccess = (orders) =>{
    return {
        type: actionTypes.FETCH_ORDER_SUCCESS,
        orders: orders
    };
}

export const fetchOrderFail = (error) => {
    return {
        type: actionTypes.FETCH_ORDER_FAIL,
        error: error
    };
}
