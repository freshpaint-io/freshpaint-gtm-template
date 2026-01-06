import {
  commonEventName,
  commonEventPropertiesJSONValue,
  commonEventPropsVariable,
  commonOptinOptOut,
  commonOptinOptOutInstances,
} from './common';
import { tagTypeEq } from './helpers';
import { track } from './integration';

export default function TrackParams() {
  const isTrackEvent = tagTypeEq(track);
  const onlyForTrack = [isTrackEvent];

  return [
    commonEventName(onlyForTrack),
    commonEventPropsVariable(onlyForTrack),
    commonEventPropertiesJSONValue(onlyForTrack),
    commonOptinOptOut(onlyForTrack),
    commonOptinOptOutInstances(onlyForTrack),
  ];
}
