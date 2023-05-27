import React from 'react';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp } from 'ionicons/icons';
import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Products',
    url: '/page/Products',
    iosIcon: mailOutline,
    mdIcon: mailSharp
  },
  {
    title: 'Stockmanagement',
    url: '/page/Stock',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp
  },
  {
    title: 'Order',
    url: '/page/Order',
    iosIcon: heartOutline,
    mdIcon: heartSharp
  },
  {
    title: 'Stockhistory', // TODO: Delete this
    url: '/page/Stockhistory',
    iosIcon: heartOutline,
    mdIcon: heartSharp
  },
  {
    title: 'Login', // TODO: Delete this
    url: '/page/Login',
    iosIcon: heartOutline,
    mdIcon: heartSharp
  }
];


const Menu: React.FC = () => {
  const location = useLocation();

  if(localStorage.getItem('token') === null) {
    return (
      <IonMenu contentId="main" type="overlay">
        <IonContent>
          <IonList id="inbox-list">
            <IonListHeader>Java and Webdevelopment</IonListHeader>
            <IonNote>Please Login</IonNote>
            <IonMenuToggle autoHide={false}>
              <IonItem className={location.pathname === '/page/Login' ? 'selected' : ''} routerLink="/page/Login" routerDirection="none" lines="none" detail={false}>
                <IonIcon aria-hidden="true" slot="start" ios={mailOutline} md={mailSharp} />
                <IonLabel>Login</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>
    )
  } else {
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Java and Web Development</IonListHeader>
          <IonNote>Student-Id: 9229146</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
        <IonItem>
          <IonButton fill="clear" onClick={ () => {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpires');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            window.location.href = '/page/Login';
          }} >Log Out</IonButton>
        </IonItem>
      </IonContent>
    </IonMenu>
  );
}
}

export default Menu;
