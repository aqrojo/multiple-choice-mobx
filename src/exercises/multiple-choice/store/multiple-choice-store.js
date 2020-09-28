import { observable, toJS } from 'mobx';
import when from '@aqrojo/when';
import FEEDBACK from '../../common/constants/feedback';

function responseModel({ parent, text, idx, selected = false }) {
  const response = observable({
    text,
    idx,
    selected,
    parent,

    get isValid() {
      return parent.validResponse.includes(text);
    },

    get result() {
      return when
        .case(!parent.isEvaluated, () => FEEDBACK.NONE)
        .case(response.selected && response.isValid, () => FEEDBACK.SUCCESS)
        .case(response.selected && !response.isValid, () => FEEDBACK.ERROR)
        .resolve();
    },

    select() {
      if (!parent.isEvaluated && !selected) {
        parent.reset();
        response.selected = true;
      }
    },

    reset() {
      response.selected = false;
    },
  });
  return response;
}

export default function createStore(data) {
  const state = observable({
    ...data,
    isEvaluated: false,

    get responses() {
      return data.responses.map(({ text }, idx) => {
        return responseModel({
          text,
          idx,
          parent: state,
        });
      });
    },

    get userResponse() {
      return state.responses.reduce((acc, next) => {
        return [...acc, ...(next.selected ? [next.text] : [])];
      }, []);
    },

    get result() {
      return state.userResponse.toString() === state.validResponse.toString();
    },

    get output() {
      return ({
        steam: state.steam,
        responses: state.responses.map(response => ({
          text: response.text,
        })),
        validResponse: toJS(state.validResponse),
        userResponse: state.userResponse,
        result: state.result,
      });
    },

    evaluate() {
      state.isEvaluated = true;
    },

    reset() {
      state.responses.forEach(response => response.reset());
      state.isEvaluated = false;
    },

  });
  return state;
}
