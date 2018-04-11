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

/**
 * Determines the coordinates of an SVG circle in the coordinate system of the SVG root view port.
 * See https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again
 */
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

    /**
     * This is where the animation happens (on the real DOM).
     *
     * The circle needs to be animated from previous to current coordinates. The problem is, that a circle's coordinates
     * are expressed relative to its containing <g> element (which often encapsulates an actual React component).
     * In order for a circle to travel across such component boundaries, the animation has to happen in a global
     * coordinate system relative to the view port of the svg root (0).
     *
     * The DOM already contains a circle at the new position. We clone this circle (1) to get a dedicated element
     * that we animate in global coordinates. We thus need to attach the clone directly to the root (2).
     *
     * During the animation, we only want to show the animated circle and thus temporarily hide the real one (3).
     * At the end of the animation, we get rid of the animated circle (5) and un-hide the current one (6).
     */
    componentDidUpdate() {

        const svgRootNode = ReactDOM.findDOMNode(this).getElementsByTagName('svg').item(0) as SVGSVGElement;
        const circleNode = ReactDOM.findDOMNode(this).getElementsByTagName('circle').item(0) as SVGCircleElement;

        if (circleNode) {

            // (0) Calculate current relative to the global view port
            const currentCoordinates = getCoordinates(svgRootNode, circleNode);

            const previousCoordinates = this.coordinateCache.get(circleNode.id) || currentCoordinates;

            this.coordinateCache.set(circleNode.id, currentCoordinates);

            const easingFunction = currentCoordinates.cy > previousCoordinates.cy ? easeBounceOut : easeCubicInOut;

            // (1) This clone will be used for the animation
            const animatedCircleNode = circleNode.cloneNode(true) as SVGCircleElement;

            // (2) Attach to root element (animated x/y coordinates are in the system of the global view port)
            svgRootNode.appendChild(animatedCircleNode);

            // (3) The DOM already contains the circle at the new position -> hide it until the animation is over
            select(circleNode)
                .attr('visibility', 'hidden');

            // (4) The actual animation
            select(animatedCircleNode)
                .attr('visibility', 'visible')
                .attr('cx', previousCoordinates.cx)
                .attr('cy', previousCoordinates.cy)
                .transition()
                .duration(1000)
                .ease(easingFunction)
                .attr('cx', currentCoordinates.cx)
                .attr('cy', currentCoordinates.cy)
                .remove(); // (5) Detach the animated circle once we're done

            // (6) Once the animation is over, we can again show the new state (already properly placed in the DOM)
            select(circleNode)
                .transition()
                .delay(10000)
                .attr('visibility', 'visible');

        }

    }

}

export default App;