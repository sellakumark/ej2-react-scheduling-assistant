import * as React from 'react';
import { useSelector } from 'react-redux';
import { AppBarComponent } from '@syncfusion/ej2-react-navigations';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Schedule from '../Schedule/Schedule';
import User from '../../assets/images/user.svg';
import Logo from '../../assets/images/logo.svg';
import './Home.scss';

const Home = (): React.JSX.Element => {
  const floorData: Array<Record<string, any>> = useSelector(
    (state: Record<string, any>) => state.roomModifier.value.floorData,
  );
  const roomData: Array<Record<string, any>> = useSelector(
    (state: Record<string, any>) => state.roomModifier.value.roomData,
  );
  const sidebarRef: React.MutableRefObject<any> = React.useRef<any>(null);
  const [openEditor, setOpenEditor] = React.useState<boolean>(true);
  const showSchedule: boolean = !(roomData.length < 1 || floorData.length < 1);

  const onButtonClick = (): void => {
    sidebarRef.current.toggle();
  };

  return (
    <div className="app-main-container">
      <AppBarComponent cssClass="app-header">
        <img className="app-header-logo" src={Logo} alt="logo" />
        <div className="e-appbar-spacer"></div>
        <div className="avatar-container">
          <img className="avatar-image" src={User} alt="avatar" />
          <span className="avatar-name">Hi, John David</span>
        </div>
      </AppBarComponent>
      <main className="main-container">
        <div className="sidebar-container">
          <Sidebar ref={sidebarRef} />
        </div>
        <div className="content-container">
          <div className="header-container">
            <Header
              onButtonClick={onButtonClick}
              openEditor={openEditor}
              setOpenEditor={setOpenEditor}
            />
          </div>
          <div className="schedule-container">
            {showSchedule ? (
              <Schedule openEditor={openEditor} />
            ) : (
              <div className="no-schedule">
                <strong style={{ fontSize: '16px' }}>
                  No properties found
                </strong>
                <p style={{ fontSize: '14px' }}>
                  There are no matching properties for your search criteria. Try
                  updating your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
