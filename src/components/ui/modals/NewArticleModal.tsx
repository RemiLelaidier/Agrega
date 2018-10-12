import * as React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
// import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { ModalProps } from './type';

class NewArticleModal extends React.Component<ModalProps> {
    render() {
        return (
            <Dialog 
                onClose={this.handleClose()} 
                aria-labelledby="simple-dialog-title"
                open={true}
            >
                <DialogTitle id="simple-dialog-title">Nouvelle catégorie</DialogTitle>
                <DialogContent>
                    sjf
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose()} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={this.handleSubmit()} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleClose = () => () => {
        this.props.onClose();
    }

    handleSubmit = () => () => {
        console.log('submit');
    }
}

export default NewArticleModal;