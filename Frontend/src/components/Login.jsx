import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const Login = () => {

    const [email, setEmail] = useState('jaydev@gmail.com');
    const [password, setPassword] = useState('jaydev@123');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        
        try {
            // NOTE: Make sure to send "withCredentials" option, to store the cookie in the browser
            const response = await axios.post(BASE_URL + '/auth/login', {
                email,
                password
            }, { 
                withCredentials: true 
            });

            dispatch(addUser(response.data));
            navigate("/");
        }catch(err) {
            console.log(err);
        }
    }

  return (
    <div className='flex justify-center my-10'>
        <div className="card bg-base-300 w-96 shadow-sm ">
            <div className="card-body justify-center">
                <h2 className="card-title justify-center">Login</h2>
                <div className='my-2'>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Email ID</legend>
                        <input type="text" className="input" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Password</legend>
                        <input type="text" className="input" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </fieldset>
                </div>
                <div className="card-actions justify-center m-2">
                    <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login
