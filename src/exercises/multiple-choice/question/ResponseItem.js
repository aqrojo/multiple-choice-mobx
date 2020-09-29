import React from 'react';
import { useObserver } from 'mobx-react-lite';
import cn from '@aqrojo/class-names';
import { ReactComponent as CheckIcon } from "../../assets/done-24px.svg";
import FEEDBACK from '../../common/constants/feedback';

export function ResponseItem({ response, isEvaluated }) {
  return useObserver(() =>
    <div
      className={cn(
        'responseWrapper', {
          selected: response.selected,
          lock: isEvaluated,
          error: response.result === FEEDBACK.ERROR,
          success: response.result === FEEDBACK.SUCCESS,
        },
      )}
      onClick={response.select}
    >
      <CheckIcon
        className="responseIcon"
        width={18}
        fill="green"
        style={{ visibility: response.selected ? 'visible' : 'hidden' }}
      />
      <div
        className="responseContent"
        dangerouslySetInnerHTML={{ __html: response.text }}
      />
    </div>,
  );
}
