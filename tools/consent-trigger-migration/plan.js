export const FP_CONSENT_EVENT = 'fp_consent_update';

export const GCM_SIGNALS = [
  'ad_storage',
  'ad_user_data',
  'ad_personalization',
  'analytics_storage',
  'personalization_storage',
  'functionality_storage',
  'security_storage',
];

// GTM's built-in triggers don't appear in the workspace's trigger list.
const BUILT_IN_TRIGGERS = {
  2147479553: { name: 'All Pages', type: 'pageview' },
  2147479573: { name: 'Initialization - All Pages', type: 'init' },
  2147479572: { name: 'Consent Initialization - All Pages', type: 'consentInit' },
};

const PAGE_LOAD_TRIGGER_TYPES = new Set(['pageview', 'domReady', 'windowLoaded', 'init']);

// Google tags wait for the consent update themselves, so their triggers stay as they are.
const GOOGLE_TAG_TYPES = new Set([
  'googtag',
  'gaawc',
  'gaawe',
  'awct',
  'awcc',
  'awud',
  'sp',
  'flc',
  'fls',
  'gclidw',
  'ua',
]);

export const variableName = (signal) => `Freshpaint GCM - ${signal}`;

export const triggerName = (signals) => `Freshpaint consent granted - ${signals.join(' + ')}`;

const paramValue = (parameters, key) => (parameters || []).find((p) => p.key === key)?.value;

const conditionArgs = (condition) => [
  paramValue(condition.parameter, 'arg0'),
  paramValue(condition.parameter, 'arg1'),
];

export function variableResource(signal) {
  return {
    name: variableName(signal),
    type: 'v',
    parameter: [
      { type: 'integer', key: 'dataLayerVersion', value: '2' },
      { type: 'boolean', key: 'setDefaultValue', value: 'false' },
      { type: 'template', key: 'name', value: `fp_gcm.${signal}` },
    ],
  };
}

export function triggerResource(signals, variableNameBySignal) {
  const equals = (arg0, arg1) => ({
    type: 'equals',
    parameter: [
      { type: 'template', key: 'arg0', value: arg0 },
      { type: 'template', key: 'arg1', value: arg1 },
    ],
  });
  return {
    name: triggerName(signals),
    type: 'customEvent',
    customEventFilter: [equals('{{_event}}', FP_CONSENT_EVENT)],
    filter: signals.map((signal) => equals(`{{${variableNameBySignal[signal]}}}`, 'granted')),
  };
}

const sortSignals = (signals) =>
  [...new Set(signals)].sort((a, b) => GCM_SIGNALS.indexOf(a) - GCM_SIGNALS.indexOf(b));

export const signalSetKey = (signals) => sortSignals(signals).join('+');

// Returns the signal of a Data Layer Variable that reads fp_gcm.<signal>.
function fpSignalOfVariable(variable) {
  if (variable.type !== 'v') return undefined;
  const match = /^fp_gcm\.(\w+)$/.exec(paramValue(variable.parameter, 'name') || '');
  return match && GCM_SIGNALS.includes(match[1]) ? match[1] : undefined;
}

// Returns the sorted signals a trigger requires when it is an fp_consent_update trigger that only fires
// when each of them is granted, or undefined for any other trigger.
function fpSignalsOfTrigger(trigger, signalByVariableName) {
  if (trigger.type !== 'customEvent') return undefined;
  const events = trigger.customEventFilter || [];
  if (events.length !== 1 || events[0].type !== 'equals') return undefined;
  const [eventVariable, eventName] = conditionArgs(events[0]);
  if (eventVariable !== '{{_event}}' || eventName !== FP_CONSENT_EVENT) return undefined;

  const signals = [];
  for (const condition of trigger.filter || []) {
    const [arg0, arg1] = conditionArgs(condition);
    const signal = signalByVariableName[/^\{\{(.+)\}\}$/.exec(arg0 || '')?.[1]];
    if (condition.type !== 'equals' || arg1 !== 'granted' || !signal) return undefined;
    signals.push(signal);
  }
  return signals.length > 0 ? sortSignals(signals) : undefined;
}

function requiredSignals(tag) {
  if (tag.consentSettings?.consentStatus !== 'needed') return [];
  return (tag.consentSettings.consentType?.list || []).map((item) => item.value);
}

