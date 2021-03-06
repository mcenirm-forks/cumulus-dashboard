'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { interval, listPdrs, getCount } from '../../actions';
import { lastUpdated, tally, displayCase } from '../../utils/format';
import { bulkActions } from '../../utils/table-config/pdrs';
import { tableHeader, tableRow, tableSortProps } from '../../utils/table-config/pdr-progress';
import List from '../table/list-view';
import Overview from '../app/overview';
import { updateInterval } from '../../config';

var PdrOverview = React.createClass({
  displayName: 'PdrOverview',

  propTypes: {
    dispatch: PropTypes.func,
    pdrs: PropTypes.object,
    stats: PropTypes.object
  },

  componentWillMount: function () {
    this.cancelInterval = interval(this.queryStats, updateInterval, true);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  queryStats: function () {
    this.props.dispatch(getCount({
      type: 'pdrs',
      field: 'status'
    }));
  },

  generateQuery: function () {
    return {};
  },

  generateBulkActions: function () {
    return bulkActions(this.props.pdrs);
  },

  renderOverview: function (count) {
    const overview = count.map(d => [tally(d.count), displayCase(d.key)]);
    return <Overview items={overview} inflight={false} />;
  },

  render: function () {
    const { stats } = this.props;
    const { list } = this.props.pdrs;
    const { count, queriedAt } = list.meta;
    // create the overview boxes
    const pdrCount = get(stats.count, 'data.pdrs.count', []);
    const overview = this.renderOverview(pdrCount);
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>PDR Overview</h1>
          {lastUpdated(queriedAt)}
          {overview}
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>All PDRs <span className='num--title'>{count ? ` (${tally(count)})` : null}</span></h2>
          </div>

          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listPdrs}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            sortIdx={5}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId={'pdrName'}
          />
          <Link className='link--secondary link--learn-more' to='/pdrs/active'>View Currently Active PDRs</Link>
        </section>
      </div>
    );
  }
});

export default connect(state => ({
  stats: state.stats,
  pdrs: state.pdrs
}))(PdrOverview);
