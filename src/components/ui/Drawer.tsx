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

interface AppDrawerProps {
    open: boolean;
    toggle: (any);
    onSelect?: (any);
}

class AppDrawer extends React.Component<AppDrawerProps> {
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
                        <ListItem button={true}>
                            <ListItemIcon>
                                <SettingsPowerIcon />
                            </ListItemIcon>
                            <ListItemText primary="Déconnexion"/>
                        </ListItem>
                    </List>
                </div>
            </Drawer>
            </>
        );
    }

    toggle = () => () => {
        this.props.toggle();
    }

    openModal = (type: ModalType) => () => {
        this.props.onSelect(type);
    }
}

export default AppDrawer;