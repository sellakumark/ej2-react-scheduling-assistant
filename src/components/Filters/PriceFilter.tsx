import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type AnyAction } from '@reduxjs/toolkit';
import {
  SliderComponent,
  type TooltipDataModel,
  type ChangedEventArgs,
} from '@syncfusion/ej2-react-inputs';
import {
  priceFilter,
  addFeaturesData,
  updatePriceSlider,
} from '../../redux/Room';
import './Filters.scss';

const PriceSlider = (): React.JSX.Element => {
  const sliderObj: React.MutableRefObject<SliderComponent> =
    React.useRef<SliderComponent>(null);
  const tooltip: TooltipDataModel = {
    placement: 'Before',
    isVisible: true,
    showOn: 'Focus',
  };
  const dispatch: React.Dispatch<AnyAction> = useDispatch();
  const checkBoxValues: boolean[] = useSelector(
    (state: Record<string, any>) => state.roomModifier.value.checkboxes,
  );
  const priceRange: number[] = useSelector(
    (state: Record<string, any>) => state.roomModifier.value.priceRange,
  );
  const [initialRendering, setInitialRendering] = React.useState<boolean>(true);

  const onSliderChanged = (args: ChangedEventArgs): void => {
    dispatch(addFeaturesData(checkBoxValues));
    dispatch(priceFilter(args.value));
    dispatch(updatePriceSlider(args.value));
  };

  const onSliderCreated = (): void => {
    if (initialRendering) {
      sliderObj.current.reposition();
      setInitialRendering(false);
    }
  };

  return (
    <div className="price-filter-container">
      <SliderComponent
        ref={sliderObj}
        cssClass="app-slider"
        value={priceRange}
        type="Range"
        tooltip={tooltip}
        min={0}
        max={500}
        changed={onSliderChanged}
        created={onSliderCreated}
      />
      <div className="slider-price">
        <span className="slider-label-start">$0</span>
        <span className="slider-label-end">$500</span>
      </div>
    </div>
  );
};

export default PriceSlider;
