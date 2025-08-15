// Lower bucket = earlier. If a param doesn't match any rule, it keeps author order (bucket 0).
export const ORDER_RULES = [
  // 1) Tag selector first
  { nameRe: /^tagType$/, bucket: -300 },

  // 2) Instance selectors
  { nameRe: /(InstanceName|InstanceNames)$/, bucket: -200 },

  // 3) Freshpaint event name immediately after instance selectors
  { nameRe: /^commonEventName$/, bucket: -180 },

  // 4) Generic event properties tables
  {
    nameRe: /^(commonEventProperties|commonEventPropertiesJSONValue)$/,
    bucket: 80,
  },

  // 5) Generic user properties after generic event properties
  { nameRe: /^commonUserProperties$/, bucket: 90 },

  // 6) Opt-in/out very last
  { nameRe: /^commonOptinOptOut$/, bucket: 95 },
  { nameRe: /(identifyOptinOptOutInstances|commonOptinOptOutInstances)$/, bucket: 100 },
];

const bucketValue = (b) => (b === 'first' ? -100 : b === 'last' ? 100 : b);

function pickBucket(p, parentGroupName) {
  for (const r of ORDER_RULES) {
    const okName = r.nameRe ? r.nameRe.test(p.name || '') : true;
    const okType = r.typeRe ? r.typeRe.test(p.type || '') : true;
    const okGroup = r.inGroupRe
      ? parentGroupName
        ? r.inGroupRe.test(parentGroupName)
        : false
      : true;
    if (okName && okType && okGroup) return bucketValue(r.bucket ?? 0);
  }
  return 0; // default
}

function stableSort(arr, keyFn) {
  return arr
    .map((v, i) => ({ v, i, k: keyFn(v, i) }))
    .sort((a, b) => a.k - b.k || a.i - b.i)
    .map((x) => x.v);
}

export function orderParamsDeterministic(params) {
  const sortLevel = (list, parentName) => {
    const sorted = stableSort(list, (p, i) => pickBucket(p, parentName));
    for (const p of sorted) {
      if (p.type === 'GROUP' && Array.isArray(p.subParams)) {
        p.subParams = sortLevel(p.subParams, p.name);
      }
    }
    return sorted;
  };
  return sortLevel([...params], undefined);
}
