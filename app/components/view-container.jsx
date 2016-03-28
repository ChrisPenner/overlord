import React from 'react';
import View from './view'
let ViewContainer = React.createClass({
    render: function(){
        let views = this.props.views.map((category, index) => {
            return (
                <View category={category} key={index} index={index} categories={this.props.categories} alterView={this.alterView}/>
            );
        });
        let layouts = {
            'one-wide': (<div className="hor-layout layout hflex"> { views[0] } </div>),
                'two-wide': (<div className="hor-layout layout hflex"> { views[0] } {views[1]} </div>),
                'three-wide': (<div className="hor-layout layout hflex"> { views[0] } {views[1]} {views[2]}</div>),
                'two-high': (<div className="vert-layout layout vflex"> { views[0] } {views[1]}</div>),
                'combo': (<div className="layout hflex"><div className="combo-layout layout vflex"> { views[0] } {views[1]}</div><div className="layout vflex"> {views[2]}</div></div>)
        };
        let viewContainer = layouts[this.props.layout];
        return (
            <div className="views">{viewContainer}</div>
        )
    }
});
export default ViewContainer;
