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
    changeLayout: function(layout){
        this.setState({layout:layout});
    },
    addMessage: function(filename, line) {
        let categories = this.state.categories;
        // Initialize if it doesn't exist
        categories[filename] = categories[filename] || [];
        categories[filename].push(line);
        this.setState({categories: categories});
    },
    initLogs: function(filename, lines) {
        let categories = this.state.categories;
        categories[filename] = lines;
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
            'one-wide': (<div className="hor-layout layout hflex"> { views[0] } </div>),
                'two-wide': (<div className="hor-layout layout hflex"> { views[0] } {views[1]} </div>),
                'three-wide': (<div className="hor-layout layout hflex"> { views[0] } {views[1]} {views[2]}</div>),
                'two-high': (<div className="vert-layout layout vflex"> { views[0] } {views[1]}</div>),
                'combo': (<div className="layout hflex"><div className="combo-layout layout vflex"> { views[0] } {views[1]}</div><div className="layout vflex"> {views[2]}</div></div>)
        };
        let viewContainer = layouts[this.state.layout];
        let categories = Object.keys(this.state.categories).map((key) => {
            return (
                <Category key={key} name={key} category={this.state.categories[key]}/>
            );
        });
        return (
            <div className="app">
                <div className="control-bar"> 
                    <div className="categories">Categories: {categories}</div>
                    <div className="controls">
                        <button className="btn btn-primary" onClick={this.changeLayout.bind(this,'one-wide')}>One wide </button>
                        <button className="btn btn-primary" onClick={this.changeLayout.bind(this,'two-wide')}>Two wide</button>
                        <button className="btn btn-primary" onClick={this.changeLayout.bind(this,'three-wide')}>Three wide</button>
                        <button className="btn btn-primary" onClick={this.changeLayout.bind(this,'two-high')}>Two high</button>
                        <button className="btn btn-primary" onClick={this.changeLayout.bind(this,'combo')}>Combo</button>
                    </div>
                </div>
                <div className="views" categories={this.state.categories}>{viewContainer}</div>
            </div>
        );
    }
});

export default App;
