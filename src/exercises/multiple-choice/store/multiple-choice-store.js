import { action, observable } from 'mobx';
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

    select: action(() => {
      if (!parent.isEvaluated && !selected) {
        parent.reset();
        response.selected = true;
      }
    }),

    reset: action(() => response.selected = false),
  });
  return response;
}

export default function createStore(data) {
  const state = observable({
    ...data,
    isEvaluated: false,

    get responses () {
      return data.responses.map(({ text }, idx) => {
        return responseModel({
          text,
          idx,
          parent: state,
        })
      })
    },

    get userResponse() {
      return state.responses.reduce((acc, next) => {
        return [...acc, ...(next.isSelected ? [next.text] : [])];
      }, []);
    },

    get result() {
      return state.userResponse.toString() === state.validResponse.toString();
    },

    evaluate: action(() => state.isEvaluated = true),

    reset: action(() => {
      state.responses.forEach(response => response.reset());
      state.isEvaluated = false;
    }),

  });
  return state;
}
