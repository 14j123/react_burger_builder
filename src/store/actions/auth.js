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
                const expiredDate = new Date(new Date().getTime() + res.data.expiresIn * 1000);
                localStorage.setItem('idToken', res.data.idToken);
                localStorage.setItem('expiredDate', expiredDate);
                localStorage.setItem('userId', res.data.localId);
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
    localStorage.removeItem('idToken');
    localStorage.removeItem('expiredDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
};

export const authCheckState = () =>{
    return dispatch => {
        const token = localStorage.getItem('idToken');
        if (token){
            const expiredDate = new Date(localStorage.getItem('expiredDate'));
            if(expiredDate <= new Date()){
                dispatch(logout());
            }else{
                const userId = localStorage.getItem('userId');
                const data = {
                    idToken: token,
                    localId: userId
                }
                dispatch(authSuccess(data));
                dispatch(checkAuthTimeout((expiredDate.getTime() - new Date().getTime()) / 1000));
            }
        }else{
            dispatch(logout());
        }
    }
}