import React, { Component } from 'react';

class Orders extends Component {
    componentDidMount() {
        this.props.fetchOrders();
      }

        render() {
        return (
            <div id="content" className="container">
                <div className="row row-content">
                    <div className="col-12"><h2>Orders</h2><hr /></div>
                    <div className="row row-content">
                    <div className="col-12">
                        {JSON.stringify(this.props.orders.orders)}
                    </div>
                        </div></div></div>
        );
    }
}

export default Orders;