import React, { useRef, useState } from 'react';
import './App.scss';
import { Internationalization } from '@syncfusion/ej2-base';
import { type Dialog } from '@syncfusion/ej2-popups';
import {
  ButtonComponent,
  CheckBoxComponent,
} from '@syncfusion/ej2-react-buttons';
import {
  DatePickerComponent,
  TimePickerComponent,
} from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import {
  TabComponent,
  TabItemDirective,
  TabItemsDirective,
  type SelectingEventArgs,
} from '@syncfusion/ej2-react-navigations';
import {
  RichTextEditorComponent,
  HtmlEditor,
  Toolbar,
  QuickToolbar,
} from '@syncfusion/ej2-react-richtexteditor';
import {
  Day,
  DragAndDrop,
  Inject,
  Month,
  Resize,
  ScheduleComponent,
  ResourcesDirective,
  ResourceDirective,
  ViewDirective,
  ViewsDirective,
  Week,
  TimelineViews,
  type NavigatingEventArgs,
  type PopupOpenEventArgs,
  type PopupCloseEventArgs,
  type EJ2Instance,
  type ResourceDetails,
} from '@syncfusion/ej2-react-schedule';

const App = (): React.JSX.Element => {
  const scheduleRef = useRef<ScheduleComponent>(null);
  const intl = new Internationalization();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [isSidebarOpen, setSidebarState] = useState<boolean>(false);
  const toolbarSettings = {
    items: [
      'Cut',
      'Copy',
      'Paste',
      '|',
      'Bold',
      'Italic',
      'Underline',
      '|',
      'FontName',
      'FontSize',
      'FontColor',
      '|',
      'Alignments',
      'NumberFormatList',
      'BulletFormatList',
      '|',
      'Undo',
      'Redo',
    ],
  };
  const requiredData: Array<Record<string, any>> = [
    {
      id: 1,
      text: 'Required Attendees',
      color: '#cb6bb2',
      expanded: true,
    },
    {
      id: 2,
      text: 'Optional Attendees',
      color: '#56ca85',
      expanded: false,
    },
  ];
  const optionalData: Array<Record<string, any>> = [
    {
      id: 1,
      groupId: 1,
      text: 'Add required attendees',
      color: '#cb6bb2',
    },
    {
      id: 2,
      groupId: 2,
      text: 'Add optional attendees',
      color: '#56ca85',
    },
  ];

  const openSidebar = (): void => {
    setSidebarState(true);
  };

  const closeSidebar = (): void => {
    setSidebarState(false);
  };

  const dateNavigation = (args: NavigatingEventArgs): void => {
    setCurrentDate(args.currentDate as Date);
  };

  const tabSelecting = (args: SelectingEventArgs): void => {
    setSelectedTabIndex(args.selectingIndex);
  };

  const openEditor = (): void => {
    const editorData = {
      StartTime: new Date(),
      EndTime: new Date(),
      IsAllDay: true,
    };
    scheduleRef.current?.openEditor(editorData, 'Add', false);
  };

  const openPopup = (args: PopupOpenEventArgs): void => {
    if (args.element.classList.contains('e-schedule-dialog')) {
      const dialogRef: Dialog = (args.element as EJ2Instance)
        .ej2_instances[0] as Dialog;
      dialogRef.height = 578;
      dialogRef.width = 848;
      dialogRef.dataBind();
    }
  };

  const closePopup = (args: PopupCloseEventArgs): void => {
    if (args.element.classList.contains('e-schedule-dialog')) {
      setSelectedTabIndex(0);
    }
  };

  const resourceHeaderTemplate = (data: ResourceDetails): React.JSX.Element => {
    if (String(data.resourceData.ClassName).endsWith('e-child-node')) {
      return (
        <div className="e-resource-text child-node">
          + {data.resourceData.text}
        </div>
      );
    } else {
      return <div className="e-resource-text">{data.resourceData.text}</div>;
    }
  };

  const editorHeaderTemplate = (): React.JSX.Element => {
    return (
      <TabComponent selectedItem={selectedTabIndex} selecting={tabSelecting}>
        <TabItemsDirective>
          <TabItemDirective header={{ text: 'New Event' }} />
          <TabItemDirective header={{ text: 'Scheduling Assistant' }} />
        </TabItemsDirective>
      </TabComponent>
    );
  };

  const editorTemplate = (data: Record<string, any>): React.JSX.Element => {
    if (selectedTabIndex > 0) {
      return (
        <div className="custom-editor assistant-content">
          <div className="flex-row">
            <div className="flex-col flex-col-auto">
              <div className="field-label e-css">Start Date</div>
              <DatePickerComponent value={data.StartTime} width={200} />
            </div>
            <div className="flex-col flex-col-auto">
              <div className="field-label e-css">Start Time</div>
              <TimePickerComponent value={data.StartTime} width={140} />
            </div>
            <div className="flex-col flex-col-auto">
              <div className="field-label e-css">End Time</div>
              <TimePickerComponent value={data.EndTime} width={140} />
            </div>
            <div className="flex-col">
              <CheckBoxComponent label="All day" checked={data.IsAllDay} />
            </div>
          </div>
          <div className="flex-full-row">
            <ScheduleComponent
              showHeaderBar={false}
              showTimeIndicator={false}
              height={401}
              width="100%"
              group={{ resources: ['Required', 'Optional'] }}
              resourceHeaderTemplate={resourceHeaderTemplate}>
              <ResourcesDirective>
                <ResourceDirective
                  field="requiredId"
                  title="Required Attendees"
                  name="Required"
                  idField="id"
                  textField="text"
                  colorField="color"
                  allowMultiple={true}
                  expandedField="expanded"
                  dataSource={requiredData}
                />
                <ResourceDirective
                  field="optionalId"
                  title="Optional Attendees"
                  name="Optional"
                  idField="id"
                  groupIDField="groupId"
                  textField="text"
                  colorField="color"
                  allowMultiple={true}
                  dataSource={optionalData}
                />
              </ResourcesDirective>
              <ViewsDirective>
                <ViewDirective option="TimelineDay" />
              </ViewsDirective>
              <Inject services={[TimelineViews]} />
            </ScheduleComponent>
          </div>
        </div>
      );
    } else {
      return (
        <div className="custom-editor">
          <div className="flex-row">
            <TextBoxComponent placeholder="Title" floatLabelType="Always" />
            <DropDownListComponent
              placeholder="Location"
              floatLabelType="Always"
              popupHeight={160}
            />
          </div>
          <div className="flex-row">
            <TextBoxComponent
              placeholder="Invite Required Attendees"
              floatLabelType="Always"
            />
          </div>
          <div className="flex-row">
            <div className="flex-col">
              <div className="flex-row row-container">
                <div className="flex-col">
                  <div className="field-label e-css">Start Date</div>
                  <DatePickerComponent value={data.StartTime} />
                </div>
                <div className="flex-col">
                  <div className="field-label e-css">Start Time</div>
                  <TimePickerComponent value={data.StartTime} />
                </div>
              </div>
            </div>
            <div className="flex-col">
              <CheckBoxComponent label="All day" checked={data.IsAllDay} />
            </div>
          </div>
          <div className="flex-row">
            <div className="flex-col">
              <div className="flex-row row-container">
                <div className="flex-col">
                  <div className="field-label e-css">End Date</div>
                  <DatePickerComponent value={data.EndTime} />
                </div>
                <div className="flex-col">
                  <div className="field-label e-css">End Time</div>
                  <TimePickerComponent value={data.EndTime} />
                </div>
              </div>
            </div>
            <div className="flex-col">
              <DropDownListComponent
                placeholder="Repeat at"
                floatLabelType="Always"
                popupHeight={160}
              />
            </div>
          </div>
          <div className="flex-row">
            <div className="flex-col">
              <div className="field-label e-css">Description</div>
              <RichTextEditorComponent
                height={160}
                toolbarSettings={toolbarSettings}>
                <Inject services={[HtmlEditor, QuickToolbar, Toolbar]} />
              </RichTextEditorComponent>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <main className="host-container">
      <header>
        <div className="header-title">
          <span className="title-1">Meeting</span>
          <span className="title-2">Rooms</span>
        </div>
        <div className="header-options">
          <ButtonComponent
            cssClass="e-primary"
            content="New Event"
            iconCss="e-icons e-plus"
            onClick={openEditor}
          />
          <div className="e-avatar e-avatar-small e-avatar-circle"></div>
        </div>
      </header>
      <main>
        <ScheduleComponent
          ref={scheduleRef}
          height="100%"
          width="100%"
          currentView="Month"
          showQuickInfo={false}
          editorHeaderTemplate={editorHeaderTemplate}
          editorTemplate={editorTemplate}
          navigating={dateNavigation}
          popupOpen={openPopup}
          popupClose={closePopup}>
          <ViewsDirective>
            <ViewDirective option="Day" />
            <ViewDirective option="Week" />
            <ViewDirective option="Month" />
          </ViewsDirective>
          <Inject services={[Day, Week, Month, Resize, DragAndDrop]} />
        </ScheduleComponent>
        {!isSidebarOpen && (
          <div className="sidebar" onClick={openSidebar}>
            <div className="e-icons e-chevron-left"></div>
          </div>
        )}
        {isSidebarOpen && (
          <div className="agenda-view">
            <div className="view-header">
              <div className="view-header-title">
                {intl.formatDate(currentDate, { skeleton: 'MMMEd' })}
              </div>
              <div className="view-header-icon" onClick={closeSidebar}>
                <div className="e-icons e-chevron-right"></div>
              </div>
            </div>
            <div className="view-content"></div>
          </div>
        )}
      </main>
    </main>
  );
};

export default App;
