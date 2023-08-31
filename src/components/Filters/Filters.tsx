import * as React from 'react';
import {
  AccordionComponent,
  AccordionItemDirective,
  AccordionItemsDirective,
} from '@syncfusion/ej2-react-navigations';
import FloorsFilter from './FloorsFilter';
import PriceFilter from './PriceFilter';
import FeaturesFilter from './FeaturesFilter';
import './Filters.scss';

const Filters = (): React.JSX.Element => {
  return (
    <AccordionComponent className="app-filters" expandMode="Single">
      <AccordionItemsDirective>
        <AccordionItemDirective
          header="Floors"
          content={FloorsFilter}
          expanded={true}
        />
        <AccordionItemDirective header="Price" content={PriceFilter} />
        <AccordionItemDirective header="Features" content={FeaturesFilter} />
      </AccordionItemsDirective>
    </AccordionComponent>
  );
};

export default Filters;
