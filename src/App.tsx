import * as React from 'react';
import { RxDatabase } from 'rxdb';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import { purple } from '@material-ui/core/colors';

import Database from './database/Database';
import ArticleCard from './components/ui/ArticleCard/ArticleCard';
import Login from './components/ui/Login/Login';
import NewCategoryModal from './components/ui/modals/NewCategoryModal';
import NewArticleModal from './components/ui/modals/NewArticleModal';
import AppDrawer from './components/ui/Drawer';

import './App.css';
import fire from './auth/Fire';

export enum ModalType {
  none = 'none',
  newCategory = 'newCategory',
  newArticle = 'newArticle'
}

export interface User {
  id: string;
  username: string;
}

interface AppState {
  connected: User | null;
  categories: Object;
  drawer: boolean;
  modal: ModalType;
  selected: string;
}

class App extends React.Component<any, AppState> {

  private db: RxDatabase;
  private subscriptions: Subscription[];
  private syncUrl: string = "http://localhost:5984/";
  private dbName: string = "agrega";

  private connected$: BehaviorSubject<User | null>;

  constructor(props: any) {
    super(props);

    this.state = {
      connected: null,
      categories: {},
      drawer: false,
      modal: ModalType.none,
      selected: ''
    }

    this.connected$ = new BehaviorSubject(this.state.connected);
    this.connected$.subscribe();
    this.subscriptions = [];

    // Set context 
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submitNewCategory = this.submitNewCategory.bind(this);
    this.submitNewRessource = this.submitNewRessource.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
  }

  /**
   *ComponentDidMount
   *
   * @memberof App
   */
  public async componentDidMount() {
    // Register firebase listener
    this.authListener();

    this.db = await Database.create(this.dbName);

    const categories$: Observable<any[]> = this.db.categories.find().sort({id: 1}).$;
    const sub = categories$.subscribe(categories => {
      this.setState({categories});
    });
    this.subscriptions.push(sub);

    // ReplicationState
    const replicationState = this.db.categories.sync({remote: this.syncUrl + this.dbName + '/'});

    this.subscriptions.push(
      replicationState.change$.subscribe(change => console.dir(`change - ${change}`))
    );
    this.subscriptions.push(
      replicationState.error$.subscribe(error => console.dir(`error - ${error}`))
    );
  }

  /**
   * componentWillUnmount
   *
   * @memberof App
   */
  public componentWillUnmount() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe()
    })
  }

  /**
   * Main render function
   *
   * @returns
   * @memberof App
   */
  public render() {
    const theme = createMuiTheme({
      palette: {
        primary: { main: purple[500] }, // Purple and green play nicely together.
        secondary: { main: '#11cb5f' }, // This is just green.A700 as hex.
      },
    });

    return (
      <div className="App">
        <MuiThemeProvider theme={theme}>
          
          {this.renderAppBar()}

          {this.renderDrawer()}

          <Grid container={true} spacing={8}>
            <Grid container={true} item={true} spacing={8} xs={12} className="categories-card">
              {this.renderArticles()}
            </Grid>
          </Grid>

          {this.renderModal()}
        </MuiThemeProvider>
      </div>
    );
  }

  private renderAppBar() {
    return(
      <AppBar position="static">
        <Toolbar>
          <IconButton className="menuButton" color="inherit" aria-label="Menu" onClick={this.toggle()} disabled={this.state.connected === null}>
            <MenuIcon />
          </IconButton>
          <h6>Agrégat-Info</h6>
        </Toolbar>
      </AppBar>
    );
  }

  private renderArticles() {
    if(!this.state.connected) {
      return <Login/>
    }
    if(Object.keys(this.state.categories).length > 0 && this.state.selected !== '') {
      // Get selected category
      const category = (this.state.categories as any).find((cat: any) => {
        return cat.id === this.state.selected;
      });

      const categoriesToRender = (category.ressources).map((article: any) => {
        return (
          <Grid item={true} xs={4} key={category.id +'-' + article.name}>
            <ArticleCard article={article}/>
          </Grid>
        );
      });

      return categoriesToRender;
    }
    return;
  }

  /**
   * Dynamically render Modal
   *
   * @private
   * @returns
   * @memberof App
   */
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

  private renderDrawer() {
    if(this.state.connected) {
      return(
        <AppDrawer 
          open={this.state.drawer} 
          toggle={this.toggleDrawer}
          categories={this.state.categories}
          selected={this.state.selected}
          onSelect={this.openModal}
          onSelectCategory={this.selectCategory}
        />
      )
    }
    return;
  }

  private toggleDrawer() {
    this.setState({
      drawer: !this.state.drawer
    })
  }

  private toggle = () => () => {
    this.toggleDrawer();
  }

  /**
   * Open Modal
   *
   * @param {ModalType} type
   * @memberof App
   */
  openModal(type: ModalType) {
    console.log('activate modal' + type);
    this.setState({modal: type});
  }

  /**
   * CLose Modal
   *
   * @memberof App
   */
  closeModal() {
    console.log('close modal');
    this.setState({modal: ModalType.none});
  }

  /**
   * Select a category
   *
   * @param {*} catId
   * @returns
   * @memberof App
   */
  selectCategory(catId: any) {
    if(Object.keys(this.state.categories).length > 0) {
      const catExist = (this.state.categories as any).filter((category: any) => {
        return category.id === catId;
      });

      if(!catExist) { return; }

      this.setState({ selected: catExist[0].id });
    }
  }

  /**
   * Submit a new category into database
   *
   * @param {*} data
   * @memberof App
   */
  async submitNewCategory(data: any) {
    console.log('new category ' + data);
    this.setState({modal: ModalType.none});
    data.id = Date.now().toString();
    data.ressources = [];
    await this.db.categories.insert(data);
  }

  /**
   * Submit new ressource into the database
   *
   * @param {*} data
   * @memberof App
   */
  async submitNewRessource(data: any) {
    console.log('new ressource ' + data);
    this.setState({modal: ModalType.none});
    data.categories.forEach(async (category: string) => {
      const document = await this.db.categories.findOne().where('name').eq(category).exec();
      const collection = {
        id: document.id,
        description: document.description,
        color: document.color,
        name: document.name,
        ressources: [...document.ressources, {
          name: data.name,
          description: data.description,
          url: data.url,
          added: this.state.connected ? this.state.connected.username : 'Anonymous'
        }]
      }
      await this.db.categories.atomicUpsert(collection);
    });
  }

  authListener() {
    fire.auth().onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.setState({ connected: {
            id: user.uid,
            username: user.displayName ? user.displayName : 'Anonymous'
        } });
      } else {
        this.setState({ connected: null });
      }
    });
  }
}

export default App;
