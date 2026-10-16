import { commonEventName, commonEventProperties } from '../common';
import { tagTypeEq } from '../helpers';
import { mediaAlphaEvent } from '../integration';

export default function MediaAlphaParams() {
  const isMediaAlphaEvent = tagTypeEq(mediaAlphaEvent);
  const onlyForMediaAlpha = [isMediaAlphaEvent];

  return [commonEventName(onlyForMediaAlpha), commonEventProperties(onlyForMediaAlpha)];
}
