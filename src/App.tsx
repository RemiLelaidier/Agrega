import * as React from 'react';
import { RxDatabase } from 'rxdb';
import { Subscription } from 'rxjs';

import './App.css';

import Database from './database/Database';

class App extends React.Component {

  private db: RxDatabase;
  private subscriptions: Subscription[];

  constructor(props: any) {
    super(props);
    this.state = {
      categories: {}
    }
    this.subscriptions = [];
  }

  /**
   *ComponentDidMount
   *
   * @memberof App
   */
  public async componentDidMount() {
    this.db = await Database.create();

    const sub: Subscription = this.db.categories.find().sort({id: 1}).$.subscribe(categories => {
      if(!categories) {
        return;
      }
      this.setState({categories})
    });

    this.subscriptions.push(sub);
  }

  /**
   *render
   *
   * @returns
   * @memberof App
   */
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
