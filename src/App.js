import React, { Component } from 'react';
import deleteLogo from './deleteLogo2.png';
require('./App.css');

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = 20;
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopStories(result) {
    const {hits, page} = result;
    const oldHits = page!==0
      ? this.state.result.hits
      : [];
    const updatedHits = [
      ...oldHits,
      ...hits
    ];
    this.setState({ result: {hits: updatedHits, page} });
  }

  fetchSearchTopStories(searchTerm, page=0) {
    console.log(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event){
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({ result: {...this.state.result, hits: updatedHits}});
  }

  render() {
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0;
    return (
      <div className="page">
        <div className="interactions m-4 p-3">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSearchSubmit={this.onSearchSubmit}
            className='searchInput'
          >
            Search
          </Search>
        </div>
        {result
          ? <Table
          list={result.hits}
          onDismiss={this.onDismiss}
          />
          : <p className='text-center display-4 m-3'>Fetching...</p>
        }
        <div className='interactions'>
          <Button onClick={()=>this.fetchSearchTopStories(searchTerm, page+1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
}


const Search = ({ 
  value, 
  onChange,
  onSearchSubmit, 
  className,
  children 
}) =>
  <form onSubmit={onSearchSubmit}>
     <input
      type="text"
      value={value}
      onChange={onChange}
      className={className}
      placeholder='Search here'
    />
    <button type='submit'
      className='searchBtn'
    >
      {children}
    </button>
  </form>

const Table = ({ list, onDismiss }) =>
  <div className="card-columns">
    {list.map(item=>
        <div key={item.objectID} className="card m-2">
          <div 
            className="card-header text-white" 
            style={{backgroundColor: 'indigo'}}>
              <div className='row mb-2'>
                <div className='col text-right'>
                  <img src={deleteLogo}
                    alt='Delete'
                    className='deleteLogo'
                    onClick={() => onDismiss(item.objectID)}
                    />
                </div>
              </div>
              <div className='row'>
                <div className='col'>
                  {item.num_comments} Comments
                </div>
                <div className='col text-right'>
                  +{item.points} Points 
                </div>
              </div>
          </div>
          <div className="card-body">
            <h5 className="card-title">{item.title}</h5>
            <footer className="blockquote-footer">
                <cite title="Read more about news"
                  className="d-inline "
                > 
                  {item.author}
                  <br />
                  
                </cite>
              </footer>
          </div>
          <div className="card-footer text-white" style={{backgroundColor: 'indigo'}}>
            <blockquote className="blockquote mb-0">
              <div className='row'>
                <div className='col'>
                </div>
                <div className='col text-right'>
                <footer className="blockquote-footer">
                    <cite title="Read more about news"> 
                      <a href={item.url} 
                        target='_blank' 
                        rel="noopener noreferrer"
                        className='text-white'
                      >Read More
                      </a>
                    </cite>
                    </footer>
                </div>
              </div>
            </blockquote>
          </div>
        </div>  
    )}
  </div>
const Button = ({ onClick, className = '', children }) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

export default App;

// Mounting Lifecycle
// constructor()
// componentWillMount()
// render()
// componentDidMount()

// is case of update
// componentWillReceiveProps()
// shouldComponentUpdate()
// componentWillUpdate()
// render()
// componentDidUpdate()

// Un-mount
// componentWillUnmount()

