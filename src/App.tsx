import * as React from 'react';
import { RxDatabase } from 'rxdb';

import './App.css';

import Database from './database/Database';

class App extends React.Component {

  private db: RxDatabase;

  public async componentDidMount() {
    this.db = await Database.create();
    const sub = this.db.categories;

    console.log(sub);
  }



  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
