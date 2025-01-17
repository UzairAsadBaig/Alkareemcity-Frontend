import React, { useState, useEffect } from 'react';
import UsersContext from './UsersContext';
import jwtDecode from 'jwt-decode';
import Api from '../../Api';
import Cook from 'js-cookie';
let CryptoJS=require( "crypto-js" );


const UserState=( props ) => {
  
  const [ user, setUser ]=useState( {} );




  const Cookies=Cook.withAttributes( {
    path: '/', sameSite: 'Strict', secure: true
  } )



  const retrieveUserInfo=async ( id ) => {
    const endPoint='users/'+id;
    const res=await Api.get( endPoint );
    setUser( res.data.data );

    return res.data.data;
  }

  const encryptData=( data ) => {
    // Encrypt
    let ciphertext=CryptoJS.AES.encrypt( JSON.stringify( data ), 'my-secret-key@123' ).toString();
    return ciphertext;

  }

  let userId;
  useEffect( async () => {

    if ( Cookies.get( 'jwt' ) ) {
      userId=jwtDecode( Cookies.get( 'jwt' ) ).id;
      const data=await retrieveUserInfo( userId );

      // PERSISTING USER STATE(OPTIONAL)
      window.localStorage.removeItem( 'UR' )
      window.localStorage.setItem( 'UR', encryptData( data ) )

    }

  }, [] )


  return (
    
    <UsersContext.Provider value={{ user, setUser, retrieveUserInfo, Cookies }}>
      {props.children}
    </UsersContext.Provider>

  )
}

export default UserState