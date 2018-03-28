import * as React from 'react';
import './App.css';
import { RootState } from '../types';
import Dot from './Dot';

export type Props = {
    readonly state: RootState;
};

const App = ({state}: Props) => {

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
};

export default App;
