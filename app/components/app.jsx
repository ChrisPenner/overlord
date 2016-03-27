import React from 'react'
export default React.createClass({
    addView: function(){
        let views = this.state.views.slice();
        views.push(null);
        this.setState({views: views});
    },
    alterView: function(index, newCategory) {
        let views = this.state.views.slice();
        if (newCategory === null){
            views.splice(index, 1);
        } else {
            views.splice(index, 1, newCategory);
        }
        this.setState({views: views});
    },
    getInitialState: function(){
        var views = JSON.parse(localStorage.getItem('views')) || [null, null];
        return {
            views: views,
            categories: {},
        }
    },
    componentDidUpdate: function(prevProps, prevState){
        localStorage.setItem('views', JSON.stringify(this.state.views));
    },
    render: function(){
        var views = this.state.views.map((category, index) => {
            return (
                <View category={category} key={index} index={index} categories={this.state.categories} alterView={this.alterView}/>
            );
        });
        var categories = Object.keys(this.state.categories).map((key) => {
            return (
                <Category key={key} name={key} category={this.state.categories[key]}/>
            );
        });
        return (
            <div className="app">
            <div className="categories"> Categories: {categories} <button onClick={this.addView} className="btn btn-primary"> Add Panel </button></div>
            <div className="views" categories={this.state.categories}>{views}</div>
            </div>
        );
    }
});

var View = React.createClass({
    remove: function(){
        this.props.alterView(this.props.index, null);
    },
    preventDefault: function(e){
        e.preventDefault();
    },
    dataDrop: function(e){
        var category = e.dataTransfer.getData("text");
        this.props.alterView(this.props.index, category);
    },
    render: function(){
        var category = this.props.categories[this.props.category];
        let lines = []
        if (category){
            lines = category.map((line, index) => {
                return (
                    <div className={"line"} key={index}>{line}</div>
                );
            });
        }

        return (
            <div className="view panel panel-info" onDrop={this.dataDrop} onDragOver={this.preventDefault} >
            <div className="panel-heading">{this.props.category || "Drag a category here!"} <a onClick={this.remove} className="close">&times;</a></div>
            <div className="panel-body lines"> 
            {lines}
            </div>
            </div>
        );
    }
});

var Category = React.createClass({
    dragStart: function(e){
        e.dataTransfer.setData("text", this.props.name);
    },
    render: function(){
        return (
            <div className="category btn btn-default" draggable onDragStart={this.dragStart}>
            {this.props.name}
            </div>
        );
    }
});

