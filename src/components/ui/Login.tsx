import * as React from 'react';

import { Subscription, BehaviorSubject, combineLatest } from 'rxjs';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { observeSubject } from 'src/utils/RxFactory';

import './Login.css';
import fire from 'src/auth/Fire';

interface LoginState {
    name: string;
    password: string;
    canSubmit: boolean;
}

class Login extends React.Component<any, LoginState> {

    private canSubmit$: Subscription;
    private request$: BehaviorSubject<any>;
    private nameField$: BehaviorSubject<string>;
    private passwordField$: BehaviorSubject<string>;

    constructor(props: any) {
        super(props);

        this.state = { 
            name: '',
            password: '',
            canSubmit: false
        };

        this.nameField$ = new BehaviorSubject(this.state.name);
        this.passwordField$ = new BehaviorSubject(this.state.password);
        this. request$ = new BehaviorSubject(null);

        this.requestConnect = this.requestConnect.bind(this);
    }

    componentDidMount() {
        const name$ = observeSubject(this.nameField$, (value: string) => value !== '');
        const password$ = observeSubject(this.passwordField$, (value: string) => value !== '');

        this.canSubmit$ = combineLatest(name$, password$, this.request$)
        .subscribe(([name, password, request]) => {
            const validInput: boolean = name && password;
            if(validInput || !request) {
                this.setState({canSubmit: true});
            } else {
                this.setState({canSubmit: false});
            }
        })
    }

    componentWillUnmount() {
        this.canSubmit$.unsubscribe();
    }

    render() {
        return(
            <div className="form-container">
                <TextField
                    id="standard-username-input"
                    label="Email"
                    className="input"
                    type="text"
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                    margin="normal"
                />
                <TextField
                    id="standard-password-input"
                    label="Mot de passe"
                    className="input"
                    type="password"
                    onChange={this.handleChange('password')}
                    margin="normal"
                />
                <Button onClick={this.requestConnect} color="primary" disabled={!this.state.canSubmit}>
                    Ok
                </Button>
            </div>
        )
    }

    handleChange = (name: string) => (event: any) => {
        const value = event.target.value;
        this.setState({
          [name]: value,
        } as any);

        if(name === 'name') this.nameField$.next(value);
        if(name === 'password') this.passwordField$.next(value);
    }

    async requestConnect(e) {
        e.preventDefault();
        this.request$.next(true);
        return fire.auth().signInWithEmailAndPassword(this.state.name, this.state.password)
            .then(() => {
                this.request$.next(false);
            })
            .catch(() => {
                this.request$.next(false);
            });
    }
}

export default Login;
