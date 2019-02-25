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
    error: string;
    creation: boolean;
    canSubmit: boolean;
}

class Login extends React.Component<any, LoginState> {

    /* User can submit form */
    private canSubmit$: Subscription;

    /* Request in progress */
    private request$: BehaviorSubject<boolean>;

    /* observe fields values */
    private nameField$: BehaviorSubject<string>;
    private passwordField$: BehaviorSubject<string>;

    /**
     * Creates an instance of Login.
     * @param {*} props
     * @memberof Login
     */
    constructor(props: any) {
        super(props);

        this.state = { 
            name: '',
            password: '',
            error: '',
            creation: false,
            canSubmit: false
        };

        this.nameField$ = new BehaviorSubject(this.state.name);
        this.passwordField$ = new BehaviorSubject(this.state.password);
        this.request$ = new BehaviorSubject(false);

        this.request = this.request.bind(this);
    }

    componentDidMount() {
        // Observe and validate datas in fields
        const name$ = observeSubject(this.nameField$, (value: string) => value !== '');
        const password$ = observeSubject(this.passwordField$, (value: string) => value !== '');

        // Combine
        this.canSubmit$ = combineLatest(name$, password$, this.request$)
        .subscribe(([name, password, request]) => {
            const validInput: boolean = name && password;
            if(validInput && !request) {
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
                <div className="form-header">
                    {this.renderAltTitle()}
                </div>
                <div className="form-content">
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
                </div>
                <div className="form-actions">
                    {this.renderAltAction()}
                    <Button onClick={this.request} color="primary" disabled={!this.state.canSubmit}>
                        Ok
                    </Button>
                </div>
                {this.state.error ? (<div className='form-error'>{this.state.error}</div>) : ''}
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

    //
    async request(e) {
        e.preventDefault();
        this.request$.next(true);
        // Determine firebase method to call (signin or login)
        const signInOrLogin = this.state.creation ? 'createUserWithEmailAndPassword' : 'signInWithEmailAndPassword';
        // Call firebase
        return fire.auth()[signInOrLogin](this.state.name, this.state.password)
            .then(() => {
                this.request$.next(false);
                this.setState({error: ''});
            })
            .catch((error: any) => {
                this.request$.next(false);
                this.setState({error: error.message});
            });
    }

    renderAltAction() {
        if(!this.state.creation) {
            return (
                <Button onClick={this.toggleCreation}>
                    Créer un compte
                </Button>
            );
        } else {
            return (
                <Button onClick={this.toggleCreation}>
                    Se connecter
                </Button>
            );
        }
    }

    renderAltTitle() {
        if(!this.state.creation) {
            return <h1>Connexion</h1>
        } else {
            return <h1>S'inscrire</h1>
        }
    }

    toggleCreation = (event: any) => {
        this.setState({
          creation: !this.state.creation,
        } as any);
    }
}

export default Login;
