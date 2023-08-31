import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type AnyAction } from '@reduxjs/toolkit';
import {
  CheckBoxComponent,
  type ChangeEventArgs,
} from '@syncfusion/ej2-react-buttons';
import { addRoomData, removeRoomData } from '../../redux/Room';
import Availability from './Availability';
import './Filters.scss';

const FloorsFilter = (): React.JSX.Element => {
  const dispatch: React.Dispatch<AnyAction> = useDispatch();
  const floorData: Array<Record<string, any>> = useSelector(
    (state: any) => state.roomModifier.value.floors,
  );
  const initialCheckboxStates: boolean[] = floorData.map(
    (_data: Record<string, any>, index: number) => index === 0,
  );
  const [checkboxStates, setCheckboxStates] = React.useState<boolean[]>(
    initialCheckboxStates,
  );

  const onCheckboxChange = (args: ChangeEventArgs, index: number): void => {
    const newCheckboxStates: boolean[] = [...checkboxStates];
    newCheckboxStates[index] = args.checked;
    setCheckboxStates(newCheckboxStates);
    dispatch(
      args.checked === true ? addRoomData(index) : removeRoomData(index),
    );
  };

  return (
    <div className="checkbox-filter-container">
      {floorData.map((item: Record<string, any>, index: number) => (
        <div className="floor-filter" key={item.id}>
          <div className="filter-checkbox">
            <CheckBoxComponent
              label={item.text}
              checked={checkboxStates[index]}
              change={args => {
                onCheckboxChange(args, index);
              }}
            />
          </div>
          <Availability item={item}></Availability>
        </div>
      ))}
    </div>
  );
};

export default FloorsFilter;
