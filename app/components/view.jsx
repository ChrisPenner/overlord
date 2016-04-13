import React from 'react';
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
        if (category){
            lines = category.lines.map((line, index) => {
                return (
                    <div className={"line"} key={index}>{line}</div>
                );
            });
        }

        return (
            <div className="view panel panel-default" onDrop={this.dataDrop} onDragOver={this.preventDefault} >
            <div className="panel-heading">{this.props.category || "Drag a category here!"} </div>
            <div className="panel-body lines"> 
            {lines}
            </div>
            </div>
        );
    }
});
export default View;
