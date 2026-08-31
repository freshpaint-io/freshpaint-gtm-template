import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { openAIEvent } from '../integration';

export default function OpenAIParams() {
  const isOpenAIEvent = tagTypeEq(openAIEvent);
  const onlyForOpenAI = [isOpenAIEvent];

  return [
    commonInstanceId(onlyForOpenAI),
    commonEventName(onlyForOpenAI),
    commonEventProperties(onlyForOpenAI),
  ];
}
