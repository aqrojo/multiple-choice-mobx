import React from 'react';
import MultipleChoiceQuestion from './exercises/multiple-choice/question/multiple-choice-question';
import { exerciseData } from './mulitple-choice-data';

export default function App() {
 return (
   <MultipleChoiceQuestion data={exerciseData}/>
 )
}
