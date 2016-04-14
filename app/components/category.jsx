import React from 'react';
import {Button, Badge} from 'react-bootstrap'
let Category = React.createClass({
    dragStart: function(e){
        e.dataTransfer.setData("text", this.props.name);
    },
    render: function(){
        let unread = this.props.category.unread;
        let badge = null;
        if(unread){
            badge = <Badge pullRight={true}>{this.props.category.unread}</Badge>
        }
        return (
            <Button className="category" bsStyle="default" draggable onDragStart={this.dragStart}>
            {this.props.name}
            { badge }
            </Button>
        );
    }
});
export default Category;
