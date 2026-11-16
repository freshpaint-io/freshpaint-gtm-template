import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { podscribeEvent } from '../integration';

export default function PodscribeParams() {
  const isPodscribeEvent = tagTypeEq(podscribeEvent);
  const onlyForPodscribe = [isPodscribeEvent];

  return [
    commonInstanceId(onlyForPodscribe),
    commonEventName(onlyForPodscribe),
    commonEventProperties(onlyForPodscribe),
  ];
}
