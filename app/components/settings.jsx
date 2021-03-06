import React from 'react';
import classnames from 'classnames'
import Filter from './filter'
import {Glyphicon} from 'react-bootstrap'
const Settings = React.createClass({
    render: function(){
        const classes = classnames('settings', { 'active': this.props.active });
        const filters = this.props.filters.map((filter, id) => {
            return <Filter key={id} filter={filter} onChange={this.props.filterChanged.bind(null, id)}/>
        });
        return (
            <div className={classes}>
                <div className="settings-module">
                    <h2>Filters</h2>
                    <ul>
                        {filters}
                        <li onClick={this.props.addFilter}> 
                            <Glyphicon glyph="plus" />
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
});
export default Settings;
