import React from 'react';
import Category from './category'
import ViewContainer from './view-container'
import Settings from './settings'
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
        return {
            categories: {},
            views: JSON.parse(localStorage.getItem('views')) || [null, null, null],
            layout: localStorage.getItem('layout') || 'two-wide',
            filters: JSON.parse(localStorage.getItem('filters')) || ['info', 'error']
        }
    },
    componentDidUpdate: function(prevProps, prevState){
        localStorage.setItem('views', JSON.stringify(this.state.views));
        localStorage.setItem('layout', this.state.layout);
        localStorage.setItem('filters', JSON.stringify(this.state.filters))
    },
    render: function(){
        let categories = Object.keys(this.state.categories).map((key) => {
            return (
                <Category key={key} name={key} category={this.state.categories[key]}/>
            );
        });
        return (
            <div className="app">
                <div className="vflex main-area">
                    <div className="control-bar"> 
                        <div className="categories">Categories: {categories}</div>
                        <div className="controls">
                            <div className="layout-selector one-wide" onClick={this.changeLayout.bind(this,'one-wide')}><div></div></div>
                            <div className="layout-selector two-wide" onClick={this.changeLayout.bind(this,'two-wide')}><div></div> <div></div> </div>
                            <div className="layout-selector three-wide" onClick={this.changeLayout.bind(this,'three-wide')}><div></div><div></div><div></div></div>
                            <div className="layout-selector two-high" onClick={this.changeLayout.bind(this,'two-high')}><div></div><div></div></div>
                            <div className="layout-selector combo" onClick={this.changeLayout.bind(this,'combo')}><div></div><div></div><div></div></div>
                        </div>
                    </div>
                    <ViewContainer views={this.state.views} layout={this.state.layout} categories={this.state.categories} alterView={this.alterView}/>
                </div>
                <Settings/>
            </div>
        );
    }
});

export default App;
