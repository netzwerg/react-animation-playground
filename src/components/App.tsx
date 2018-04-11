import * as React from 'react';
import './App.css';
import { ItemId, RootState } from '../types';
import * as ReactDOM from 'react-dom';
import { select } from 'd3-selection';
import { easeBounceOut, easeCubicInOut } from 'd3-ease';
import Level from './Level';
import 'd3-transition';

export type Props = {
    readonly state: RootState;
};

type Coordinate = {
    cx: number
    cy: number
};

function getCoordinates(svg: SVGSVGElement, circleNode: SVGCircleElement) {
    const point = svg.createSVGPoint();
    const circleClientRect = circleNode.getBoundingClientRect();

    const circleX = circleClientRect.left + circleClientRect.width / 2;
    const circleY = circleClientRect.top + circleClientRect.height / 2;

    point.x = circleX;
    point.y = circleY;

    const screenCTM = svg.getScreenCTM();

    if (screenCTM) {
        const circleCoordinates = point.matrixTransform(screenCTM.inverse());
        return { cx: circleCoordinates.x, cy: circleCoordinates.y};
    } else {
        return { cx: 0, cy: 0};
    }
}

class App extends React.Component<Props> {

    private coordinateCache = new Map<ItemId, Coordinate>();

    render() {
        const {state} = this.props;
        const items = [state.item];

        const viewBox = {width: 100, height: 100};
        const margin = {top: 10, right: 10, bottom: 10, left: 10};
        const width = viewBox.width - margin.left - margin.right;
        const height = viewBox.height - margin.top - margin.bottom;

        return (
            <div className="App">
                <svg viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}>
                    <g transform={`translate(${margin.left}, ${margin.top})`}>
                        <rect width={width} height={height} fill="lightgrey"/>
                        <Level
                            x={0}
                            y={10}
                            width={width / 2}
                            items={items.filter(i => i.row === 0)}
                        />
                        <Level
                            x={width / 2}
                            y={20}
                            width={width / 2}
                            items={items.filter(i => i.row === 1)}
                        />
                    </g>
                </svg>
            </div>
        );
    }

    componentDidUpdate() {

        const svgRootNode = ReactDOM.findDOMNode(this).getElementsByTagName('svg').item(0) as SVGSVGElement;
        const circleNode = ReactDOM.findDOMNode(this).getElementsByTagName('circle').item(0) as SVGCircleElement;

        if (circleNode) {

            const currentCoordinates = getCoordinates(svgRootNode, circleNode);

            const previousCoordinates = this.coordinateCache.get(circleNode.id) || currentCoordinates;

            this.coordinateCache.set(circleNode.id, currentCoordinates);

            const easingFunction = currentCoordinates.cy > previousCoordinates.cy ? easeBounceOut : easeCubicInOut;

            const animatedCircleNode = circleNode.cloneNode(true) as SVGCircleElement;
            svgRootNode.appendChild(animatedCircleNode);

            select(circleNode)
                .attr('visibility', 'hidden');

            select(animatedCircleNode)
                .attr('visibility', 'visible')
                .attr('cx', previousCoordinates.cx)
                .attr('cy', previousCoordinates.cy)
                .transition()
                .duration(1000)
                .ease(easingFunction)
                .attr('cx', currentCoordinates.cx)
                .attr('cy', currentCoordinates.cy)
                .remove();

            select(circleNode)
                .transition()
                .delay(10000)
                .attr('visibility', 'visible');

        }

    }

}

export default App;