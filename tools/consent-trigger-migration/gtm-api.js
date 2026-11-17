const API_ROOT = 'https://tagmanager.googleapis.com/tagmanager/v2';

// The Tag Manager API allows 25 requests per 100 seconds per Google Cloud project, and answers with 403 (not 429)
// once that is used up.
export const DEFAULT_MIN_INTERVAL_MS = 4000;
const RETRYABLE_REASONS = new Set(['rateLimitExceeded', 'userRateLimitExceeded', 'quotaExceeded']);
const MAX_ATTEMPTS = 6;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class GtmApiError extends Error {
  constructor(status, body, request) {
    super(`${request} failed with ${status}: ${body?.error?.message || JSON.stringify(body)}`);
    this.status = status;
    this.reasons = (body?.error?.errors || []).map((e) => e.reason);
  }
}

export function createGtmClient({
  accessToken,
  minIntervalMs = DEFAULT_MIN_INTERVAL_MS,
  log = () => {},
}) {
  let nextRequestAt = 0;

  async function request(method, path, { query, body } = {}) {
    const url = new URL(`${API_ROOT}/${path}`);
    for (const [key, value] of Object.entries(query || {})) {
      if (value !== undefined) url.searchParams.set(key, value);
    }
    const label = `${method} ${path}`;

    for (let attempt = 1; ; attempt++) {
      const wait = nextRequestAt - Date.now();
      if (wait > 0) await sleep(wait);
      nextRequestAt = Date.now() + minIntervalMs;

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const text = await response.text();
      const parsed = text ? JSON.parse(text) : {};
      if (response.ok) return parsed;

      const error = new GtmApiError(response.status, parsed, label);
      const retryable =
        response.status === 429 ||
        response.status >= 500 ||
        (response.status === 403 && error.reasons.some((reason) => RETRYABLE_REASONS.has(reason)));
      if (!retryable || attempt === MAX_ATTEMPTS) throw error;

      const backoffMs = Math.min(100_000, 5000 * 2 ** (attempt - 1));
      log(
        `${label} was throttled (${response.status}); retrying in ${Math.round(backoffMs / 1000)}s`,
      );
      nextRequestAt = Date.now() + backoffMs;
    }
  }

  async function listAll(path, field) {
    const items = [];
    let pageToken;
    do {
      const page = await request('GET', path, { query: { pageToken } });
      items.push(...(page[field] || []));
      pageToken = page.nextPageToken;
    } while (pageToken);
    return items;
  }

  return {
    async findContainer(publicId, accountId) {
      const accountPaths = accountId
        ? [`accounts/${accountId}`]
        : (await listAll('accounts', 'account')).map((account) => account.path);
      for (const accountPath of accountPaths) {
        const containers = await listAll(`${accountPath}/containers`, 'container');
        const container = containers.find((c) => c.publicId === publicId);
        if (container) return container;
      }
      throw new Error(`No container ${publicId} is visible to this Google account`);
    },
    listWorkspaces: (containerPath) => listAll(`${containerPath}/workspaces`, 'workspace'),
    createWorkspace: (containerPath, workspace) =>
      request('POST', `${containerPath}/workspaces`, { body: workspace }),
    listTags: (workspacePath) => listAll(`${workspacePath}/tags`, 'tag'),
    listTriggers: (workspacePath) => listAll(`${workspacePath}/triggers`, 'trigger'),
    listVariables: (workspacePath) => listAll(`${workspacePath}/variables`, 'variable'),
    createVariable: (workspacePath, variable) =>
      request('POST', `${workspacePath}/variables`, { body: variable }),
    createTrigger: (workspacePath, trigger) =>
      request('POST', `${workspacePath}/triggers`, { body: trigger }),
    updateTag: (tag) =>
      request('PUT', tag.path, { query: { fingerprint: tag.fingerprint }, body: tag }),
  };
}
