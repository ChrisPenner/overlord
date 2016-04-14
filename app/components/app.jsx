import Category from './category'
import React from 'react';
import Settings from './settings'
import ViewContainer from './view-container'
import _ from 'lodash'
import electron from 'electron'
import path from 'path'
let renderer = electron.ipcRenderer;

const NUM_VIEWS_MAP = {
    'one-wide': 1,
    'two-wide': 2,
    'three-wide': 3,
    'two-high': 2,
    'combo': 3
}

let App = React.createClass({
    addView: function(){
        let views = this.state.views.slice();
        views.push(null);
        this.setState({views: views});
    },
    alterView: function(index, newCategory) {
        let views = this.state.views.slice();
        let categories = this.state.categories;
        views.splice(index, 1, newCategory);
        this.setState({views: views, categories: categories});
        this.clearUnread();
    },
    openLogLocationDialog: function(){
        renderer.send('openLogLocationDialog', true);
    },
    toggleSideBar: function(){
        this.setState({showSettings: !this.state.showSettings});
    },
    changeLayout: function(layout){
        const numViews = NUM_VIEWS_MAP[layout];
        this.setState({layout:layout, numViews: numViews});
        this.clearUnread();
    },
    clearUnread: function(){
        let categories = this.state.categories;
        const activeCategories = _.compact(this.state.views.slice(0, this.state.numViews));
        activeCategories.forEach((category)=>{
            categories[category].unread = 0;
        });
        this.setState({categories: categories});
    },
    addMessage: function(filename, line) {
        const shortname = path.basename(filename);
        let categories = this.state.categories;
        // Initialize if it doesn't exist
        categories[shortname] = categories[shortname] || {lines:[], unread: 0};
        categories[shortname].lines.push(line);
        categories[shortname].unread += 1;
        this.setState({categories: categories});
        this.clearUnread();
    },
    initLogs: function(filename, lines) {
        const shortname = path.basename(filename);
        let categories = this.state.categories;
        categories[shortname] = {lines:lines, unread:0};
        this.setState({categories: categories});
    },
    getInitialState: function(){
        const layout = localStorage.getItem('layout') || 'two-wide';
        const numViews = NUM_VIEWS_MAP[layout];
        return {
            categories: {},
            views: JSON.parse(localStorage.getItem('views')) || [null, null, null],
            layout: layout,
            numViews: numViews,
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
                            <div onClick={this.openLogLocationDialog}><span className="glyphicon glyphicon-folder-open add-logs"></span></div>
                            <div onClick={this.toggleSideBar}><span className="glyphicon glyphicon-cog settings-icon"></span></div>
                        </div>
                    </div>
                    <ViewContainer views={this.state.views} layout={this.state.layout} categories={this.state.categories} alterView={this.alterView}/>
                </div>
                <Settings active={this.state.showSettings} />
            </div>
        );
    }
});

export default App;
