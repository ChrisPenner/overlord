import React from 'react';
let Category = React.createClass({
    dragStart: function(e){
        e.dataTransfer.setData("text", this.props.name);
    },
    render: function(){
        let unread = this.props.category.unread;
        let badge = null;
        if(unread){
            badge = <span className="badge">{this.props.category.unread}</span>
        }
        return (
            <div className="category btn btn-default" draggable onDragStart={this.dragStart}>
            {this.props.name}
            { badge }
            </div>
        );
    }
});
export default Category;
