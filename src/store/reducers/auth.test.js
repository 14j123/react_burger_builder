import reducer from './auth';
import * as actionTypes from '../actions/actionTypes';

describe('auth reducer' , ()=>{
    it ('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual({
            idToken: null,
            userId: null,
            error: null,
            loading: false,
            redirectPath: '/'
        });
    });

    it('should store the token upon login', () => {
        expect(reducer({
            idToken: null,
            userId: null,
            error: null,
            loading: false,
            redirectPath: '/'
        }, {
            type: actionTypes.AUTH_SUCCESS,
            idToken: 'some-token',
            userId: 'some-user-id'
        })).toEqual({
            idToken: 'some-token',
            userId: 'some-user-id',
            error: null,
            loading: false,
            redirectPath: '/'
        })
    });
});