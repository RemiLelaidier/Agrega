import * as React from 'react';
import { RxDatabase } from 'rxdb';
import { Subscription } from 'rxjs';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import './App.css';

import Database from './database/Database';
import CategotyCard from './components/ui/CategoryCard';
import NewCategoryModal from './components/ui/NewCategoryModal';

export enum ModalType {
  none = 'none',
  newCategory = 'newCategory',
  newArticle = 'newArticle'
}

interface AppState {
  categories: Object;
  drawer: boolean;
  modal: ModalType;
}

class App extends React.Component<any, AppState> {

  private db: RxDatabase;
  private subscriptions: Subscription[];
  private syncUrl: string = "http://localhost:5984/";
  private dbName: string = "agrega";

  constructor(props: any) {
    super(props);
    this.state = {
      categories: {},
      drawer: false,
      modal: ModalType.none
    }
    this.subscriptions = [];

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  /**
   *ComponentDidMount
   *
   * @memberof App
   */
  public async componentDidMount() {
    this.db = await Database.create(this.dbName);

    const sub: Subscription = this.db.categories.find().sort({id: 1}).$.subscribe(categories => {
      if(!categories) {
        return;
      }
      this.setState({categories})
    });

    this.subscriptions.push(sub);

    // ReplicationState
    const replicationState = this.db.categories.sync({remote: this.syncUrl + this.dbName + '/'});

    this.subscriptions.push(
      replicationState.change$.subscribe(change => console.dir(`change - ${change}`))
    );
    this.subscriptions.push(
      replicationState.docs$.subscribe(docData => console.dir(`docs - ${docData}`))
    );
    this.subscriptions.push(
      replicationState.active$.subscribe(active => console.dir(`active - ${active}`))
    );
    this.subscriptions.push(
      replicationState.complete$.subscribe(completed => console.dir(`completed - ${completed}`))
    );
    this.subscriptions.push(
      replicationState.error$.subscribe(error => console.dir(`error - ${error}`))
    );
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
        <AppBar position="static">
          <Toolbar>
            <IconButton className="menuButton" color="inherit" aria-label="Menu" onClick={this.toggleDrawer()}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className="grow">
              Agrégat-Info
            </Typography>
            <Button color="inherit">Connexion</Button>
          </Toolbar>
        </AppBar>

        <Drawer open={this.state.drawer} onClose={this.toggleDrawer()}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer()}
            onKeyDown={this.toggleDrawer()}
          >
            {this.renderDrawer()}
          </div>
        </Drawer>

        <GridList cellHeight={160} cols={3}>
          {this.renderCategories()}
          <GridListTile cols={1}> 
            <CategotyCard 
              category={null}
              onClick={this.openModal}
            />
          </GridListTile>
        </GridList>

        {this.renderModal()}

      </div>
    );
  }

  private renderDrawer() {
    return (
      <div>
        <p>salut</p>
      </div>
    );
  }

  private renderCategories() {
    /*if(this.state.categories.length > 0 ) {
      return <CategoriesList />;
    } else {
      return <EmptyList />
    }*/
  }

  private renderModal() {
    switch(this.state.modal) {
      case ModalType.newCategory:
        return <NewCategoryModal onClose={this.closeModal}/>;
      default:
        return;
    }
  }

  private toggleDrawer = () => () => {
    this.setState({
      drawer: !this.state.drawer
    })
  }

  openModal(type: ModalType) {
    console.log('activate modal' + type);
    this.setState({modal: type});
  }

  closeModal() {
    console.log('close modal');
    this.setState({modal: ModalType.none});
  }
}

export default App;
