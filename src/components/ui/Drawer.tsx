import * as React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsPowerIcon from '@material-ui/icons/SettingsPower';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Drawer from '@material-ui/core/Drawer';
import { ModalType } from 'src/App';
import CategoryCard from './CategoryCard';
import fire from 'src/auth/Fire';

interface AppDrawerProps {
    open: boolean;
    toggle: (any);
    categories: any;
    selected: string;
    onSelect: (any);
    onSelectCategory: (any);
}

class AppDrawer extends React.Component<AppDrawerProps> {

    constructor(props: any) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    render() {
        return (
            <>
            <Drawer open={this.props.open} onClose={this.toggle()}>
                <div
                    tabIndex={0}
                    role="button"
                    onClick={this.toggle()}
                    onKeyDown={this.toggle()}
                >
                    <List>
                        <ListItem button={true} onClick={this.openModal(ModalType.newArticle)}>
                            <ListItemIcon>
                                <NoteAddIcon />
                            </ListItemIcon>
                            <ListItemText primary="Nouvelle ressource" />
                        </ListItem>

                        <ListItem button={true} onClick={this.openModal(ModalType.newCategory)}>
                            <ListItemIcon>
                                <CreateNewFolderIcon />
                            </ListItemIcon>
                            <ListItemText primary="Nouvelle catégorie" />
                        </ListItem>

                        <ListItem button={true}>
                            <ListItemIcon>
                                <RemoveCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Sources non fiables" />
                        </ListItem>
                    </List>

                    <Divider/>

                    <List>
                        <ListItem button={true}>
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Compte"/>
                        </ListItem>
                        
                        <ListItem button={true} onClick={this.logout}>
                            <ListItemIcon>
                                <SettingsPowerIcon />
                            </ListItemIcon>
                            <ListItemText primary="Déconnexion"/>
                        </ListItem>
                    </List>

                    <Divider/>

                    <List>
                        {this.renderDefaultCategoryCard()}
                        {this.renderCategories()}
                    </List>
                </div>
            </Drawer>
            </>
        );
    }

    /**
     * Open / Close Drawer
     *
     * @memberof AppDrawer
     */
    toggle = () => () => {
        this.props.toggle();
    }

    /**
     * Open Modal
     *
     * @memberof AppDrawer
     */
    openModal = (type: ModalType) => () => {
        this.props.onSelect(type);
    }

    selectCategory = (catId: string) => () => {
        this.props.onSelectCategory(catId)
    }

    /**
   * Render category cards
   *
   * @private
   * @returns
   * @memberof AppDrawer
   */
  private renderCategories() {
    if(Object.keys(this.props.categories).length > 0) {
      return (this.props.categories as any).map((category: any) => {
        return (
          <ListItem key={category.id}> 
            <CategoryCard 
              category={category}
              selected={this.props.selected === category.id}
              onClick={this.openModal}
              onSelect={this.selectCategory(category.id)}
            />
          </ListItem>
        );
      });
    }
  }

  /**
   * Render default category card
   *
   * @private
   * @returns
   * @memberof AppDrawer
   */
  private renderDefaultCategoryCard() {
    return (
      <ListItem> 
        <CategoryCard 
          category={null}
          selected={false}
          onClick={this.openModal}
        />
      </ListItem>
    );
  }

  logout(e) {
      fire.auth().signOut();
  } 
}

export default AppDrawer;