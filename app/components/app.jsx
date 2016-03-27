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
        let views = JSON.parse(localStorage.getItem('views')) || [null, null];
        return {
            views: views,
            categories: {},
        }
    },
    componentDidUpdate: function(prevProps, prevState){
        localStorage.setItem('views', JSON.stringify(this.state.views));
    },
    render: function(){
        let views = this.state.views.map((category, index) => {
            return (
                <View category={category} key={index} index={index} categories={this.state.categories} alterView={this.alterView}/>
            );
        });
        let categories = Object.keys(this.state.categories).map((key) => {
            return (
                <Category key={key} name={key} category={this.state.categories[key]}/>
            );
        });
        return (
            <div className="app">
                <div className="categories"> Categories: {categories}</div>
                <div className="views" categories={this.state.categories}>{views}</div>
            </div>
        );
    }
});

export default App;
