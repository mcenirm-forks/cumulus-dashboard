'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getCollection, listGranules } from '../../actions';
import { get } from 'object-path';
import { seconds, tally, fullDate, lastUpdated } from '../../utils/format';
import ErrorReport from '../errors/report';
import SortableTable from '../table/sortable';
import Overview from '../app/overview';

const tableHeader = [
  'Status',
  'Name',
  'PDR',
  'Duration',
  'Last Update'
];

const tableRow = [
  'status',
  (d) => <Link to={`/granules/granule/${d.granuleId}/overview`}>{d.granuleId}</Link>,
  'pdrName',
  (d) => seconds(d.duration),
  (d) => fullDate(d.updatedAt)
];

const activeStatus = 'ingesting OR processing OR cmr OR archiving';
const granuleFields = 'status,granuleId,pdrName,duration,updatedAt';

var CollectionOverview = React.createClass({
  displayName: 'CollectionOverview',

  propTypes: {
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    granules: React.PropTypes.object,
    collections: React.PropTypes.object
  },

  componentWillMount: function () {
    this.load();
  },

  componentWillReceiveProps: function (newProps) {
    if (newProps.params.collectionName !== this.props.params.collectionName) {
      this.load();
    }
  },

  load: function () {
    const collectionName = this.props.params.collectionName;
    this.props.dispatch(getCollection(collectionName));
    this.props.dispatch(listGranules({
      collectionName,
      fields: granuleFields,
      q: activeStatus,
      limit: 10
    }));
  },

  renderOverview: function (record) {
    if (record.error) {
      return <ErrorReport report={record.error} />;
    }
    const data = get(record, 'data', {});
    const granules = get(data, 'granulesStatus', {});
    const overview = [
      [seconds(data.averageDuration), 'Average Processing Time'],
      [tally(granules.ingesting), 'Granules Ingesting'],
      [tally(granules.processing), 'Granules Processing'],
      [tally(granules.cmr), 'Granules Pushed to CMR'],
      [tally(granules.archiving), 'Granules Archiving']
    ];
    return <Overview items={overview} inflight={record.inflight} />;
  },

  render: function () {
    const collectionName = this.props.params.collectionName;
    const { granules, collections } = this.props;
    const record = get(collections.map, collectionName);
    const { list } = granules;
    const { meta } = list;

    // create the overview boxes
    const overview = record ? this.renderOverview(record) : <div></div>;
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>{collectionName}</h1>
          <Link className='button button--small form-group__element--right button--disabled button--green' to={`/collections/edit/${collectionName}`}>Edit</Link>
          {lastUpdated(meta.queriedAt)}
          {overview}
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content'>Processing Granules{meta.count ? ` (${meta.count})` : null}</h2>
          </div>
          <SortableTable data={list.data} header={tableHeader} row={tableRow}/>
          <Link className='link--secondary' to={`/collections/collection/${collectionName}/granules`}>View All Granules</Link>
        </section>
      </div>
    );
  }
});

export default connect(state => state)(CollectionOverview);