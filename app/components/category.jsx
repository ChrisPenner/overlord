import React from 'react';
let Category = React.createClass({
    dragStart: function(e){
        e.dataTransfer.setData("text", this.props.name);
    },
    render: function(){
        return (
            <div className="category btn" draggable onDragStart={this.dragStart}>
            {this.props.name}
            </div>
        );
    }
});
export default Category;
