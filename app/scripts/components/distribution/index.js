'use strict';
import React from 'react';
import { connect } from 'react-redux';

import { interval, getDistribution } from '../../actions';

// slower 20 second update interval here
const UPDATE = 20000;

const Distribution = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func
  },

  componentWillMount: function () {
    this.query();
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) this.cancelInterval();
  },

  query: function () {
    const { dispatch } = this.props;
    if (this.cancelInterval) this.cancelInterval();
    this.cancelInterval = interval(() => dispatch(getDistribution()), UPDATE, true);
  },

  render: function () {
    return (
      <div className='page__distribution'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>Resources</h1>
          </div>
        </div>

        <div className='page__content page__content__nosidebar'>
          <section className='page__section'>
            <div className='row'>

            </div>
          </section>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Distribution);
