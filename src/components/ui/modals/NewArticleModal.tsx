import * as React from 'react';

import { Subscription, BehaviorSubject, combineLatest } from 'rxjs';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import MicrolinkCard from 'react-microlink';

import { ModalProps } from './type';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Input } from '@material-ui/core';

import './Modal.css';
import { observeSubject } from 'src/utils/RxFactory';

interface NewArticleModalProps extends ModalProps {
    categories: Object;
}

interface NewArticleModalState {
    name: string;
    description: string;
    url: string;
    categories: string[];
    canSubmit: boolean;
}

class NewArticleModal extends React.Component<NewArticleModalProps, NewArticleModalState> {

    private canSubmit$: Subscription;
    private nameField$: BehaviorSubject<string>;
    private descField$: BehaviorSubject<string>;
    private categoriesField$: BehaviorSubject<Array<string>>;
    private urlField$: BehaviorSubject<string>;

    constructor(props: NewArticleModalProps) {
        super(props);
        this.state = {
            name: '',
            description: '',
            url: '',
            categories: [],
            canSubmit: false
        };

        this.nameField$ = new BehaviorSubject(this.state.name);
        this.descField$ = new BehaviorSubject(this.state.description);
        this.categoriesField$ = new BehaviorSubject(this.state.categories);
        this.urlField$ = new BehaviorSubject(this.state.url);
    }

    componentDidMount() {
        const name$ = observeSubject(this.nameField$, (value: string) => value !== '');
        const desc$ = observeSubject(this.descField$, (value: string) => value !== '');
        const url$ = observeSubject(this.urlField$, (value: string) => value !== '');
        const categories$ = observeSubject(this.categoriesField$, (values: Array<string>) => values.length > 0);

        this.canSubmit$ = combineLatest(name$, desc$, url$, categories$)
        .subscribe(([nameValue, descValue, colorValue, categoriesValue]) => {
            if(nameValue && descValue && colorValue && categoriesValue) {
                this.setState({canSubmit: true});
            } else {
                this.setState({canSubmit: false});
            }
        });
    }

    /**
     * on Unmount remove subscription
     *
     * @memberof NewArticleModal
     */
    componentWillUnmount() {
        this.canSubmit$.unsubscribe();
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
                        {this.renderPreview()}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose()} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={this.handleSubmit()} color="primary" disabled={!this.state.canSubmit}>
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
        const value = event.target.value;
        this.setState({
          [name]: value,
        } as any);

        if(name === 'name') this.nameField$.next(value);
        if(name === 'description') this.descField$.next(value);
        if(name === 'url') this.urlField$.next(value);
    }

    handleCategoryChange = () => (event: any) => {
        const value = event.target.value
        this.setState({
            categories: value
        });

        this.categoriesField$.next(value);
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
                <Grid container={true} spacing={8}>
                    <Grid item={true} xs={11}>
                        <MicrolinkCard 
                            key="preview-card"
                            className="info-card"
                            url={this.state.url}
                            force={true}
                        />
                    </Grid>
                    <Grid item={true} xs={1}>
                        <IconButton aria-label="Delete" onClick={this.clearUrl()}>
                            <ClearIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            );
        }
        return;
    }

    clearUrl = () => () => {
        this.setState({url: ''});
    }
}

export default NewArticleModal;