import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EventHandler } from '@syncfusion/ej2-base';
import {
  CalendarComponent,
  type ChangeEventArgs,
  type RenderDayCellEventArgs,
} from '@syncfusion/ej2-react-calendars';
import { updateCurrentDate } from '../../redux/CurrentDate';
import './Calendar.scss';

const Calendar = (): React.JSX.Element => {
  const reduxDate = useSelector((state: any) => state.dateModifier.value);
  const currentDate = new Date(reduxDate.year, reduxDate.month, reduxDate.day);
  const bookingData = useSelector(
    (state: any) => state.bookingModifier.value.bookingData,
  );
  const roomData = useSelector(
    (state: any) => state.roomModifier.value.roomData,
  );
  const dispatch = useDispatch();

  const onDateChange = (args: ChangeEventArgs): void => {
    const dateObject = new Date(args.value as Date);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth();
    const day = dateObject.getDate();
    dispatch(updateCurrentDate({ year, month, day }));
  };

  const onCellRendered = (args: RenderDayCellEventArgs): void => {
    if (!args.element.classList.contains('e-other-month')) {
      const dateStr: string = args.date.toISOString().split('T')[0];
      const roomsBooked = bookingData.filter(
        (item: any) =>
          item.CheckIn.split('T')[0] === dateStr ||
          item.CheckOut.split('T')[0] === dateStr,
      );
      if (roomsBooked.length <= roomData.length / 2) {
        args.element.classList.add('available');
      }
      if (roomsBooked.length === roomData.length) {
        args.element.classList.add('not-available');
      }
      if (roomsBooked.length >= roomData.length / 2) {
        args.element.classList.add('almost-full');
      }
    }
  };

  const onCreated = (): void => {
    EventHandler.clearEvents(
      document.querySelector(
        '.navigation-container .e-calendar .e-header.e-month .e-day.e-title',
      ),
    );
  };

  return (
    <CalendarComponent
      cssClass="app-calendar"
      change={onDateChange}
      value={currentDate}
      renderDayCell={onCellRendered}
      created={onCreated}
    />
  );
};

export default Calendar;
