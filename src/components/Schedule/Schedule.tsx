import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  isNullOrUndefined,
  L10n,
  Internationalization,
} from '@syncfusion/ej2-base';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import {
  DropDownListComponent,
  type ChangeEventArgs,
} from '@syncfusion/ej2-react-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import {
  ScheduleComponent,
  Inject,
  TimelineViews,
  ResourcesDirective,
  ResourceDirective,
  ViewsDirective,
  ViewDirective,
  addDays,
  resetTime,
  type EventRenderedArgs,
  type EventSettingsModel,
  type ActionEventArgs,
  type TimeScaleModel,
  type GroupModel,
  type EJ2Instance,
} from '@syncfusion/ej2-react-schedule';
import { addData, deleteData, updateData } from '../../redux/Bookings';
import SvgIcon from './SvgIcon';
import './Schedule.scss';

L10n.load({
  'en-US': {
    schedule: {
      newEvent: 'New Booking Details',
    },
  },
});

const Schedule = (props: Record<string, any>): React.JSX.Element => {
  let startDate: number;
  let endDate: number;
  let dateDifference: number = 0;
  const nightRef = React.useRef(null);
  const priceRef = React.useRef(null);
  const dispatch = useDispatch();
  const reduxDate = useSelector((state: any) => state.dateModifier.value);
  const currentDate = new Date(reduxDate.year, reduxDate.month, reduxDate.day);
  const floorData = useSelector(
    (state: any) => state.roomModifier.value.floorData,
  );
  const roomData = useSelector(
    (state: any) => state.roomModifier.value.roomData,
  );
  const bookingData = useSelector(
    (state: any) => state.bookingModifier.value.bookingData,
  );
  const borderColor = useSelector(
    (state: any) => state.roomModifier.value.borderColor,
  );
  const [selectedFloor, setSelectedFloor] = React.useState(null);
  const [selectedRoom, setSelectedRoom] = React.useState(null);
  const [filteredRooms, setFilteredRooms] = React.useState([]);
  const eventsSource = bookingData.map((item: any) => ({
    Id: item.Id,
    Subject: item.Subject,
    CheckIn: item.CheckIn,
    CheckOut: item.CheckOut,
    IsAllDay: item.IsAllDay,
    Room: item.Room,
    Floor: item.Floor,
    CategoryColor: item.CategoryColor,
    Price: item.Price,
    Adult: item.Adult,
    Children: item.Children,
    Nights: item.Nights,
  }));
  const [initialRendering, setInitialRendering] = React.useState<boolean>(true);
  const scheduleObj = React.useRef<ScheduleComponent>(null);
  const intl: Internationalization = new Internationalization();
  const workDays: number[] = [0, 1, 2, 3, 4, 5];
  const timeScale: TimeScaleModel = { enable: false };
  const eventSettings: EventSettingsModel = {
    dataSource: eventsSource,
    fields: {
      startTime: { name: 'CheckIn' },
      endTime: { name: 'CheckOut' },
    },
  };
  const group: GroupModel = {
    resources: ['Projects', 'Categories'],
    enableCompactView: false,
  };

  React.useEffect(() => {
    openEditor();
  }, [props.openEditor]);

  const openEditor = (): void => {
    if (initialRendering) {
      setInitialRendering(false);
    } else {
      const cellData: Record<string, any> = {
        startTime: new Date(),
        endTime: addDays(resetTime(new Date()), 1),
      };
      scheduleObj.current.openEditor(cellData, 'Add');
    }
  };

  const getDateHeaderDay = (value: Date): string =>
    intl.formatDate(value, { skeleton: 'E' });
  const getDateHeaderDate = (value: Date): string =>
    intl.formatDate(value, { skeleton: 'd' });
  const dateHeaderTemplate = (props: any): React.JSX.Element => {
    return (
      <React.Fragment>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {getDateHeaderDay(props.date)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {getDateHeaderDate(props.date)}
        </div>
      </React.Fragment>
    );
  };

  const getPrice = (index: number): string => {
    const price: number =
      scheduleObj.current.getResourcesByIndex(index).resourceData.price;
    return `$${price}`;
  };

  const cellTemplate = (props: any): React.JSX.Element => {
    if (props.type === 'workCells') {
      return (
        <div className="template-wrap">
          <span className="price-tag">{getPrice(props.groupIndex)}</span>
        </div>
      );
    }
  };

  const eventTemplate = (props: any): React.JSX.Element => {
    const imageColor: string = getBorderColor(props.Room, props.Floor);
    return (
      <div className="template-wrap">
        <SvgIcon
          color={imageColor}
          subject={props.Subject}
          children={props.Children}
          adult={props.Adult}
          night={props.Nights}
        />
      </div>
    );
  };

  const onPopupOpen = (args: any): void => {
    if (
      args.type === 'QuickInfo' ||
      args.type === 'Editor' ||
      args.type === 'RecurrenceAlert' ||
      args.type === 'DeleteAlert'
    ) {
      const target =
        args.type === 'RecurrenceAlert' || args.type === 'DeleteAlert'
          ? args.element[0]
          : args.target;
      if (
        !isNullOrUndefined(target) &&
        target.classList.contains('e-work-cells')
      ) {
        if (
          target.classList.contains('e-read-only-cells') ||
          !scheduleObj.current.isSlotAvailable(args.data)
        ) {
          args.cancel = true;
        }
      }
      setTimeout(() => {
        const statusElement: any = args.element.querySelector('#GuestName');
        if (statusElement != null) {
          statusElement.value = args.data.Subject || '';
        }
        let checkIn: any = args.element.querySelector('#CheckIn');
        if (checkIn != null) {
          checkIn = checkIn.ej2_instances[0];
          checkIn.value = args.data.CheckIn || '';
          startDate = checkIn.value;
        }
        let checkOut: any = args.element.querySelector('#CheckOut');
        if (checkOut != null) {
          checkOut = checkOut.ej2_instances[0];
          checkOut.value = args.data.CheckOut || '';
          endDate = checkOut.value;
        }
        let floor: any = args.element.querySelector('#Floor');
        if (floor != null) {
          floor = floor.ej2_instances[0];
          floor.value = args.data.Floor || '';
        }
        let room: any = args.element.querySelector('#Room');
        if (room != null) {
          room = room.ej2_instances[0];
          room.value = args.data.Room || '';
        }
        const adults: any = args.element.querySelector('#Adults');
        if (adults != null) {
          adults.value = args.data.Adult || '1';
        }
        const children: any = args.element.querySelector('#Children');
        if (children != null) {
          children.value = args.data.Children || '1';
        }
        const nights: any = args.element.querySelector('#Nights');
        const price: any = args.element.querySelector('#Price');
        if (nights != null) {
          nights.value = args.data.Nights || '';
          if (nights.value === '') {
            const timeDifference = endDate - startDate;
            const differenceInDays = timeDifference / (1000 * 60 * 60 * 24);
            dateDifference = differenceInDays;
            nights.value = Math.ceil(differenceInDays).toString();
            price.value = (Math.ceil(differenceInDays) * 125).toString();
          } else {
            price.value = (args.data.Nights * 125).toString();
          }
        }
        if (statusElement != null) {
          statusElement.setAttribute('name', 'GuestName');
        }
      }, 100);
      if (!isNullOrUndefined(document.getElementById('EventType_Error'))) {
        document.getElementById('EventType_Error').style.display = 'none';
        document.getElementById('EventType_Error').style.left = '351px';
      }
      setTimeout(() => {
        const formElement = args.element.querySelector('.e-schedule-form');
        if (formElement == null) return;
        const validator = (formElement as EJ2Instance).ej2_instances[0];
        validator.addRules('GuestName', { required: true });
        validator.addRules('Children', { required: true });
        validator.addRules('Adult', { required: true });
      }, 100);
    }
  };

  const timeChanged = (args: any): void => {
    if (args.element.id === 'CheckIn') {
      startDate = args.value;
    }
    if (args.element.id === 'CheckOut') {
      endDate = args.value;
    }
    if (startDate && endDate) {
      const timeDifference = endDate - startDate;
      const differenceInDays = timeDifference / (1000 * 60 * 60 * 24);
      dateDifference = Math.round(differenceInDays);
      if (dateDifference <= 0) {
        dateDifference = 1;
      }
      nightRef.current.value = dateDifference;
      priceRef.current.value = dateDifference * 125;
    }
  };

  const editorTemplate = (props: Record<string, any>): React.JSX.Element => {
    return (
      <div className="custom-event-editor" style={{ width: '100%' }}>
        <div className="guest-name flex-prop">
          <span>Guest Name</span>
          <TextBoxComponent
            id="GuestName"
            cssClass="e-outline"
            floatLabelType="Auto"
            data-name="GuestName"
            className="e-field"
            type="text"
          />
        </div>
        <div className="check-in flex-prop box-border">
          <span>Check In</span>
          <DateTimePickerComponent
            id="CheckIn"
            format="dd/MM/yy"
            data-name="CheckIn"
            value={new Date(props.checkIn || props.CheckIn)}
            className="e-field"
            change={timeChanged}
          />
        </div>
        <div className="floors flex-prop box-border ">
          <DropDownListComponent
            id="Floor"
            data-name="Floor"
            className="e-field"
            dataSource={floorData}
            fields={{ text: 'text', value: 'id' }}
            value={selectedFloor}
            change={(args: ChangeEventArgs) => {
              onFloorChangeHandler(args, props.Room);
            }}
            placeholder="Select Floor"
          />
        </div>
        <div className="rooms flex-prop box-border">
          <DropDownListComponent
            id="Room"
            data-name="Room"
            className="e-field"
            value={selectedRoom}
            dataSource={filteredRooms}
            fields={{ text: 'text', value: 'id' }}
            placeholder="Select Property"
          />
        </div>
        <div className="price flex-prop">
          <span>Price per night (USD)</span>
          <TextBoxComponent
            id="Price"
            cssClass="e-outline"
            floatLabelType="Auto"
            data-name="Price"
            className="e-field"
            type="Number"
            ref={priceRef}
            readOnly={true}
            disabled={true}
          />
        </div>
        <div
          className="adults flex-prop"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
          <span>Adults</span>
          <input
            type="number"
            id="Adults"
            min={1}
            max={3}
            className="e-field"
            data-name="Adult"
            name="Adult"></input>
        </div>
        <div
          className="children flex-prop"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
          <span>Children</span>
          <input
            type="number"
            id="Children"
            min={1}
            max={3}
            className="e-field"
            data-name="Children"
            name="Children"></input>
        </div>
        <div className="nights flex-prop">
          <span>Nights</span>
          <TextBoxComponent
            id="Nights"
            cssClass="e-outline"
            floatLabelType="Auto"
            data-name="Nights"
            className="e-field"
            type="Number"
            ref={nightRef}
            readOnly={true}
            disabled={true}
          />
        </div>
        <div className="check-out flex-prop box-border">
          <span>Check Out</span>
          <DateTimePickerComponent
            id="CheckOut"
            format="dd/MM/yy"
            data-name="CheckOut"
            className="e-field"
            change={timeChanged}
          />
        </div>
      </div>
    );
  };

  const onFloorChangeHandler = (args: ChangeEventArgs, roomId: any): void => {
    const selectedFloorId = args.value;
    setSelectedFloor(selectedFloorId);
    setSelectedRoom(roomId);
    const filteredRooms = roomData.filter(
      (item: any) => item.groupId === selectedFloorId,
    );
    setFilteredRooms(filteredRooms);
  };

  const onEventRendered = (args: EventRenderedArgs): void => {
    applyCategoryColor(args);
    const workCell: Element = scheduleObj.current.element.querySelector(
      '.e-work-cells:not(.e-resource-group-cells)',
    );
    setTimeout(() => {
      args.element.style.height = `${workCell.clientHeight - 4}px`;
    }, 100);
  };

  const applyCategoryColor = (args: EventRenderedArgs): void => {
    const roomId = args.data.Room;
    const floorId = args.data.Floor;
    const borderColor = getBorderColor(roomId, floorId);
    args.element.style.setProperty(
      'border',
      `1px solid ${borderColor}`,
      'important',
    );
  };

  const getBorderColor = (roomId: number, floorId: number): string => {
    const key: string = `${roomId}_${floorId}`;
    return borderColor[key] || '#000000';
  };

  const onActionBegin = (event: ActionEventArgs): void => {
    if (
      event.requestType === 'eventCreate' ||
      event.requestType === 'eventChange'
    ) {
      const data: Record<string, any> =
        event.data instanceof Array ? event.data[0] : event.data;
      event.cancel = !scheduleObj.current.isSlotAvailable(data);
      if (event.cancel) {
        return;
      }
    }
    if (event.requestType === 'eventCreate') {
      const eventsSource = {
        Id: event.addedRecords[0].Id,
        Subject: event.addedRecords[0].GuestName,
        CheckIn: event.addedRecords[0].CheckIn.toISOString(),
        CheckOut: event.addedRecords[0].CheckOut.toISOString(),
        IsAllDay: event.addedRecords[0].IsAllDay,
        Room: event.addedRecords[0].Room,
        Floor: event.addedRecords[0].Floor,
        CategoryColor: event.addedRecords[0].CategoryColor,
        Price: event.addedRecords[0].Price,
        Adult: Number(event.addedRecords[0].Adult),
        Children: Number(event.addedRecords[0].Children),
        Nights: event.addedRecords[0].Nights,
      };
      dispatch(addData(eventsSource));
    }

    if (event.requestType === 'eventChange') {
      const eventsSource = {
        Id: event.changedRecords[0].Id,
        Subject: event.changedRecords[0].Subject,
        CheckIn: event.changedRecords[0].CheckIn.toISOString(),
        CheckOut: event.changedRecords[0].CheckOut.toISOString(),
        IsAllDay: false,
        Room: event.changedRecords[0].Room,
        Floor: event.changedRecords[0].Floor,
        CategoryColor: event.changedRecords[0].CategoryColor,
        Price: event.changedRecords[0].Price,
        Adult: Number(event.changedRecords[0].Adult),
        Children: Number(event.changedRecords[0].Children),
        Nights: event.changedRecords[0].Nights,
      };
      dispatch(updateData(eventsSource));
    }

    if (event.requestType === 'eventRemove') {
      const eventsSource = {
        Id: event.deletedRecords[0].Id,
        Subject: event.deletedRecords[0].Subject,
        CheckIn: event.deletedRecords[0].CheckIn.toISOString(),
        CheckOut: event.deletedRecords[0].CheckOut.toISOString(),
        IsAllDay: event.deletedRecords[0].IsAllDay,
        Room: event.deletedRecords[0].Room,
        Floor: event.deletedRecords[0].Floor,
        CategoryColor: event.deletedRecords[0].CategoryColor,
        Price: event.deletedRecords[0].Price,
        Adult: Number(event.deletedRecords[0].Adult),
        Children: Number(event.deletedRecords[0].Children),
        Nights: event.deletedRecords[0].Nights,
      };
      dispatch(deleteData(eventsSource));
    }
  };

  return (
    <ScheduleComponent
      ref={scheduleObj}
      cssClass="app-scheduler"
      width="100%"
      height="100%"
      selectedDate={currentDate}
      workDays={workDays}
      eventSettings={eventSettings}
      group={group}
      dateHeaderTemplate={dateHeaderTemplate}
      cellTemplate={cellTemplate}
      timeScale={timeScale}
      editorTemplate={editorTemplate}
      eventRendered={onEventRendered}
      actionBegin={onActionBegin}
      popupOpen={onPopupOpen}
      showQuickInfo={false}
      allowDragAndDrop={false}
      showHeaderBar={false}>
      <ResourcesDirective>
        <ResourceDirective
          field="Floor"
          title="Choose Project"
          name="Projects"
          allowMultiple={false}
          dataSource={floorData}
          textField="text"
          idField="id"
          colorField="color"
        />
        <ResourceDirective
          field="Room"
          title="Category"
          name="Categories"
          allowMultiple={true}
          dataSource={roomData}
          textField="text"
          idField="id"
          groupIDField="groupId"
          colorField="color"
        />
      </ResourcesDirective>
      <ViewsDirective>
        <ViewDirective
          option="TimelineWeek"
          isSelected={true}
          eventTemplate={eventTemplate}
        />
      </ViewsDirective>
      <Inject services={[TimelineViews]} />
    </ScheduleComponent>
  );
};

export default Schedule;
