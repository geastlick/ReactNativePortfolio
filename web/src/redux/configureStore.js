import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import { Customers } from './customers.js';
import { Features } from './features.js';
import { Inventory } from './inventory.js';
import { Orders } from './orders.js';
import { Products } from './products.js';
import { Users } from './users.js';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            customers: Customers,
            features: Features,
            inventory: Inventory,
            orders: Orders,
            products: Products,
            users: Users
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
};