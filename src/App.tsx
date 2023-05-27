import React from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Pages */
import Stockmanagement from './pages/Stockmanagement';
import Login from './pages/Login';
import StockHistory from './pages/StockHistory';
import Menu from './components/Menu';
import Products from './pages/Products';
import Order from './pages/Order';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/page/Products" />
            </Route>
            <Route path="/page/Products" exact={true}>
              <Products />
            </Route>
            <Route path="/page/Order" exact={true}>
              <Order />
            </Route>
            <Route path="/page/Stock" exact={true}>
              <Stockmanagement />
            </Route>
            <Route path="/page/Stockhistory" exact={true}>
              <StockHistory />
            </Route>
            <Route path="/page/login" exact={true}>
              <Login />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
