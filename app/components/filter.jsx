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
    deleteFilter: function(event) {
        this.props.onChange(null);
    },
    render: function() {
        return (
            <li> 
                <input checked={this.props.filter.active} onChange={this.activeChanged} type="checkbox" />
                <input value={this.props.filter.pattern} onChange={this.patternChanged} type="text"/>
                <div className="close" onClick={this.deleteFilter}><span>&times;</span></div>
            </li>
        )
    }
});
export default Filter;
