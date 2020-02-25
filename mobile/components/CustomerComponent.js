import React, { Component } from "react";
import { View } from "react-native";
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        customers: state.customers,
        orders: state.orders,
        products: state.products
    }
}

class Customer extends Component {
    static navigationOptions = {
        title: 'Customers'
    }

    render() {
        return <View></View>;
    }
}

export default Customer;