/**
 * Plans moving consent-gated, page-load tags that aren't Google tags onto fp_consent_update triggers that only
 * fire when the tag's signals are granted, set to fire once per page.
 *
 * A tag set to fire once per page that GTM blocks on consent still uses up its one firing, so the trigger must
 * filter on the granted state rather than rely on the tag's consent check alone.
 */
export function planMigration({ tags, triggers, variables }) {
  const variableBySignal = {};
  for (const variable of variables) {
    const signal = fpSignalOfVariable(variable);
    if (signal && !variableBySignal[signal]) variableBySignal[signal] = variable;
  }
  const signalByVariableName = Object.fromEntries(
    Object.entries(variableBySignal).map(([signal, variable]) => [variable.name, signal]),
  );

  const triggerById = {};
  for (const [triggerId, builtIn] of Object.entries(BUILT_IN_TRIGGERS)) {
    triggerById[triggerId] = { triggerId, ...builtIn };
  }
  const fpTriggerBySignalSet = {};
  for (const trigger of triggers) {
    triggerById[trigger.triggerId] = trigger;
    const signals = fpSignalsOfTrigger(trigger, signalByVariableName);
    if (signals && !fpTriggerBySignalSet[signalSetKey(signals)]) {
      fpTriggerBySignalSet[signalSetKey(signals)] = trigger;
    }
  }
  const isFpTrigger = (triggerId) =>
    Object.values(fpTriggerBySignalSet).some((trigger) => trigger.triggerId === triggerId);

  const migrate = [];
  const alreadyMigrated = [];
  const review = [];
  const skipped = { notConsentGated: 0, googleTag: 0, paused: 0, noFiringTriggers: 0 };

  for (const tag of tags) {
    const signals = requiredSignals(tag);
    if (signals.length === 0) {
      skipped.notConsentGated++;
      continue;
    }
    if (GOOGLE_TAG_TYPES.has(tag.type)) {
      skipped.googleTag++;
      continue;
    }
    if (tag.paused) {
      skipped.paused++;
      continue;
    }
    const firingTriggerIds = tag.firingTriggerId || [];
    if (firingTriggerIds.length === 0) {
      skipped.noFiringTriggers++;
      continue;
    }
    if (firingTriggerIds.every(isFpTrigger)) {
      alreadyMigrated.push(tag);
      continue;
    }

    const reasons = [];
    const unknownSignals = signals.filter((signal) => !GCM_SIGNALS.includes(signal));
    if (unknownSignals.length > 0) {
      reasons.push(`requires consent types that aren't GCM signals: ${unknownSignals.join(', ')}`);
    }
    for (const triggerId of firingTriggerIds) {
      const trigger = triggerById[triggerId];
      if (!trigger) {
        reasons.push(`fires on trigger ${triggerId}, which isn't in the workspace`);
      } else if (!PAGE_LOAD_TRIGGER_TYPES.has(trigger.type)) {
        reasons.push(
          `fires on "${trigger.name}" (${trigger.type}), which isn't a page-load trigger`,
        );
      } else if ((trigger.filter || []).length > 0) {
        reasons.push(
          `fires on "${trigger.name}", which has conditions the new trigger wouldn't keep`,
        );
      }
    }
    if ((tag.blockingTriggerId || []).length > 0) {
      reasons.push('has exception triggers, which only block on the event they fire on');
    }
    if ((tag.setupTag || []).length > 0 || (tag.teardownTag || []).length > 0) {
      reasons.push('uses tag sequencing');
    }

    if (reasons.length > 0) {
      review.push({ tag, reasons });
    } else {
      migrate.push({ tag, signals: sortSignals(signals) });
    }
  }

  const neededSignalSets = {};
  for (const { signals } of migrate) neededSignalSets[signalSetKey(signals)] = signals;

  const neededSignals = sortSignals(Object.values(neededSignalSets).flat());
  return {
    variables: neededSignals.map((signal) => ({ signal, existing: variableBySignal[signal] })),
    triggers: Object.entries(neededSignalSets).map(([key, signals]) => ({
      key,
      signals,
      existing: fpTriggerBySignalSet[key],
    })),
    migrate,
    alreadyMigrated,
    review,
    skipped,
  };
}

export function migratedTag(tag, triggerId) {
  return { ...tag, firingTriggerId: [triggerId], tagFiringOption: 'oncePerLoad' };
}
