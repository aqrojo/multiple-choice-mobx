import { observable } from 'mobx';
import when from '@aqrojo/when';
import FEEDBACK from '../../common/constants/feedback';

export default function ResponseModel({ parent, text, idx, selected = false }) {
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
