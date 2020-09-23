import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    idToken: null,
    userId: null,
    error: null,
    loading: false
};

const authReducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.AUTH_START:
            return updateObject(state, {error: null, loading: true});
        case actionTypes.AUTH_SUCCESS:
            return updateObject(state, {
                idToken: action.idToken,
                userId: action.userId,
                error: null, 
                loading: false
            });
        case actionTypes.AUTH_FAILED:
            return updateObject(state, {
                error: action.error, 
                loading: false
            });
        default:
            return state;
    }
};

export default authReducer;