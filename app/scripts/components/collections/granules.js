'use strict';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getCollectionId, lastUpdated } from '../../utils/format';
import {
  listGranules,
  filterGranules,
  clearGranulesFilter
} from '../../actions';
import {
  tableHeader,
  tableRow,
  tableSortProps,
  bulkActions
} from '../../utils/table-config/granules';
import List from '../table/list-view';
import Dropdown from '../form/dropdown';
import statusOptions from '../../utils/status';

var CollectionGranules = React.createClass({
  displayName: 'CollectionGranules',

  propTypes: {
    granules: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    params: React.PropTypes.object
  },

  generateQuery: function () {
    const collectionId = getCollectionId(this.props.params);
    return { collectionId };
  },

  generateBulkActions: function () {
    const { granules } = this.props;
    return bulkActions(granules);
  },

  render: function () {
    const collectionName = this.props.params.name;
    const collectionVersion = this.props.params.version;
    const { list } = this.props.granules;
    const { meta } = list;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description '>{collectionName} / {collectionVersion}</h1>
          <Link className='button button--small form-group__element--right button--green' to={`/collections/edit/${collectionName}/${collectionVersion}`}>Edit</Link>
          <dl className="metadata__updated">
            <dd>{lastUpdated(meta.queriedAt)}</dd>
          </dl>
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>Granules <span className='num--title'>{meta.count ? ` (${meta.count})` : null}</span></h2>
          </div>
          <div className='filters filters__wlabels'>
          <Dropdown
          options={statusOptions}
          action={filterGranules}
          clear={clearGranulesFilter}
          paramKey={'status'}
          label={'Status'}
          />
          </div>

          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listGranules}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId={'granuleId'}
            sortIdx={6}
          />
        </section>

      </div>
    );
  }
});

export default connect(state => state)(CollectionGranules);
