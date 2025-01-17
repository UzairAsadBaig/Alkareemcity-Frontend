import '../css/App.css';
import '../css/index.css'
import { FaEye } from "react-icons/fa";
import Api from '../Api';
import React, { useContext, useState } from 'react';
import UsersContext from '../context/users/UsersContext';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/appState/AppContext';

const endPoint='users/login';

const SignInForm=() => {
  const { retrieveUserInfo, user, Cookies }=useContext( UsersContext );
  const { encryptData, showAlert }=useContext( AppContext );
  const [ credentials, setCredentials ]=useState( {
    email: "",
    password: ""
  } );

  const navigate=useNavigate();


  const handleLogin=async ( e ) => {
    e.preventDefault();
    const res=await Api.post( endPoint, credentials );
    console.log( res.data );
    console.log( res.data.data );




    if ( res.data.status==="success" ) {

      Cookies.set( 'jwt', res.data.token );
      const data=await retrieveUserInfo( res.data.data.user._id )

      const encData=encryptData( data );
      window.localStorage.setItem( 'UR', encData )
      // Cookies.set( 'UR', encData )

      if ( res.data.data.user.role==='user' ) {
        showAlert( 'Logged in successfully', 'success' )
        setTimeout( () => {
          navigate( '/dashboard/profile' )
        }, 4000 )
      } else {

        showAlert( 'Logged in successfully', 'success' )
        setTimeout( () => {
          navigate( '/dashboard' )
        }, 4000 )


      }

    }


  }


  const onChange=( e ) => {
    setCredentials( { ...credentials, [ e.target.name ]: e.target.value } )
  }
  return (

    <div className='background' style={{ marginTop: "0px", height: "100vh" }}>
      <div className="clipPath" style={{ paddingTop: "100px", height: '100vh' }}>


        <div className='container SignInForm' >
          {/* <div className='formHeading'><h1 >Welcome</h1>
            <p>Sign in to continue</p>
          </div> */}
          <div className='col-3'>
            <h1 className='text-center text-white mb-5'>Login</h1>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-3" >

              <input type="email" onChange={onChange} name="email"
                placeholder='Email' className='signUpInput' />

            </div>
            <div className="mb-3">
              <input type="password" name='password' onChange={onChange} placeholder='Password' className='signUpInput' /><span className='signin_icon' ><FaEye /></span>
            </div>
            <div className='d-flex'>
              <div className="form-check ">
                <input className="form-check-input checkboxInput" type="checkbox" value="" id="flexCheckDefault" />
                <label className="form-check-label " htmlFor="flexCheckDefault" >
                  Remember me
                </label>
              </div>
              <div className='' style={{ marginLeft: "8.2rem" }}>Forget password</div>

            </div>

            <button type='submit' className="btn btn-dark signinButton">SIGN IN</button>
            <div className='faceboxSignIn'>Or Sign in With</div>
            <div className='checkbox_icons'><i className="fa-brands fa-google"></i> <i className="fa-brands fa-facebook-square"></i> <i className="fa-brands fa-instagram"></i></div>

          </form>
        </div>

      </div>
    </div>


  );
};

export default SignInForm;