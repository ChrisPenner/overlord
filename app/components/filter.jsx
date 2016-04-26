import React from 'react';
import _ from 'lodash'
const Filter = React.createClass({
    patternChanged: function(event) {
        const pattern = event.target.value
        let newFilter = _.cloneDeep(this.props.filter);
        newFilter.pattern = pattern;
        this.props.onChange(newFilter);
    },
    activeChanged: function(event) {
        const active = event.target.value
        console.log(active)
        let newFilter = _.cloneDeep(this.props.filter);
        newFilter.active = !newFilter.active;
        this.props.onChange(newFilter);
    },
    render: function() {
        return (
            <li> 
                <input checked={this.props.filter.active} onChange={this.activeChanged} type="checkbox" />  
                    <input value={this.props.filter.pattern} onChange={this.patternChanged} type="text"/>
            </li>
        )
    }
});
export default Filter;
