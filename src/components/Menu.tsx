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
import { fileTrayStackedOutline, clipboardOutline, cartOutline, clipboardSharp, cartSharp, fileTrayStackedSharp, beerOutline, beerSharp, keyOutline, keySharp } from 'ionicons/icons';
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
    iosIcon: beerOutline,
    mdIcon: beerSharp
  },
  {
    title: 'Stock Management',
    url: '/page/Stock',
    iosIcon: clipboardOutline,
    mdIcon: clipboardSharp
  },
  {
    title: 'Order',
    url: '/page/Order',
    iosIcon: cartOutline,
    mdIcon: cartSharp
  },
  {
    title: 'Stock History',
    url: '/page/Stockhistory',
    iosIcon: fileTrayStackedOutline,
    mdIcon: fileTrayStackedSharp
  }
];


const Menu: React.FC = () => {
  const location = useLocation();

  if(localStorage.getItem('token') === null) {
    return (
      null
    )
  } else if (localStorage.getItem('userId') == `"1"`) {
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <img src="../assets/images/iu_logo.png"/>
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
            localStorage.clear();
            window.location.href = '/page/Login';
          }} >Log Out</IonButton>
        </IonItem>
      </IonContent>
    </IonMenu>
  );
} else {
  return (
  <IonMenu contentId="main" type="overlay">
  <IonContent>
    <img src="../assets/images/iu_logo.png" />
    <IonList id="inbox-list">
      <IonListHeader>Java and Web Development</IonListHeader>
      <IonNote>Hello User</IonNote>
      {appPages.map((appPage, index) => {
        if (appPage.title === 'Stock History' || appPage.title === 'Products') {
          return null; // Skip rendering the page for users with userId other than 1
        }
        return (
          <IonMenuToggle key={index} autoHide={false}>
            <IonItem
              className={location.pathname === appPage.url ? 'selected' : ''}
              routerLink={appPage.url}
              routerDirection="none"
              lines="none"
              detail={false}
            >
              <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
              <IonLabel>{appPage.title}</IonLabel>
            </IonItem>
          </IonMenuToggle>
        );
      })}
    </IonList>
    <IonItem>
      <IonButton
        fill="clear"
        onClick={() => {
          localStorage.clear();
          window.location.href = '/page/Login';
        }}
      >
        Log Out
      </IonButton>
    </IonItem>
  </IonContent>
</IonMenu>
)
}
}

export default Menu;
