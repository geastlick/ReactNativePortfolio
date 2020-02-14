import React, { Component } from 'react';

class Customers extends Component {
    componentDidMount() {
        this.props.fetchCustomers();
      }

      render() {
        return (
            <div id="content" className="container">
                <div className="row row-content">
                    <div className="col-12"><h2>Customers</h2><hr /></div>
                    <div className="row row-content">
                    <div className="col-12">
                        {JSON.stringify(this.props.customers.customers)}
                    </div>
                        </div></div></div>
        );
    }
}

export default Customers;