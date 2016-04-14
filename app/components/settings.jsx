import React from 'react';
import classnames from 'classnames'
const Settings = React.createClass({
    render: function(){
        const classes = classnames('settings', { 'active': this.props.active });
        return (
            <div className={classes}>
                <div className="settings-module">
                    <h2>Syntax</h2>
                    <ul>
                        <li><label>INFO: <input type="text"/></label></li>
                        <li><label>404: <input type="text"/></label></li>
                    </ul>
                </div>
            </div>
        )
    }
});
export default Settings;
