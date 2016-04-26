import React from 'react';
import {Panel} from 'react-bootstrap'
let View = React.createClass({
    preventDefault: function(e){
        e.preventDefault();
    },
    dataDrop: function(e){
        let category = e.dataTransfer.getData("text");
        this.props.alterView(this.props.index, category);
    },
    render: function(){
        let category = this.props.categories[this.props.category];
        let lines = []
        console.log(this.props.filters)
        if (category){
            // Don't filter if we don't have any filters
            if (this.props.filters.length === 0) {
                lines = category.lines;
            } else {
                const filterCheck = function(filter, line) {return new RegExp(filter.pattern, 'i').test(line)};
                lines = category.lines.filter((line) => {
                    return _.some(this.props.filters, (filter) => filterCheck(filter, line));
                });
            }
            lines = lines.map((line, index) => {
                        return (
                            <div className={"line"} key={index}>{line}</div>
                        );
                    });
        }
        const panelHeader = <div> {this.props.category || "Drag a category here!"}</div>;
        return (
            <Panel className="view" bsStyle="default" onDrop={this.dataDrop}
                onDragOver={this.preventDefault} header={panelHeader}>
                {lines}
            </Panel>
        );
    }
});
export default View;
