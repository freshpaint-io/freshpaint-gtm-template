import {
  commonEventName,
  commonEventPropertiesJSONValue,
  commonOptinOptOut,
  commonOptinOptOutInstances,
} from './common';
import { equals } from './helpers';

export default function TrackParams() {
  const isTrackEvent = equals('tagType', 'track');
  const onlyForTrack = [isTrackEvent];

  return [
    commonEventName(onlyForTrack),
    commonEventPropertiesJSONValue(onlyForTrack),
    commonOptinOptOut(onlyForTrack),
    commonOptinOptOutInstances(onlyForTrack),
  ];
}
