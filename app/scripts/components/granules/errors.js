'use strict';
import React from 'react';
import { connect } from 'react-redux';

var GranuleErrors = React.createClass({
  displayName: 'GranuleErrors',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is error for a granule</h1>
      </div>
    );
  }
});

export default connect(state => state)(GranuleErrors);