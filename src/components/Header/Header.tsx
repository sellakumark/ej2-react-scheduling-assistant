import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AnyAction } from '@reduxjs/toolkit';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import Calendar from '../Calendar/Calendar';
import Plus from '../../assets/images/plus.svg';
import Filter from '../../assets/images/filter.svg';
import { updateCurrentDate } from '../../redux/CurrentDate';
import { resetRoomData, searchFilter } from '../../redux/Room';
import './Header.scss';

const Header = (props: Record<string, any>): React.JSX.Element => {
  const dispatch: React.Dispatch<AnyAction> = useDispatch();
  const [isDevice, setIsDevice] = React.useState<boolean>(false);
  const currentDate: Record<string, number> = useSelector(
    (state: Record<string, any>) => state.dateModifier.value,
  );

  const handleClick = (): void => {
    props.onButtonClick();
  };

  const handleOpenEditor = (): void => {
    props.setOpenEditor(props.openEditor !== true);
  };

  const onFilterButtonCreated = (): void => {
    setIsDevice(document.querySelector('.e-device') !== null);
  };

  const prevMonthClick = (): void => {
    (
      document.querySelector(
        '.navigation-container .e-calendar .e-header.e-month .e-prev',
      ) as HTMLElement
    ).click();
    dispatch(
      updateCurrentDate({
        year: currentDate.year,
        month: currentDate.month - 1,
        day: currentDate.day,
      }),
    );
  };

  const nextMonthClick = (): void => {
    (
      document.querySelector(
        '.navigation-container .e-calendar .e-header.e-month .e-next',
      ) as HTMLElement
    ).click();
    dispatch(
      updateCurrentDate({
        year: currentDate.year,
        month: currentDate.month + 1,
        day: currentDate.day,
      }),
    );
  };

  const onSearchChange = (event: Record<string, string>): void => {
    const searchFieldString = event.value.toLocaleLowerCase();
    if (event.value === '') {
      dispatch(resetRoomData({}));
    } else {
      dispatch(searchFilter(searchFieldString));
    }
  };

  return (
    <React.Fragment>
      <div className="search-container">
        <TextBoxComponent
          placeholder="Search Room"
          cssClass="e-outline"
          floatLabelType="Auto"
          className="e-field"
          width={200}
          onChange={onSearchChange}
        />
      </div>
      <div className="navigation-container">
        <button className="e-previous-button" onClick={prevMonthClick}>
          <span
            className="e-btn-icon e-icons e-prev-icon"
            style={{ fontSize: '24px' }}></span>
        </button>
        <Calendar />
        <button className="e-next-button" onClick={nextMonthClick}>
          <span
            className="e-btn-icon e-icons e-next-icon"
            style={{ fontSize: '24px' }}></span>
        </button>
      </div>
      <div className="button-container">
        <ButtonComponent
          className="filter-button"
          created={onFilterButtonCreated}>
          <img src={Filter} onClick={handleClick}></img>
        </ButtonComponent>
        <ButtonComponent className="new-button" onClick={handleOpenEditor}>
          <img src={Plus}></img>
          {isDevice ? '' : 'New Booking'}
        </ButtonComponent>
      </div>
    </React.Fragment>
  );
};

export default Header;
