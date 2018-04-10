import { connect } from 'react-redux';
import App from '../components/App';
import { Dispatch } from 'redux';
import * as actions from '../actions/';
import { RootState } from '../types';

type StateProps = {
    readonly state: RootState;
};

const mapStateToProps = (state: RootState): StateProps => {
    return {state};
};

type DispatchProps = {
    readonly dispatch: Dispatch<actions.RootAction>;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.RootAction>): DispatchProps => {
    return {dispatch};
};

export default connect<StateProps>(mapStateToProps, mapDispatchToProps)(App);