import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () =>{
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (authData) =>{
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: authData.idToken,
        userId: authData.localId,
    };
};

export const authFail = (error) =>{
    return {
        type: actionTypes.AUTH_FAILED,
        error: error
    }
};

export const auth = (email, password, isSignUp) =>{
    return dispatch => {
        dispatch (authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCI6x-pSCIXSSVJa3I5--MRx-LcNPtv1aw';
        if(!isSignUp){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCI6x-pSCIXSSVJa3I5--MRx-LcNPtv1aw';
        }
        axios.post(url, authData)
            .then(res => {
                dispatch(authSuccess(res.data));
                dispatch(checkAuthTimeout(res.data.expiresIn));
            })
            .catch(err => {
                dispatch(authFail(err.response.data.error));
            });
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        },expirationTime * 1000);
    };
};

export const logout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};