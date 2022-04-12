import React, { useState, useEffect} from 'react';
import { LOGOUT } from '../../constants/actionTypes';
import { AppBar, Avatar, Toolbar, Typography, Button } from '@material-ui/core';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';

import useStyles from './styles';
import memories from '../../images/image.jpg';

const Navbar = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();

    useEffect(() => {
        const token = '';
        if (user) {
            const decodedToken = decode(user.token);
            if (decodedToken.exp * 1000 < new Date().getTime()) handleLogOut();
        }
        
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const handleLogOut = () => {
        dispatch({ type: LOGOUT })   
        navigate('/');
        setUser(null);
    }
        
    return (
        <AppBar className={classes.appBar} position='static' color='inherit'>
            <div className={classes.brandContainer}>
                <Typography component={Link} to="/" className={classes.heading} variant='h2' align='center'>Memories</Typography>
                <img className={classes.image} src={memories} alt='memories' height='60' />
            </div>
            <Toolbar className={classes.toolbar}>
                {user ? (
                    <div className={classes.profile}>
                        <Avatar classesName={classes.purple} alt={user.result.name} src={user.result.imageUrl}>
                            {user.result.name.charAt(0)}
                        </Avatar>
                        <Typography className={classes.userName} variant="h6">
                            {user.result.name}
                        </Typography>
                        <Button variant="contained" className={classes.logout} color="secondary" onClick={handleLogOut}>
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Button component={Link} to="/auth" variant="contained" color="primary">
                        Sign In
                    </Button>
                )
                }
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;