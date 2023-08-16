import React, { useState } from 'react';
import './App.scss';
import { Internationalization, isNullOrUndefined } from '@syncfusion/ej2-base';
import { type Dialog } from '@syncfusion/ej2-popups';
import {
  ButtonComponent,
  CheckBoxComponent,
} from '@syncfusion/ej2-react-buttons';
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
  type EJ2Instance,
  type ResourceDetails,
} from '@syncfusion/ej2-react-schedule';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import {
  EmojiPicker,
  RichTextEditorComponent,
  HtmlEditor,
  Toolbar,
} from '@syncfusion/ej2-react-richtexteditor';
import {
  DatePickerComponent,
  TimePickerComponent,
} from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

const App = (): JSX.Element => {
  const intl = new Internationalization();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
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

  const openSidebar = (): void => {
    setSidebarState(true);
  };

  const closeSidebar = (): void => {
    setSidebarState(false);
  };

  const dateNavigation = (args: NavigatingEventArgs): void => {
    args.cancel = true;
    setCurrentDate(args.currentDate as Date);
  };

  const openPopup = (args: PopupOpenEventArgs): void => {
    const dialogRef: Dialog = (args.element as EJ2Instance)
      .ej2_instances[0] as Dialog;
    dialogRef.height = 576;
    dialogRef.width = 848;
    dialogRef.dataBind();
  };

  const resourceHeaderTemplate = (data: ResourceDetails): JSX.Element => {
    if (String(data.resourceData.ClassName).endsWith('e-child-node')) {
      return (
        <ButtonComponent cssClass="e-flat" iconCss="e-icons e-plus">
          {data.resourceData.text}
        </ButtonComponent>
      );
    } else {
      return <div className="e-resource-text">{data.resourceData.text}</div>;
    }
  };

  const editorTemplate = (data: Record<string, any>): JSX.Element => {
    if (!isNullOrUndefined(data)) {
      return (
        <div className="custom-editor">
          <div className="flex-row">
            <TextBoxComponent
              cssClass="e-field"
              placeholder="Title"
              floatLabelType="Always"
            />
            <DropDownListComponent
              cssClass="e-field"
              placeholder="Location"
              floatLabelType="Always"
              popupHeight={160}
            />
          </div>
          <div className="flex-row">
            <TextBoxComponent
              cssClass="e-field"
              placeholder="Invite Required Attendees"
              floatLabelType="Always"
            />
          </div>
          <div className="flex-row">
            <div className="flex-col">
              <div className="flex-row row-container">
                <div className="flex-col">
                  <div className="field-label e-css">Start Date</div>
                  <DatePickerComponent />
                </div>
                <div className="flex-col">
                  <div className="field-label e-css">Start Time</div>
                  <TimePickerComponent />
                </div>
              </div>
            </div>
            <div className="flex-col">
              <CheckBoxComponent cssClass="e-field" label="All day" />
            </div>
          </div>
          <div className="flex-row">
            <div className="flex-col">
              <div className="flex-row row-container">
                <div className="flex-col">
                  <div className="field-label e-css">End Date</div>
                  <DatePickerComponent />
                </div>
                <div className="flex-col">
                  <div className="field-label e-css">End Time</div>
                  <TimePickerComponent />
                </div>
              </div>
            </div>
            <div className="flex-col">
              <DropDownListComponent
                cssClass="e-field"
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
                <Inject services={[Toolbar, EmojiPicker, HtmlEditor]} />
              </RichTextEditorComponent>
            </div>
          </div>
          <div className="flex-row">
            <div className="flex-col flex-col-auto">
              <div className="field-label e-css">Start Date</div>
              <DatePickerComponent width={200} />
            </div>
            <div className="flex-col flex-col-auto">
              <div className="field-label e-css">Start Time</div>
              <TimePickerComponent width={100} />
            </div>
            <div className="flex-col flex-col-auto">
              <div className="field-label e-css">End Time</div>
              <TimePickerComponent width={100} />
            </div>
            <div className="flex-col">
              <CheckBoxComponent cssClass="e-field" label="All day" />
            </div>
          </div>
          <div className="flex-full-row">
            <ScheduleComponent
              showHeaderBar={false}
              showTimeIndicator={false}
              height={300}
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
                  dataSource={[
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
                  ]}
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
                  dataSource={[
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
                  ]}
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
      return <div></div>;
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
          <ButtonComponent cssClass="e-primary" iconCss="e-icons e-plus">
            New Event
          </ButtonComponent>
          <div className="e-avatar e-avatar-small e-avatar-circle"></div>
        </div>
      </header>
      <main>
        <ScheduleComponent
          height="100%"
          width="100%"
          currentView="Month"
          showQuickInfo={false}
          editorTemplate={editorTemplate}
          navigating={dateNavigation}
          popupOpen={openPopup}>
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
