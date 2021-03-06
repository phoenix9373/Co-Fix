import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function NickNameRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!localStorage.getItem('nickName')) {
          return (
            <Redirect
              to={{ pathname: '/join', state: { from: props.location } }}
            />
          );
        }
        return <Component {...props} {...rest} />;
      }}
    />
  );
}

export { NickNameRoute };
