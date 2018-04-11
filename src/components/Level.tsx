import { Item } from '../types';
import * as React from 'react';
import { scaleLinear } from 'd3-scale';

export type Props = {
    readonly x: number,
    readonly y: number,
    readonly width: number,
    readonly items: Item[];
};

const Level = ({x, y, width, items}: Props) => {

    const stepCount = 3;
    const scaleX = scaleLinear()
        .domain([0, stepCount - 1])
        .range([0, width]);

    const offsetY = 1.5; // radius + half of line-width

    return (
        <g transform={`translate(${x},${y})`}>
            {
                items.map(item => {
                    return (
                        <circle
                            key={item.id}
                            id={item.id}
                            r="1"
                            cx={scaleX(item.column)}
                            cy={y - offsetY}
                            fill="steelblue"
                        />
                    );
                })
            }
            <line x1={0} y1={y} x2={width} y2={y} stroke="black"/>
        </g>
    );

};

export default Level;