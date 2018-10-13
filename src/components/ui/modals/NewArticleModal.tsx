import * as React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { ModalProps } from './type';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Input } from '@material-ui/core';

interface NewArticleModalProps extends ModalProps {
    categories: Object;
}

interface NewArticleModalState {
    name: string;
    description: string;
    url: string;
    categories: string[];
}

class NewArticleModal extends React.Component<NewArticleModalProps, NewArticleModalState> {

    constructor(props: NewArticleModalProps) {
        super(props);
        this.state = {
            name: '',
            description: '',
            url: '',
            categories: []
        };
    }

    render() {
        return (
            <Dialog 
                onClose={this.handleClose()} 
                aria-labelledby="simple-dialog-title"
                open={true}
            >
                <DialogTitle id="simple-dialog-title">Nouvelle Ressource</DialogTitle>
                <DialogContent>
                    <FormControl>
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
                        <TextField
                            required={true}
                            id="standard-required"
                            label="URL"
                            value={this.state.url}
                            onChange={this.handleChange('url')}
                            margin="normal"
                        />
                        <InputLabel htmlFor="select-multiple-checkbox">Catégories</InputLabel>
                        <Select
                            multiple={true}
                            value={this.state.categories}
                            onChange={this.handleCategoryChange()}
                            input={<Input id="select-multiple-checkbox" />}
                            renderValue={this.renderInput()}
                        >
                            {this.renderList()}
                        </Select>
                    </FormControl>
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
        this.props.onSubmit(this.state);
    }

    handleChange = (name: string) => (event: any) => {
        this.setState({
          [name]: event.target ? (event.target as any).value : '',
        } as any);
    }

    handleCategoryChange = () => (event: any) => {
        this.setState({
            categories: event.target.value
        });
    }

    renderList() {
        return (this.props.categories as any[]).map((category: any) => {
            return (
                <MenuItem key={category.id} value={category.name}>
                    <Checkbox checked={this.state.categories.indexOf(category.name) > -1} />
                    <ListItemText primary={category.name} />
                </MenuItem>
            );
        })
    }

    renderInput = () => (selected: any) => {
        return selected.join(', ');
    }
}

export default NewArticleModal;