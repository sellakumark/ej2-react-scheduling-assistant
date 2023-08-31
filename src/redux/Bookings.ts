import { Slice, createSlice } from '@reduxjs/toolkit';

const generateStaticEvents = (start: Date, floor: number, resCount: number, overlapCount: number): Array<Record<string, any>> => {
    let data: Array<Record<string, any>> = [];
    let id: number = 1;
    for (let i: number = 0, f: number = floor; i < resCount; i++, f++) {
        let randomCollection: number[] = [];
        let random: number = 0;
        for (let j: number = 0; j < overlapCount; j++) {
            random = Math.floor(Math.random() * (30));
            random = (random === 0) ? 1 : random;
            if (randomCollection.indexOf(random) !== -1 || randomCollection.indexOf(random + 2) !== -1 ||
                randomCollection.indexOf(random - 2) !== -1) {
                random += (Math.max.apply(null, randomCollection) + 10);
            }
            for (let k: number = 1; k <= 2; k++) {
                randomCollection.push(random + k);
            }
            let startDate: Date = new Date(start.getFullYear(), start.getMonth(), random);
            let endDate: Date = new Date(startDate.getTime() + ((1440 + 30) * (1000 * 60)));
            let dateDifference: number = 0;
            const timeDifference = endDate.getTime() - startDate.getTime();
            const differenceInDays = timeDifference / (1000 * 60 * 60 * 24);
            dateDifference = differenceInDays;
            const nights = Math.floor(dateDifference);
            const adult = Math.floor(Math.random() * 4) + 1;
            const children = Math.floor(Math.random() * 5);
            let floor = 0;
            let roomsInFloor = 4;
            if (i >= 1 * roomsInFloor) {
                floor += 1;
            }
            if (i >= 2 * roomsInFloor) {
                floor += 1;
            }
            if (i >= 3 * roomsInFloor) {
                floor += 1;
            }
            if (i >= 4 * roomsInFloor) {
                floor += 1;
            }
            data.push({
                Id: id,
                Subject: 'Booking' + id,
                CheckIn: startDate.toISOString(),
                CheckOut: endDate.toISOString(),
                IsAllDay: (id % 10) ? false : true,
                Floor: floor + 1,
                Room: i + 1,
                Nights: nights,
                Adult: adult,
                Children: children,
            });
            id++;
        }
    }
    return data;
};

const randomDataSource: Array<Record<string, any>> = generateStaticEvents(new Date(2023, 7, 1), 5, 20, 30);

export const dateSlice: Slice<Record<string, any>> = createSlice({
    name: 'bookingData',
    initialState: {
        value: {
            bookingData: randomDataSource,
            nights: 0,
            startDate: null,
            endDate: null,
        },
    },
    reducers: {
        addData: (state, action) => {
            state.value.bookingData.push(action.payload);
        },
        deleteData: (state, action) => {
            const index = state.value.bookingData.findIndex(x => x.Id === action.payload.Id);
            state.value.bookingData.splice(index, 1);
        },
        updateData: (state, action) => {
            const index = state.value.bookingData.findIndex(x => x.Id === action.payload.Id);
            state.value.bookingData[index] = action.payload;
        },
    },
})

export const { addData, deleteData, updateData } = dateSlice.actions;

export default dateSlice.reducer;