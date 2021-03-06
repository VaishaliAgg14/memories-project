import React , {useState} from 'react';
import { Avatar , Button , Paper , Typography , Container , Grid} from '@material-ui/core';
import { GoogleLogin } from 'react-google-login';
import {useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles';
import Input from './Input';
import Icon from './icon';
import {signin , signup} from '../../actions/auth.js';

const initialState = {firstName:'' , lastName:'' , email:'' , password:'' ,confirmPassword:''}

export const Auth = () => {
    const classes = useStyles();
    const [showPassword , setShowPassword] = useState(false);
    const [isSignUp , setIsSignUp] = useState(false);
    const [formData , setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isSignUp) {
            dispatch (signup(formData,navigate));
        } else{
            dispatch (signin(formData,navigate));
        }
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const googleFailure = (error) => {
        console.log(error);
        console.log('Google sign in failed. Try Again');
    };

    const googleSuccess = (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;

        try {
            dispatch({ type : 'AUTH', data : {result, token } });
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    const switchMode = () => {
        setIsSignUp((prevIsSignUp) => !prevIsSignUp);
        handleShowPassword(false);
    };

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);



    return (
        <Container component = "main" maxWidth = "xs" >
            <Paper className={classes.paper} elevation='3' >
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant = "h5">{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container >
                        {
                            isSignUp && (
                                <>
                                    <Input name = "firstName" label = "First Name" handleChange = {handleChange} autoFocus half />
                                    <Input name = "lastName" label = "Last Name" handleChange = {handleChange} half />

                                </>
                            )
                        }
                        <Input name = "email" label = "Email Address" handleChange = {handleChange} type = "email" />
                        <Input name = "password" label = "Password" handleChange = {handleChange} type = {showPassword ? 'text' : 'password'} handleShowPassword = {handleShowPassword}/>
                        {
                            isSignUp && ( <Input name = "confirmPassword" label = "Repeat Password" handleChange = {handleChange} type = "password" />
                            )
                        }
                    </Grid>
                    <Button type = "submit" fullWidth variant= "contained" color = "secondary" className = {classes.submit} > 
                        { isSignUp ? "Sign Up" : "Sign In" } 
                    </Button>
                    <GoogleLogin 
                        clientId = "598214141915-fu2ja43aisoplrmfhamsa3sjshkeiep3.apps.googleusercontent.com" 
                        render = { (renderProps) => ( 
                            <Button className={classes.googleButton} color="secondary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon = { <Icon />} variant = "contained">Google Login</Button>
                        )}
                        onSuccess = {googleSuccess}
                        onFailure = {googleFailure}
                        cookiePolicy = "single_host_origin"
                    />
                    <Grid container justifyContent = "flex-end">
                        <Grid item>
                            <Button onClick = {switchMode}> {
                                isSignUp ? "Already a user? Sign in" : "Don't have an account? Sign Up"
                            } </Button> 
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

