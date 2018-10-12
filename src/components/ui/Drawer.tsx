import * as React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import Drawer from '@material-ui/core/Drawer';

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
                        <ListItem button={true}>
                            <ListItemIcon>
                                <NoteAddIcon />
                            </ListItemIcon>
                            <ListItemText primary="Nouvelle ressource" />
                        </ListItem>
                    </List>
                    <Divider/>
                </div>
            </Drawer>
            </>
        );
    }

    toggle = () => () => {
        this.props.toggle();
    }
}

export default AppDrawer;