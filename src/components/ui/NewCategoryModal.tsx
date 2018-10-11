import * as React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { ChromePicker } from 'react-color';

interface NewCategoryModalProps {
    onClose: (any);
    onSubmit: (any);
}

interface NewCategoryModalState {
    name: string;
    description: string;
    color: string;
    openPicker: boolean;
}

class NewCategoryModal extends React.Component<NewCategoryModalProps, NewCategoryModalState> {

    constructor(props: NewCategoryModalProps) {
        super(props);
        this.state = {
            name: "",
            description: "",
            color: "",
            openPicker: false
        }
    }
    render() {
        return (
            <Dialog 
                onClose={this.handleClose()} 
                aria-labelledby="simple-dialog-title"
                open={true}
            >
                <DialogTitle id="simple-dialog-title">Nouvelle catégorie</DialogTitle>
                <DialogContent>
                    <TextField
                        required={true}
                        id="standard-required"
                        label="Nom"
                        value={this.state.name}
                        onChange={this.handleChange('name')}
                        margin="normal"
                    />
                    <TextField
                        required={true}
                        id="standard-required"
                        label="Description"
                        value={this.state.description}
                        onChange={this.handleChange('description')}
                        margin="normal"
                    />
                    <p>Couleur</p>
                    <ChromePicker  
                        color={this.state.color}
                        onChangeComplete={this.handleColorChange()}
                    />
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

    handleChange = (name: string) => (event: any) => {
        this.setState({
          [name]: event.target ? (event.target as any).value : '',
        } as any);
    }

    handleColorChange = () => (color: any) => {
        console.log(color);
        this.setState({
            color: color.hex
        })
    }

    handleSubmit = () => () => {
        console.log('submit');
        this.props.onSubmit({
            name: this.state.name,
            description: this.state.description,
            color: this.state.color
        });
    }
}

export default NewCategoryModal;