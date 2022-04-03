import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import useStyles from './styles';
import LockOutLinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input';
import Icon from './icon';

const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const dispatch = useDispatch();
    const handleShowPassword = () => setShowPassword((preShowPassword) => !preShowPassword);
    const handleSubmit = () => {}
    const handleChange = () => {}
    const switchMode = () => {
        setIsSignUp((preIsSignUp) => !preIsSignUp);
        handleShowPassword(false);
    }
    
    const googleSuccess = async (res) => {
        const result = res.profileObj;
        const token = res.tokenId;
        try {
            dispatch({ type: 'AUTH', data: { result, token } });
        } catch (error) {
            console.log(error);
        }
    }

    const googleFailure = (error) => {
        console.log(error);
        console.log("Google login unsuccessful");
    }
    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutLinedIcon />
                </Avatar>
                <Typography variant='h5'>{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        { isSignUp && (
                                <>
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus hafl />
                                    <Input name="lastName" label="Last Name" handleChange={handleChange} hafl />
                                </>)
                        }
                        <Input name="email" label="Email Address" handlecChange={handleChange} type="email" />
                        <Input name="password" label="Password" handlecChange={handleChange} type={showPassword ? 'text' : "password"} 
                            handleShowPassword={handleShowPassword}/>
                        { isSignUp && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password"/>}
                    </Grid>
                    
                    <Button type="submit" fullWidth variant='contained' color="primary" className={classes.submit}>
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </Button>

                    <GoogleLogin 
                        clientId='797269683239-s2sjsuj79mgm5ocsp9nekvbjmrsj1c0q.apps.googleusercontent.com'
                        render={(renderProps) => (
                            <Button 
                                className={classes.googleButton} 
                                color='primary' 
                                fullWidth onClick={renderProps.onClick} 
                                disabled={renderProps.disabled} 
                                startIcon={<Icon />} 
                                variant='contained'
                            > Google Sign In
                            </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy="single_host_origin"
                    />

                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign up"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth