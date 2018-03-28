import { Item } from '../types';
import * as React from 'react';
import { scaleLinear } from 'd3-scale';
import { stepCount } from '../constants';
import Animate from 'react-move/Animate';
import { easeExpOut } from 'd3-ease';

export type Props = {
    readonly width: number;
    readonly item: Item;
};

class Dot extends React.Component<Props> {

    render() {
        const {width, item} = this.props;
        const scaleX = scaleLinear()
            .domain([0, stepCount - 1])
            .range([0, width]);
        const cx = scaleX(item.step);
        return (
            <Animate
                key={item.id}

                start={{
                    cx: cx
                }}

                update={{
                    cx: [cx],
                    timing: { duration: 1000, ease: easeExpOut },
                }}

            >
                {(state) => {
                    return (
                        <circle
                            r="1"
                            cx={state.cx as number}
                            fill="steelblue"
                        />
                    );
                }}
            </Animate>
        );
    }

}

export default Dot;