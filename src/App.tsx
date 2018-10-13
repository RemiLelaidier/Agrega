import * as React from 'react';
import { RxDatabase } from 'rxdb';
import { Subscription } from 'rxjs';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import Database from './database/Database';
import CategotyCard from './components/ui/CategoryCard';
import NewCategoryModal from './components/ui/modals/NewCategoryModal';
import AppDrawer from './components/ui/Drawer';
import NewArticleModal from './components/ui/modals/NewArticleModal';

import './App.css';

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
    this.submitNewCategory = this.submitNewCategory.bind(this);
    this.submitNewRessource = this.submitNewRessource.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  /**
   *ComponentDidMount
   *
   * @memberof App
   */
  public async componentWillMount() {
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
            <IconButton className="menuButton" color="inherit" aria-label="Menu" onClick={this.toggle()}>
              <MenuIcon />
            </IconButton>
            <h6>
              Agrégat-Info
            </h6>
            <Button color="inherit">Connexion</Button>
          </Toolbar>
        </AppBar>

        <AppDrawer 
          open={this.state.drawer} 
          toggle={this.toggleDrawer} 
          onSelect={this.openModal}
        />

        <GridList cellHeight={160} cols={6}>
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

  private renderCategories() {
    if(Object.keys(this.state.categories).length > 0) {
      return (this.state.categories as any).map((category: any) => {
        return (
          <GridListTile cols={1} key={category.id}> 
            <CategotyCard 
              category={category}
              onClick={this.openModal}
            />
          </GridListTile>
        );
      });
    }
  }

  private renderModal() {
    switch(this.state.modal) {
      case ModalType.newCategory:
        return <NewCategoryModal onClose={this.closeModal} onSubmit={this.submitNewCategory}/>;
      case ModalType.newArticle:
        return <NewArticleModal onClose={this.closeModal} onSubmit={this.submitNewRessource} categories={this.state.categories}/>;
      default:
        return;
    }
  }

  private toggleDrawer() {
    this.setState({
      drawer: !this.state.drawer
    })
  }

  private toggle = () => () => {
    this.toggleDrawer();
  }

  openModal(type: ModalType) {
    console.log('activate modal' + type);
    this.setState({modal: type});
  }

  closeModal() {
    console.log('close modal');
    this.setState({modal: ModalType.none});
  }

  async submitNewCategory(data: any) {
    console.log('new category ' + data);
    this.setState({modal: ModalType.none});
    data.id = Date.now().toString();
    data.ressources = [];
    await this.db.categories.insert(data);
  }

  async submitNewRessource(data: any) {
    console.log('new ressource ' + data);
    this.setState({modal: ModalType.none});
    // TODO
  }
}

export default App;
