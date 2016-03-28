import React from 'react';
const Settings = React.createClass({
    render: function(){
        return (
            <div className="settings active">
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
