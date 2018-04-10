import * as React from 'react';
import './App.css';
import { ItemId, RootState } from '../types';
import Dot from './Dot';
import * as ReactDOM from 'react-dom';
import { select } from 'd3-selection';
import { easeCubicInOut } from 'd3-ease';
import { transition } from 'd3-transition';

export type Props = {
    readonly state: RootState;
};

type Coordinate = {
    cx: number
    cy: number
};

class App extends React.Component<Props> {

    private coordinateCache = new Map<ItemId, Coordinate>();

    render() {
        const {state} = this.props;

        const viewBox = {width: 100, height: 100};
        const margin = {top: 10, right: 10, bottom: 10, left: 10};
        const width = viewBox.width - margin.left - margin.right;
        const height = viewBox.height - margin.top - margin.bottom;

        return (
            <div className="App">
                <svg viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}>
                    <g transform={`translate(${margin.left}, ${margin.top})`}>
                        <rect width={width} height={height} fill="lightgrey"/>
                        <Dot width={width} item={state.item}/>
                    </g>
                </svg>
            </div>
        );
    }

    componentDidUpdate() {

        const circleNode = ReactDOM.findDOMNode(this).getElementsByTagName('circle').item(0) as SVGCircleElement;

        if (circleNode) {

            const currentCoordinates = {
                cx: circleNode.cx.baseVal.value,
                cy: circleNode.cy.baseVal.value
            };

            const previousCoordinates = this.coordinateCache.get(circleNode.id) || {cx: 0, cy: 0};

            this.coordinateCache.set(circleNode.id, currentCoordinates);

            select(circleNode)
                .attr('cx', previousCoordinates.cx)
                .attr('cy', previousCoordinates.cy)
                .transition(transition()
                    .duration(1000)
                    .ease(easeCubicInOut))
                .attr('cx', currentCoordinates.cx)
                .attr('cy', currentCoordinates.cy);
        }

    }

}

export default App;