import * as React from 'react';

export interface IContext {
  accessToken: string;
}

export default React.createContext<IContext>({ accessToken: '' });
