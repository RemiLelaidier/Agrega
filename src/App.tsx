import * as React from 'react';
import { RxDatabase } from 'rxdb';
import { Subscription } from 'rxjs';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import GridListTile from '@material-ui/core/GridListTile';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import { purple } from '@material-ui/core/colors';

import Database from './database/Database';
import CategoryCard from './components/ui/CategoryCard';
import ArticleCard from './components/ui/ArticleCard';
import NewCategoryModal from './components/ui/modals/NewCategoryModal';
import NewArticleModal from './components/ui/modals/NewArticleModal';
import AppDrawer from './components/ui/Drawer';

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
  selected: string;
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
      modal: ModalType.none,
      selected: ''
    }
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
   *ComponentWillMount
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

          <AppDrawer 
            open={this.state.drawer} 
            toggle={this.toggleDrawer} 
            onSelect={this.openModal}
          />

          <Grid container={true} spacing={8} className="categories-card">
            <Grid container={true} item={true} spacing={8} xs={2} className="v-grid">
              {this.renderCategories()}
              {this.renderDefaultCategoryCard()}
            </Grid>

            <Grid container={true} item={true} spacing={8} xs={10} className="articles-card">
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
          <IconButton className="menuButton" color="inherit" aria-label="Menu" onClick={this.toggle()}>
            <MenuIcon />
          </IconButton>
          <h6>Agrégat-Info</h6>
          <Button color="inherit">Connexion</Button>
        </Toolbar>
      </AppBar>
    );
  }

  /**
   * Render category cards
   *
   * @private
   * @returns
   * @memberof App
   */
  private renderCategories() {
    if(Object.keys(this.state.categories).length > 0) {
      return (this.state.categories as any).map((category: any) => {
        return (
          <GridListTile cols={1} key={category.id}> 
            <CategoryCard 
              category={category}
              selected={this.state.selected === category.id}
              onClick={this.openModal}
              onSelect={this.selectCategory}
            />
          </GridListTile>
        );
      });
    }
  }

  /**
   * Render default category card
   *
   * @private
   * @returns
   * @memberof App
   */
  private renderDefaultCategoryCard() {
    return (
      <Grid item={true} xs={12}> 
        <CategoryCard 
          category={null}
          selected={false}
          onClick={this.openModal}
        />
      </Grid>
    );
  }

  private renderArticles() {
    if(Object.keys(this.state.categories).length > 0 && this.state.selected !== '') {
      return (this.state.categories as any).map((category: any) => {
        return (category.ressources).map((article: any) => {
          return (
            <Grid item={true} xs={12} key={category.id +'-' + article.id}>
              <ArticleCard 
                article={article}
              />
            </Grid>
          );
        })
      });
    }
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
          added: 'user'
        }]
      }
      await this.db.categories.atomicUpsert(collection);
    });
  }
}

export default App;
