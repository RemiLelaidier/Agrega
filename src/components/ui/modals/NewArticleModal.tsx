import * as React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MicrolinkCard from 'react-microlink';

import { ModalProps } from './type';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Input } from '@material-ui/core';

import './Modal.css';

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
        const ITEM_HEIGHT = 48;
        const ITEM_PADDING_TOP = 8;
        const MenuProps = {
            PaperProps: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
              },
            },
          };

        return (
            <Dialog 
                onClose={this.handleClose()} 
                aria-labelledby="simple-dialog-title"
                open={true}
            >
                <DialogTitle id="simple-dialog-title">Nouvelle Ressource</DialogTitle>
                <DialogContent>
                    <FormControl className="form-control">
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
                        <InputLabel htmlFor="select-multiple-checkbox" className="label-input">Catégories</InputLabel>
                        <Select
                            multiple={true}
                            value={this.state.categories}
                            onChange={this.handleCategoryChange()}
                            input={<Input id="select-multiple-checkbox" />}
                            renderValue={this.renderInput()}
                            MenuProps={MenuProps}
                        >
                            {this.renderList()}
                        </Select>
                        <TextField
                            required={true}
                            id="standard-required"
                            label="URL"
                            value={this.state.url}
                            onChange={this.handleChange('url')}
                            margin="normal"
                        />
                    </FormControl>
                    {this.renderPreview()}
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

    renderPreview() {
        if(this.state.url) {
            return (
                <MicrolinkCard 
                    key="preview-card"
                    className="info-card"
                    url={this.state.url}
                    force={true}
                    onChange={this.show()}
                />
            );
        }
        return;
    }

    show= () => () => {
        console.log('render');
    }
}

export default NewArticleModal;