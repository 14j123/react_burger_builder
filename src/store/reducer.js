import * as actionTypes from './actions';

const intialState = {
    ingredients: null,
    totalPrice: 4
};

const reducer = (state = intialState , action) =>{
    switch(action.type){
        case actionTypes.ADD_INGREDIENT:

        case actionTypes.REMOVE_INGREDIENT:

    }
};

export default reducer;