import React from 'react';
import Category from './category'
import View from './view'
let App = React.createClass({
    addView: function(){
        let views = this.state.views.slice();
        views.push(null);
        this.setState({views: views});
    },
    alterView: function(index, newCategory) {
        let views = this.state.views.slice();
        views.splice(index, 1, newCategory);
        this.setState({views: views});
    },
    addMessage: function(filename, line) {
        let categories = this.state.categories;
        // Initialize if it doesn't exist
        categories[filename] = categories[filename] || [];
        categories[filename].push(line);
        this.setState({categories: categories});
    },
    getInitialState: function(){
        let views = JSON.parse(localStorage.getItem('views')) || [null, null, null];
        let layout = localStorage.getItem('layout') || 'two-wide';
        return {
            views: views,
            categories: {},
            layout: layout
        }
    },
    componentDidUpdate: function(prevProps, prevState){
        localStorage.setItem('views', JSON.stringify(this.state.views));
        localStorage.setItem('layout', this.state.layout);
    },
    render: function(){
        let views = this.state.views.map((category, index) => {
            return (
                <View category={category} key={index} index={index} categories={this.state.categories} alterView={this.alterView}/>
            );
        });
        let layouts = {
            'one-wide': (<div className="hor-layout hflex"> { views[0] } </div>),
                'two-wide': (<div className="hor-layout hflex"> { views[0] } {views[1]} </div>),
                'three-wide': (<div className="hor-layout hflex"> { views[0] } {views[1]} {views[2]}</div>),
                'two-high': (<div className="vert-layout vflex"> { views[0] } {views[1]}</div>),
                'combo': (<div><div className="combo-layout vflex"> { views[0] } {views[1]}</div><div> {views[2]}</div></div>)
        };
        let viewContainer = layouts[this.state.layout];
        let categories = Object.keys(this.state.categories).map((key) => {
            return (
                <Category key={key} name={key} category={this.state.categories[key]}/>
            );
        });
        return (
            <div className="app">
                <div className="categories"> 
                    Categories: {categories} 
                    <button className="btn btn-primary">One wide </button>
                    <button className="btn btn-primary">Two wide</button>
                </div>
                <div className="views" categories={this.state.categories}>{viewContainer}</div>
            </div>
        );
    }
});

export default App;
