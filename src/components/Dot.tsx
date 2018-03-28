import { Item } from '../types';
import * as React from 'react';
import { scaleLinear } from 'd3-scale';
import { stepCount } from '../constants';

export type Props = {
    readonly width: number;
    readonly item: Item;
};

const Dot = ({width, item}: Props) => {

    const scaleX = scaleLinear()
        .domain([0, stepCount - 1])
        .range([0, width]);

    return <circle r="1" cx={scaleX(item.step)} fill="steelblue"/>;
};

export default Dot;