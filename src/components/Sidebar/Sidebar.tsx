import * as React from 'react';
import { Browser } from '@syncfusion/ej2-base';
import { SidebarComponent } from '@syncfusion/ej2-react-navigations';
import Calendar from '../Calendar/Calendar';
import Filters from '../Filters/Filters';
import './Sidebar.scss';

const Sidebar = React.forwardRef(
  (props: Record<string, any>, ref: React.Ref<Record<string, any>>) => {
    let sidebarObj: SidebarComponent;

    React.useImperativeHandle(ref, () => ({
      toggle(): void {
        if (sidebarObj.element.style.visibility === 'visible') {
          sidebarObj.element.style.visibility = 'hidden';
          sidebarObj.hide();
        } else {
          sidebarObj.element.style.visibility = 'visible';
          sidebarObj.show();
        }
      },
    }));

    const onCreated = (): void => {
      sidebarObj.element.style.visibility = '';
      if (Browser.isDevice) {
        sidebarObj.hide();
      }
    };

    return (
      <SidebarComponent
        ref={(sidebarRef: SidebarComponent) => (sidebarObj = sidebarRef)}
        className="app-sidebar"
        enableGestures={false}
        created={onCreated}>
        <div className="calendar-container">
          <Calendar />
        </div>
        <div className="filter-container">
          <div className="filter-label">FILTER BY</div>
          <Filters />
        </div>
      </SidebarComponent>
    );
  },
);

export default Sidebar;
