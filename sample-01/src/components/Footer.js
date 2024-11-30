import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Footer = ()=> {
  const { user, isAuthenticated } = useAuth0();
  return (<footer className="bg-light p-3 text-center">
    <div className="logo" />
    <p>
      Sample project of proviiided by <a href="https://auth0.com">Auth0</a>
    </p>
    {isAuthenticated 
        ? <p>Email: {user.email}</p>
        : <p>Pas connecté</p>
      }

  </footer>
  );
};

export default Footer;
