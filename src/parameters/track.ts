import {
  commonEventName,
  commonEventPropertiesJSONValue,
  commonOptinOptOut,
  commonOptinOptOutInstances,
} from './common';
import { tagTypeEq, track } from './helpers';

export default function TrackParams() {
  const isTrackEvent = tagTypeEq(track);
  const onlyForTrack = [isTrackEvent];

  return [
    commonEventName(onlyForTrack),
    commonEventPropertiesJSONValue(onlyForTrack),
    commonOptinOptOut(onlyForTrack),
    commonOptinOptOutInstances(onlyForTrack),
  ];
}
