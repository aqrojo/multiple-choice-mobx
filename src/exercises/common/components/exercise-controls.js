import React from 'react';
import { useObserver } from 'mobx-react-lite';

export default function ExerciseControls({ store }) {
  return useObserver(() =>
    <div className="exerciseControls">
      {!store.isEvaluated && (
        <button className="buttonBase" onClick={store.evaluate}>
          Check
        </button>
      )}
      {store.isEvaluated && (
        <button className="buttonBase" onClick={store.reset}>
          Reset
        </button>
      )}
    </div>,
  );
}
