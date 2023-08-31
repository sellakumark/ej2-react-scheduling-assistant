import * as React from 'react';
import { useSelector } from 'react-redux';

const Availability = (props: Record<string, any>): React.JSX.Element => {
  const reduxDate: Record<string, any> = useSelector(
    (state: Record<string, any>) => state.dateModifier.value,
  );
  const currentDate: Date = new Date(
    reduxDate.year,
    reduxDate.month,
    reduxDate.day,
  );
  const roomData: Array<Record<string, any>> = useSelector(
    (state: Record<string, any>) => state.roomModifier.value.roomData,
  );
  const bookingData: Array<Record<string, any>> = useSelector(
    (state: Record<string, any>) => state.bookingModifier.value.bookingData,
  );

  const getRoomBookedStatus = (id: number): Record<string, any> => {
    const currentDateBookings = bookingData.filter((item: any) => {
      const localCheckIn: string = new Date(item.CheckIn).toLocaleDateString();
      const localCheckOut: string = new Date(
        item.CheckOut,
      ).toLocaleDateString();
      return (
        localCheckIn === currentDate.toLocaleDateString() ||
        localCheckOut === currentDate.toLocaleDateString()
      );
    });
    const bookedRoomsInFloor: Array<Record<string, any>> =
      currentDateBookings.filter(
        (item: Record<string, any>) => item.Floor === id,
      );
    const numberOfRoomInFloor: Array<Record<string, any>> = roomData.filter(
      (item: Record<string, any>) => item.groupId === id,
    );
    let count: number = 0;
    for (const bookedRoom of bookedRoomsInFloor) {
      for (const roomNumber of numberOfRoomInFloor) {
        if (bookedRoom.Room === roomNumber.id) {
          count++;
        }
      }
    }
    const availableRooms: number = numberOfRoomInFloor.length - count;
    return {
      status: availableRooms > 0 ? 'avail' : 'full',
      count: availableRooms,
    };
  };

  const bookedStatus: Record<string, string> = getRoomBookedStatus(
    props.item.id,
  );

  return (
    <div className="available-rooms">
      <span className={`room-availability ${bookedStatus.status}`}>
        {`${bookedStatus.status} ${bookedStatus.count}`}
      </span>
    </div>
  );
};

export default Availability;
