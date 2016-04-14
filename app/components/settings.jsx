import React from 'react';
import classnames from 'classnames'
const Settings = React.createClass({
    render: function(){
        const classes = classnames('settings', { 'active': this.props.active });
        const filters = this.props.filters.map((filter) => {
            return <li key={filter.name}><label>{filter.name}: <input type="text"/></label></li>
        });
        return (
            <div className={classes}>
                <div className="settings-module">
                    <h2>Syntax</h2>
                    <ul>
                        {filters}
                    </ul>
                </div>
            </div>
        )
    }
});
export default Settings;
