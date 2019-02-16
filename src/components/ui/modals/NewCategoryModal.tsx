import * as React from 'react';

import { combineLatest, BehaviorSubject, Subscription } from 'rxjs';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { FormControl } from '@material-ui/core';
import { ChromePicker } from 'react-color';

import { ModalProps } from './type';
import { observeSubject } from 'src/utils/RxFactory';

interface NewCategoryModalState {
    name: string;
    description: string;
    color: string;
    openPicker: boolean;
    canSubmit: boolean;
}

class NewCategoryModal extends React.Component<ModalProps, NewCategoryModalState> {

    private canSubmit$: Subscription;
    private nameField$: BehaviorSubject<string>;
    private descField$: BehaviorSubject<string>;
    private colorField$: BehaviorSubject<string>;

    constructor(props: ModalProps) {
        super(props);

        this.state = {
            name: "",
            description: "",
            color: "",
            openPicker: false,
            canSubmit: false
        }

        // Create subject observable
        this.nameField$ = new BehaviorSubject(this.state.name);
        this.descField$ = new BehaviorSubject(this.state.description);
        this.colorField$ = new BehaviorSubject(this.state.color);
    }

    /**
     * On componentDidMount set observables
     *
     * @memberof NewCategoryModal
     */
    componentDidMount() {
        const name$ = observeSubject(this.nameField$, (value: string) => value !== '');
        const desc$ = observeSubject(this.descField$, (value: string) => value !== '');
        const color$ = observeSubject(this.colorField$, (value: string) => value !== '');

        // Combine observables with their latest value
        this.canSubmit$ = combineLatest(name$, desc$, color$)
        .subscribe(([nameValue, descValue, colorValue]) => {
            if(nameValue && descValue && colorValue) {
                this.setState({canSubmit: true});
            } else {
                this.setState({canSubmit: false});
            }
        });
    }

    /**
     * On unMount, remove subscription
     *
     * @memberof NewCategoryModal
     */
    componentWillUnmount() {
        this.canSubmit$.unsubscribe();
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
                    <FormControl>
                        <TextField
                            required={true}
                            id="name-modal-field"
                            label="Nom"
                            value={this.state.name}
                            onChange={this.handleChange('name')}
                            margin="normal"
                        />
                        <TextField
                            required={false}
                            id="description-modal-field"
                            label="Description"
                            value={this.state.description}
                            onChange={this.handleChange('description')}
                            margin="normal"
                        />
                        <p>Couleur</p>
                        <div id="color-modal-field">
                            <ChromePicker
                                color={this.state.color}
                                onChangeComplete={this.handleColorChange()}
                            />
                        </div>
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

    handleChange = (name: string) => (event: any) => {
        const value = (event.target as any).value;
        this.setState({
          [name]: value,
        } as any);

        // Update Observable
        if(name === 'name') this.nameField$.next(value);
        if(name === 'description') this.descField$.next(value);
    }

    handleColorChange = () => (color: any) => {
        this.setState({
            color: color.hex
        })

        this.colorField$.next(color.hex);
    }

    handleSubmit = () => () => {
        this.props.onSubmit({
            name: this.state.name,
            description: this.state.description,
            color: this.state.color
        });
    }
}

export default NewCategoryModal;