var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");

// ../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options2) {
    this.name = name;
    this.startTime = options2?.startTime || _performanceNow();
    this.detail = options2?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options2) {
    const entry = new PerformanceMark(name, options2);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options2) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options2) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options2) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/entities.generated.js
var entities = {
  "AdminCapital": {
    "table": "admin_capital",
    "fields": {
      "type": {
        "type": "string",
        "enum": [
          "deposit",
          "withdrawal",
          "disbursement",
          "repayment_principal",
          "repayment_interest"
        ]
      },
      "amount": {
        "type": "number"
      },
      "balance_after": {
        "type": "number",
        "default": 0
      },
      "description": {
        "type": "string"
      },
      "related_loan_id": {
        "type": "string"
      },
      "related_user_id": {
        "type": "string"
      },
      "month_key": {
        "type": "string"
      }
    },
    "rls": {
      "create": {
        "user_condition": {
          "role": "admin"
        }
      },
      "read": {
        "user_condition": {
          "role": "admin"
        }
      },
      "update": {
        "user_condition": {
          "role": "admin"
        }
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "AppDownload": {
    "table": "app_download",
    "fields": {
      "user_id": {
        "type": "string"
      },
      "user_name": {
        "type": "string"
      },
      "platform": {
        "type": "string",
        "enum": [
          "android",
          "ios",
          "pwa"
        ]
      },
      "device_type": {
        "type": "string",
        "enum": [
          "mobile",
          "tablet",
          "desktop"
        ]
      },
      "device_model": {
        "type": "string"
      },
      "os_version": {
        "type": "string"
      },
      "browser": {
        "type": "string"
      },
      "country": {
        "type": "string"
      },
      "region": {
        "type": "string"
      },
      "city": {
        "type": "string"
      }
    },
    "rls": {
      "create": {
        "$or": [
          {
            "data.user_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "read": {
        "user_condition": {
          "role": "admin"
        }
      },
      "update": {
        "user_condition": {
          "role": "admin"
        }
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "AppSettings": {
    "table": "app_settings",
    "fields": {
      "terms_conditions": {
        "type": "string"
      },
      "agreement_template": {
        "type": "string"
      },
      "agreement_style": {
        "type": "string"
      },
      "loan_email_format": {
        "type": "string",
        "rls": {
          "read": {
            "$or": [
              {
                "created_by_id": "{{user.id}}"
              },
              {
                "user_condition": {
                  "role": "admin"
                }
              }
            ]
          }
        }
      },
      "closure_email_format": {
        "type": "string",
        "rls": {
          "read": {
            "$or": [
              {
                "created_by_id": "{{user.id}}"
              },
              {
                "user_condition": {
                  "role": "admin"
                }
              }
            ]
          }
        }
      },
      "loan_email_enabled": {
        "type": "boolean",
        "default": true,
        "rls": {
          "read": {
            "$or": [
              {
                "created_by_id": "{{user.id}}"
              },
              {
                "user_condition": {
                  "role": "admin"
                }
              }
            ]
          }
        }
      },
      "closure_email_enabled": {
        "type": "boolean",
        "default": true,
        "rls": {
          "read": {
            "$or": [
              {
                "created_by_id": "{{user.id}}"
              },
              {
                "user_condition": {
                  "role": "admin"
                }
              }
            ]
          }
        }
      },
      "reminder_email_enabled": {
        "type": "boolean",
        "default": true
      },
      "reminder_website_url": {
        "type": "string",
        "default": "https://shubhdhanlakshmi.in"
      },
      "privacy_policy": {
        "type": "string"
      },
      "about_us": {
        "type": "string"
      },
      "admin_upi_id": {
        "type": "string",
        "default": "9310601973@ibl"
      },
      "admin_upi_name": {
        "type": "string",
        "default": "SDL Shubh Dhan Lakshmi"
      },
      "referral_percentage": {
        "type": "number",
        "default": 1
      },
      "savings_percentage": {
        "type": "number",
        "default": 1
      },
      "interest_rate": {
        "type": "number",
        "default": 2
      },
      "portal_charge_percentage": {
        "type": "number",
        "default": 8
      },
      "processing_fee_percentage": {
        "type": "number",
        "default": 9
      },
      "partner_profit_percentage": {
        "type": "number",
        "default": 10
      },
      "partner_overdue_profit_percentage": {
        "type": "number",
        "default": 0.5
      },
      "overdue_daily_rate": {
        "type": "number",
        "default": 1
      },
      "kyc_daily_limit": {
        "type": "number",
        "default": 3
      },
      "lender_name": {
        "type": "string",
        "default": "Subrato Das"
      },
      "lender_pan": {
        "type": "string",
        "rls": {
          "read": {
            "$or": [
              {
                "created_by_id": "{{user.id}}"
              },
              {
                "user_condition": {
                  "role": "admin"
                }
              }
            ]
          }
        }
      },
      "lender_email": {
        "type": "string",
        "default": "shubhdhanlakshmifund@gmail.com",
        "rls": {
          "read": {
            "$or": [
              {
                "created_by_id": "{{user.id}}"
              },
              {
                "user_condition": {
                  "role": "admin"
                }
              }
            ]
          }
        }
      },
      "lender_address": {
        "type": "string",
        "default": "Indian Doorstep, Gali no. 7, Block M, Near sector 59 metro station, Mamura, Sector 59, Gautam Buddha Nagar, Noida, Uttar Pradesh - 201301",
        "rls": {
          "read": {
            "$or": [
              {
                "created_by_id": "{{user.id}}"
              },
              {
                "user_condition": {
                  "role": "admin"
                }
              }
            ]
          }
        }
      },
      "shareable_domain": {
        "type": "string",
        "default": "shubhdhanlakshmi.com"
      },
      "apk_android_url": {
        "type": "string"
      },
      "apk_ios_url": {
        "type": "string"
      },
      "payment_apps": {
        "type": "string"
      },
      "admin_notes": {
        "type": "string",
        "rls": {
          "read": {
            "$or": [
              {
                "created_by_id": "{{user.id}}"
              },
              {
                "user_condition": {
                  "role": "admin"
                }
              }
            ]
          }
        }
      },
      "monthly_target": {
        "type": "string"
      }
    },
    "rls": {
      "create": {
        "user_condition": {
          "role": "admin"
        }
      },
      "read": null,
      "update": {
        "user_condition": {
          "role": "admin"
        }
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "AppUpdate": {
    "table": "app_update",
    "fields": {
      "version": {
        "type": "string"
      },
      "download_url": {
        "type": "string"
      },
      "notes": {
        "type": "string"
      },
      "is_active": {
        "type": "boolean",
        "default": true
      },
      "reminder_days": {
        "type": "number",
        "default": 2
      },
      "sent_at": {
        "type": "string"
      },
      "sent_count": {
        "type": "number",
        "default": 0
      }
    },
    "rls": {
      "create": {
        "user_condition": {
          "role": "admin"
        }
      },
      "read": null,
      "update": {
        "user_condition": {
          "role": "admin"
        }
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "AppVisit": {
    "table": "app_visit",
    "fields": {
      "user_id": {
        "type": "string"
      },
      "user_name": {
        "type": "string"
      },
      "page": {
        "type": "string"
      },
      "device_type": {
        "type": "string",
        "enum": [
          "mobile",
          "tablet",
          "desktop"
        ]
      },
      "device_model": {
        "type": "string"
      },
      "os_version": {
        "type": "string"
      },
      "browser": {
        "type": "string"
      },
      "country": {
        "type": "string"
      },
      "region": {
        "type": "string"
      },
      "city": {
        "type": "string"
      }
    },
    "rls": {
      "create": {
        "$or": [
          {
            "data.user_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "read": {
        "user_condition": {
          "role": "admin"
        }
      },
      "update": {
        "user_condition": {
          "role": "admin"
        }
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "LoanApplication": {
    "table": "loan_application",
    "fields": {
      "user_id": {
        "type": "string"
      },
      "user_name": {
        "type": "string"
      },
      "user_mobile": {
        "type": "string"
      },
      "user_upi_id": {
        "type": "string"
      },
      "loan_id": {
        "type": "string"
      },
      "loan_date": {
        "type": "string"
      },
      "amount": {
        "type": "number"
      },
      "interest_amount": {
        "type": "number"
      },
      "repayment_amount": {
        "type": "number"
      },
      "original_repayment_amount": {
        "type": "number"
      },
      "waiver_amount": {
        "type": "number"
      },
      "overdue_waived": {
        "type": "boolean",
        "default": false
      },
      "due_date": {
        "type": "string"
      },
      "status": {
        "type": "string",
        "enum": [
          "pending_disbursement",
          "disbursed",
          "pending_verification",
          "repaid",
          "overdue",
          "rejected"
        ],
        "default": "pending_disbursement"
      },
      "agreement_pdf_url": {
        "type": "string"
      },
      "disbursement_screenshot": {
        "type": "string"
      },
      "call_recording_url": {
        "type": "string"
      },
      "additional_files": {
        "type": "string"
      },
      "repayment_screenshot": {
        "type": "string"
      },
      "repayment_screenshots": {
        "type": "string"
      },
      "admin_rejection_reason": {
        "type": "string"
      },
      "disbursed_date": {
        "type": "string"
      },
      "repaid_date": {
        "type": "string"
      },
      "overdue_days": {
        "type": "number",
        "default": 0
      },
      "referrer_earning_credited": {
        "type": "boolean",
        "default": false
      },
      "referrer_id": {
        "type": "string"
      }
    },
    "rls": {
      "create": {
        "$or": [
          {
            "$and": [
              {
                "data.user_id": "{{user.id}}"
              },
              {
                "data.status": "pending_disbursement"
              }
            ]
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "read": {
        "$or": [
          {
            "data.user_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "update": {
        "user_condition": {
          "role": "admin"
        }
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "MonthlyTarget": {
    "table": "monthly_target",
    "fields": {
      "month_key": {
        "type": "string"
      },
      "amount": {
        "type": "number"
      }
    },
    "rls": {
      "create": {
        "user_condition": {
          "role": "admin"
        }
      },
      "read": {
        "user_condition": {
          "role": "admin"
        }
      },
      "update": {
        "user_condition": {
          "role": "admin"
        }
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "Notification": {
    "table": "notification",
    "fields": {
      "user_id": {
        "type": "string"
      },
      "title": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "type": {
        "type": "string",
        "enum": [
          "transaction",
          "loan",
          "wallet",
          "system",
          "due_date"
        ],
        "default": "system"
      },
      "read": {
        "type": "boolean",
        "default": false
      },
      "related_id": {
        "type": "string"
      }
    },
    "rls": {
      "create": {
        "$or": [
          {
            "data.user_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "read": {
        "$or": [
          {
            "data.user_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "update": {
        "$or": [
          {
            "data.user_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "PartnerDeposit": {
    "table": "partner_deposit",
    "fields": {
      "user_id": {
        "type": "string"
      },
      "user_name": {
        "type": "string"
      },
      "amount": {
        "type": "number"
      },
      "status": {
        "type": "string",
        "enum": [
          "pending",
          "approved",
          "rejected"
        ],
        "default": "pending"
      },
      "agreement_pdf_url": {
        "type": "string"
      },
      "payment_screenshot": {
        "type": "string"
      },
      "rejection_reason": {
        "type": "string"
      },
      "approved_date": {
        "type": "string"
      }
    },
    "rls": {
      "create": {
        "$or": [
          {
            "$and": [
              {
                "data.user_id": "{{user.id}}"
              },
              {
                "data.status": "pending"
              }
            ]
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "read": {
        "$or": [
          {
            "data.user_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "update": {
        "user_condition": {
          "role": "admin"
        }
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "PartnerLoanAssignment": {
    "table": "partner_loan_assignment",
    "fields": {
      "loan_id": {
        "type": "string"
      },
      "partner_id": {
        "type": "string"
      },
      "loan_amount": {
        "type": "number"
      },
      "repayment_amount": {
        "type": "number"
      },
      "due_date": {
        "type": "string"
      },
      "profit_earned": {
        "type": "number",
        "default": 0
      },
      "overdue_bonus": {
        "type": "number",
        "default": 0
      },
      "status": {
        "type": "string",
        "enum": [
          "active",
          "repaid"
        ],
        "default": "active"
      },
      "repaid_date": {
        "type": "string"
      }
    },
    "rls": {
      "create": {
        "user_condition": {
          "role": "admin"
        }
      },
      "read": {
        "$or": [
          {
            "data.partner_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "update": {
        "user_condition": {
          "role": "admin"
        }
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "PartnerRequest": {
    "table": "partner_request",
    "fields": {
      "user_id": {
        "type": "string"
      },
      "user_name": {
        "type": "string"
      },
      "user_mobile": {
        "type": "string"
      },
      "user_email": {
        "type": "string"
      },
      "user_pan": {
        "type": "string"
      },
      "user_upi_id": {
        "type": "string"
      },
      "user_address": {
        "type": "string"
      },
      "status": {
        "type": "string",
        "enum": [
          "pending",
          "approved",
          "rejected"
        ],
        "default": "pending"
      },
      "rejection_reason": {
        "type": "string"
      }
    },
    "rls": {
      "create": {
        "$or": [
          {
            "data.user_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "read": {
        "$or": [
          {
            "data.user_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "update": {
        "user_condition": {
          "role": "admin"
        }
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "PartnerWithdrawal": {
    "table": "partner_withdrawal",
    "fields": {
      "user_id": {
        "type": "string"
      },
      "user_name": {
        "type": "string"
      },
      "user_upi_id": {
        "type": "string"
      },
      "amount": {
        "type": "number"
      },
      "withdrawal_type": {
        "type": "string",
        "enum": [
          "capital",
          "profit"
        ],
        "default": "profit"
      },
      "status": {
        "type": "string",
        "enum": [
          "pending",
          "approved",
          "rejected"
        ],
        "default": "pending"
      },
      "rejection_reason": {
        "type": "string"
      },
      "paid_date": {
        "type": "string"
      }
    },
    "rls": {
      "create": {
        "$or": [
          {
            "$and": [
              {
                "data.user_id": "{{user.id}}"
              },
              {
                "data.status": "pending"
              }
            ]
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "read": {
        "$or": [
          {
            "data.user_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "update": {
        "user_condition": {
          "role": "admin"
        }
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "RepaymentReminder": {
    "table": "repayment_reminder",
    "fields": {
      "loan_id": {
        "type": "string"
      },
      "loan_code": {
        "type": "string"
      },
      "user_id": {
        "type": "string"
      },
      "user_name": {
        "type": "string"
      },
      "user_mobile": {
        "type": "string"
      },
      "user_email": {
        "type": "string"
      },
      "stage": {
        "type": "string",
        "enum": [
          "t_minus_2",
          "t_minus_1",
          "due",
          "plus_1",
          "plus_2"
        ]
      },
      "stage_label": {
        "type": "string"
      },
      "scheduled_for": {
        "type": "string"
      },
      "due_date": {
        "type": "string"
      },
      "loan_amount": {
        "type": "number"
      },
      "repayment_amount": {
        "type": "number"
      },
      "overdue_days": {
        "type": "number",
        "default": 0
      },
      "overdue_amount": {
        "type": "number",
        "default": 0
      },
      "total_payable": {
        "type": "number"
      },
      "whatsapp_message": {
        "type": "string"
      },
      "email_status": {
        "type": "string",
        "enum": [
          "pending",
          "sent",
          "failed",
          "skipped"
        ],
        "default": "pending"
      },
      "email_sent_at": {
        "type": "string"
      },
      "email_error": {
        "type": "string"
      }
    },
    "rls": {
      "create": {
        "user_condition": {
          "role": "admin"
        }
      },
      "read": {
        "user_condition": {
          "role": "admin"
        }
      },
      "update": {
        "user_condition": {
          "role": "admin"
        }
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "SupportTicket": {
    "table": "support_ticket",
    "fields": {
      "user_id": {
        "type": "string"
      },
      "user_name": {
        "type": "string"
      },
      "user_mobile": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "screenshot_url": {
        "type": "string"
      },
      "status": {
        "type": "string",
        "enum": [
          "open",
          "responded",
          "closed"
        ],
        "default": "open"
      },
      "admin_response": {
        "type": "string"
      },
      "conversation": {
        "type": "string"
      }
    },
    "rls": {
      "create": {
        "$or": [
          {
            "data.user_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "read": {
        "$or": [
          {
            "data.user_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "update": {
        "$or": [
          {
            "data.user_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "TeamMember": {
    "table": "team_member",
    "fields": {
      "name": {
        "type": "string"
      },
      "education": {
        "type": "string"
      },
      "role": {
        "type": "string"
      },
      "photo_url": {
        "type": "string"
      },
      "order": {
        "type": "number",
        "default": 0
      },
      "upi_id": {
        "type": "string"
      },
      "upi_enabled": {
        "type": "boolean",
        "default": false
      }
    },
    "rls": {
      "create": {
        "user_condition": {
          "role": "admin"
        }
      },
      "read": null,
      "update": {
        "user_condition": {
          "role": "admin"
        }
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "User": {
    "table": "users",
    "fields": {
      "role": {
        "type": "string",
        "enum": [
          "admin",
          "user"
        ],
        "default": "user"
      },
      "mobile_number": {
        "type": "string"
      },
      "pan_number": {
        "type": "string"
      },
      "upi_id": {
        "type": "string"
      },
      "salary_date": {
        "type": "integer"
      },
      "referrer_name": {
        "type": "string"
      },
      "referrer_mobile": {
        "type": "string"
      },
      "referrer_id": {
        "type": "string",
        "rls": {
          "update": {
            "user_condition": {
              "role": "admin"
            }
          }
        }
      },
      "address_line1": {
        "type": "string"
      },
      "address_line2": {
        "type": "string"
      },
      "city": {
        "type": "string"
      },
      "state": {
        "type": "string"
      },
      "pincode": {
        "type": "string"
      },
      "kyc_status": {
        "type": "string",
        "enum": [
          "not_submitted",
          "pending",
          "approved",
          "rejected",
          "hold"
        ],
        "default": "not_submitted",
        "rls": {
          "update": {
            "user_condition": {
              "role": "admin"
            }
          }
        }
      },
      "kyc_attempt_count": {
        "type": "number",
        "default": 0,
        "rls": {
          "update": {
            "user_condition": {
              "role": "admin"
            }
          }
        }
      },
      "kyc_attempt_date": {
        "type": "string",
        "rls": {
          "update": {
            "user_condition": {
              "role": "admin"
            }
          }
        }
      },
      "kyc_blocked_until": {
        "type": "string",
        "rls": {
          "update": {
            "user_condition": {
              "role": "admin"
            }
          }
        }
      },
      "rejection_reason": {
        "type": "string"
      },
      "loan_limit": {
        "type": "number",
        "default": 0,
        "rls": {
          "update": {
            "user_condition": {
              "role": "admin"
            }
          }
        }
      },
      "profile_picture": {
        "type": "string"
      },
      "pan_card_image": {
        "type": "string"
      },
      "aadhaar_front_image": {
        "type": "string"
      },
      "aadhaar_back_image": {
        "type": "string"
      },
      "salary_slip_image": {
        "type": "string"
      },
      "additional_documents": {
        "type": "string"
      },
      "salary_date_set_date": {
        "type": "string"
      },
      "salary_slip_updated_date": {
        "type": "string"
      },
      "terms_accepted": {
        "type": "boolean",
        "default": false
      },
      "account_status": {
        "type": "string",
        "enum": [
          "active",
          "hold"
        ],
        "default": "active",
        "rls": {
          "update": {
            "user_condition": {
              "role": "admin"
            }
          }
        }
      },
      "registration_complete": {
        "type": "boolean",
        "default": false,
        "rls": {
          "update": {
            "user_condition": {
              "role": "admin"
            }
          }
        }
      },
      "limit_acknowledged": {
        "type": "number",
        "default": 0
      },
      "display_name": {
        "type": "string",
        "default": ""
      },
      "partner_status": {
        "type": "string",
        "enum": [
          "none",
          "pending",
          "approved",
          "rejected"
        ],
        "default": "none",
        "rls": {
          "update": {
            "user_condition": {
              "role": "admin"
            }
          }
        }
      },
      "app_installed": {
        "type": "boolean",
        "default": false
      },
      "app_version": {
        "type": "string"
      }
    },
    "rls": null
  },
  "WalletTransaction": {
    "table": "wallet_transaction",
    "fields": {
      "user_id": {
        "type": "string"
      },
      "type": {
        "type": "string",
        "enum": [
          "deposit",
          "withdrawal",
          "referral_earning",
          "savings_back",
          "monthly_growth",
          "admin_adjustment"
        ]
      },
      "amount": {
        "type": "number"
      },
      "status": {
        "type": "string",
        "enum": [
          "pending",
          "completed",
          "rejected"
        ],
        "default": "pending"
      },
      "screenshot_url": {
        "type": "string"
      },
      "description": {
        "type": "string"
      },
      "related_loan_id": {
        "type": "string"
      },
      "admin_reason": {
        "type": "string"
      },
      "processed_date": {
        "type": "string"
      }
    },
    "rls": {
      "create": {
        "$or": [
          {
            "$and": [
              {
                "data.user_id": "{{user.id}}"
              },
              {
                "data.type": {
                  "$in": [
                    "deposit",
                    "withdrawal"
                  ]
                }
              },
              {
                "data.status": "pending"
              }
            ]
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "read": {
        "$or": [
          {
            "data.user_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "update": {
        "user_condition": {
          "role": "admin"
        }
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "WhatsAppLog": {
    "table": "whats_app_log",
    "fields": {
      "user_id": {
        "type": "string"
      },
      "user_name": {
        "type": "string"
      },
      "user_mobile": {
        "type": "string"
      },
      "loan_id": {
        "type": "string"
      },
      "message_type": {
        "type": "string",
        "enum": [
          "kyc_approved",
          "limit_increased",
          "loan_disbursed",
          "repayment_verified",
          "loan_rejected",
          "repayment_reminder"
        ]
      },
      "message": {
        "type": "string"
      }
    },
    "rls": {
      "create": {
        "user_condition": {
          "role": "admin"
        }
      },
      "read": {
        "user_condition": {
          "role": "admin"
        }
      },
      "update": {
        "user_condition": {
          "role": "admin"
        }
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  }
};

// src/store.js
var entityNames = Object.keys(entities);
function entityDef(name) {
  const def = entities[name];
  if (!def) throw httpError(404, `Unknown entity: ${name}`);
  return def;
}
__name(entityDef, "entityDef");
function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}
__name(httpError, "httpError");
var SYSTEM_COLUMNS = ["id", "created_date", "updated_date", "created_by_id"];
var q = /* @__PURE__ */ __name((identifier) => `"${identifier}"`, "q");
var USER_RULES = {
  create: { user_condition: { role: "admin" } },
  read: null,
  update: { $or: [{ "data.id": "{{user.id}}" }, { user_condition: { role: "admin" } }] },
  delete: { user_condition: { role: "admin" } }
};
function rulesFor(def, action) {
  if (def.table === "users") return USER_RULES[action];
  return def.rls ? def.rls[action] : void 0;
}
__name(rulesFor, "rulesFor");
function columns(def) {
  return [...SYSTEM_COLUMNS, ...Object.keys(def.fields)];
}
__name(columns, "columns");
var USER_PROFILE_COLUMNS = ["email", "full_name", "status"];
function selectList(def) {
  const extra = def.table === "users" ? USER_PROFILE_COLUMNS : [];
  return [...columns(def), ...extra].map(q).join(", ");
}
__name(selectList, "selectList");
var isBool = /* @__PURE__ */ __name((def, field) => def.fields[field]?.type === "boolean", "isBool");
function toRow(def, data) {
  const row = {};
  for (const field of columns(def)) {
    if (data[field] === void 0) continue;
    const value = data[field];
    row[field] = isBool(def, field) ? value ? 1 : 0 : value;
  }
  if (def.table === "users") {
    for (const field of ["email", "full_name", "status"]) {
      if (data[field] !== void 0) row[field] = data[field];
    }
  }
  return row;
}
__name(toRow, "toRow");
function fromRow(def, row) {
  if (!row) return null;
  const out = { ...row };
  for (const [field, spec] of Object.entries(def.fields)) {
    if (spec.type === "boolean") out[field] = Boolean(row[field]);
  }
  return out;
}
__name(fromRow, "fromRow");
var OPERATORS = ["$in", "$nin", "$lt", "$lte", "$gt", "$gte", "$ne"];
function buildFilter(def, query = {}) {
  const clauses = [];
  const params = [];
  for (const [key, value] of Object.entries(query || {})) {
    if (value === void 0 || value === null) continue;
    if (key === "$or" || key === "$and") {
      const parts = (value || []).map((part) => buildFilter(def, part));
      if (!parts.length) continue;
      clauses.push(`(${parts.map((part) => part.sql).join(key === "$or" ? " OR " : " AND ")})`);
      for (const part of parts) params.push(...part.params);
      continue;
    }
    if (!columns(def).includes(key)) continue;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const operator of OPERATORS) {
        if (!(operator in value)) continue;
        const operand = value[operator];
        if (operator === "$in" || operator === "$nin") {
          const list = Array.isArray(operand) ? operand : [operand];
          if (!list.length) {
            clauses.push(operator === "$in" ? "1 = 0" : "1 = 1");
            continue;
          }
          clauses.push(`${q(key)} ${operator === "$in" ? "IN" : "NOT IN"} (${list.map(() => "?").join(", ")})`);
          params.push(...list);
        } else {
          const sqlOperator = { $lt: "<", $lte: "<=", $gt: ">", $gte: ">=", $ne: "!=" }[operator];
          clauses.push(`${q(key)} ${sqlOperator} ?`);
          params.push(operand);
        }
      }
      continue;
    }
    clauses.push(`${q(key)} = ?`);
    params.push(isBool(def, key) ? value ? 1 : 0 : value);
  }
  return { sql: clauses.length ? clauses.join(" AND ") : "1 = 1", params };
}
__name(buildFilter, "buildFilter");
function matchesUserCondition(condition, user) {
  if (!user) return false;
  return Object.entries(condition || {}).every(([key, expected]) => String(user[key] ?? "") === String(expected));
}
__name(matchesUserCondition, "matchesUserCondition");
function isAllowed(rule, user, data) {
  if (rule === null || rule === void 0) return true;
  if (!user) return false;
  if (Array.isArray(rule.$or)) return rule.$or.some((part) => isAllowed(part, user, data));
  if (Array.isArray(rule.$and)) return rule.$and.every((part) => isAllowed(part, user, data));
  if (rule.user_condition) return matchesUserCondition(rule.user_condition, user);
  const dataKeys = Object.keys(rule).filter((key) => key.startsWith("data."));
  if (dataKeys.length) {
    return dataKeys.every((key) => {
      const expected = rule[key];
      const actual = data?.[key.slice(5)];
      if (expected === "{{user.id}}") return actual === user.id;
      return String(actual ?? "") === String(expected ?? "");
    });
  }
  return false;
}
__name(isAllowed, "isAllowed");
function readScope(def, user) {
  const rule = rulesFor(def, "read");
  if (rule === null || rule === void 0) return null;
  return scopeFromRule(rule, user);
}
__name(readScope, "readScope");
function scopeFromRule(rule, user) {
  if (rule === null || rule === void 0) return null;
  if (Array.isArray(rule.$or)) {
    const parts = rule.$or.map((part) => scopeFromRule(part, user)).filter(Boolean);
    if (!parts.length) return { sql: "1 = 0", params: [] };
    if (parts.some((part) => part.sql === "1 = 1")) return null;
    return { sql: `(${parts.map((part) => part.sql).join(" OR ")})`, params: parts.flatMap((part) => part.params) };
  }
  if (Array.isArray(rule.$and)) {
    const parts = rule.$and.map((part) => scopeFromRule(part, user)).filter(Boolean);
    if (parts.some((part) => part.sql === "1 = 0")) return { sql: "1 = 0", params: [] };
    if (!parts.length) return null;
    return { sql: `(${parts.map((part) => part.sql).join(" AND ")})`, params: parts.flatMap((part) => part.params) };
  }
  if (rule.user_condition) {
    return matchesUserCondition(rule.user_condition, user) ? null : { sql: "1 = 0", params: [] };
  }
  const dataKeys = Object.keys(rule).filter((key) => key.startsWith("data."));
  if (dataKeys.length) {
    if (!user) return { sql: "1 = 0", params: [] };
    const parts = dataKeys.map((key) => {
      const expected = rule[key];
      const field = key.slice(5);
      return expected === "{{user.id}}" ? { sql: `${q(field)} = ?`, params: [user.id] } : { sql: `${q(field)} = ?`, params: [expected] };
    });
    return { sql: `(${parts.map((part) => part.sql).join(" AND ")})`, params: parts.flatMap((part) => part.params) };
  }
  return { sql: "1 = 0", params: [] };
}
__name(scopeFromRule, "scopeFromRule");
function orderClause(sort) {
  const value = String(sort || "-created_date").trim();
  const descending = value.startsWith("-");
  const field = descending ? value.slice(1) : value.replace(/^\+/, "");
  if (!/^[a-z_]+$/i.test(field)) return "ORDER BY created_date DESC";
  return `ORDER BY ${q(field)} ${descending ? "DESC" : "ASC"}`;
}
__name(orderClause, "orderClause");
var EntityStore = class {
  static {
    __name(this, "EntityStore");
  }
  constructor(db, user, { serviceRole = false } = {}) {
    this.db = db;
    this.user = user;
    this.serviceRole = serviceRole;
  }
  scope(def) {
    return this.serviceRole ? null : readScope(def, this.user);
  }
  async list(name, sort, limit) {
    return this.query(name, {}, sort, limit);
  }
  async filter(name, query, sort, limit) {
    return this.query(name, query, sort, limit);
  }
  async query(name, query, sort, limit) {
    const def = entityDef(name);
    const where = buildFilter(def, query);
    const scope = this.scope(def);
    const params = [...where.params];
    let sql = `SELECT ${selectList(def)} FROM ${def.table} WHERE ${where.sql}`;
    if (scope) {
      sql += ` AND ${scope.sql}`;
      params.push(...scope.params);
    }
    sql += ` ${orderClause(sort)}`;
    if (limit) sql += ` LIMIT ${Math.max(1, Math.min(Number(limit), 5e3))}`;
    const { results } = await this.db.prepare(sql).bind(...params).all();
    return (results || []).map((row) => fromRow(def, row));
  }
  async get(name, id) {
    const def = entityDef(name);
    const scope = this.scope(def);
    let sql = `SELECT ${selectList(def)} FROM ${def.table} WHERE id = ?`;
    const params = [id];
    if (scope) {
      sql += ` AND ${scope.sql}`;
      params.push(...scope.params);
    }
    const row = await this.db.prepare(sql).bind(...params).first();
    return fromRow(def, row);
  }
  async count(name, query = {}) {
    const def = entityDef(name);
    const where = buildFilter(def, query);
    const scope = this.scope(def);
    const params = [...where.params];
    let sql = `SELECT COUNT(*) AS total FROM ${def.table} WHERE ${where.sql}`;
    if (scope) {
      sql += ` AND ${scope.sql}`;
      params.push(...scope.params);
    }
    const row = await this.db.prepare(sql).bind(...params).first();
    return Number(row?.total || 0);
  }
  async create(name, data) {
    const def = entityDef(name);
    if (!this.serviceRole && !isAllowed(rulesFor(def, "create"), this.user, data)) {
      throw httpError(403, `Not allowed to create ${name}`);
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const row = {
      id: data.id || crypto.randomUUID(),
      created_date: now,
      updated_date: now,
      created_by_id: data.created_by_id || this.user?.id || null,
      ...toRow(def, data)
    };
    for (const [field, spec] of Object.entries(def.fields)) {
      if (row[field] === void 0 && spec.default !== void 0) {
        row[field] = isBool(def, field) ? spec.default ? 1 : 0 : spec.default;
      }
    }
    if (def.table === "users" && !row.email) throw httpError(400, "An email address is required");
    const names = Object.keys(row);
    const sql = `INSERT INTO ${def.table} (${names.map(q).join(", ")}) VALUES (${names.map(() => "?").join(", ")}) RETURNING *`;
    const created = await this.db.prepare(sql).bind(...names.map((key) => row[key])).first();
    return fromRow(def, created || row);
  }
  async update(name, id, data) {
    const def = entityDef(name);
    const existing = await this.get(name, id);
    if (!existing) throw httpError(404, `${name} not found`);
    if (!this.serviceRole && !isAllowed(rulesFor(def, "update"), this.user, { ...existing, ...data })) {
      throw httpError(403, `Not allowed to update ${name}`);
    }
    if (!this.serviceRole) {
      for (const [field, spec] of Object.entries(def.fields)) {
        if (data[field] === void 0 || !spec.rls?.update) continue;
        if (!isAllowed(spec.rls.update, this.user, { ...existing, ...data })) {
          throw httpError(403, `Not allowed to update ${name}.${field}`);
        }
      }
    }
    const patch = toRow(def, data);
    patch.updated_date = (/* @__PURE__ */ new Date()).toISOString();
    const names = Object.keys(patch);
    const sql = `UPDATE ${def.table} SET ${names.map((key) => `${q(key)} = ?`).join(", ")} WHERE id = ? RETURNING *`;
    const updated = await this.db.prepare(sql).bind(...names.map((key) => patch[key]), id).first();
    return fromRow(def, updated);
  }
  async delete(name, id) {
    const def = entityDef(name);
    const existing = await this.get(name, id);
    if (!existing) throw httpError(404, `${name} not found`);
    if (!this.serviceRole && !isAllowed(rulesFor(def, "delete"), this.user, existing)) {
      throw httpError(403, `Not allowed to delete ${name}`);
    }
    await this.db.prepare(`DELETE FROM ${def.table} WHERE id = ?`).bind(id).run();
    return { id };
  }
  async updateMany(name, query, patch) {
    const rows = await this.query(name, query);
    const def = entityDef(name);
    const values = toRow(def, patch);
    const names = Object.keys(values);
    if (!names.length) return rows.length;
    const sql = `UPDATE ${def.table} SET ${names.map((key) => `${q(key)} = ?`).join(", ")}, updated_date = ? WHERE id = ?`;
    const statements = rows.map((row) => this.db.prepare(sql).bind(...names.map((key) => values[key]), (/* @__PURE__ */ new Date()).toISOString(), row.id));
    if (statements.length) await this.db.batch(statements);
    return rows.length;
  }
  async bulkCreate(name, items) {
    const created = [];
    for (const item of items || []) created.push(await this.create(name, item));
    return created;
  }
  async bulkUpdate(name, items) {
    const updated = [];
    for (const item of items || []) {
      const { id, ...patch } = item || {};
      if (id) updated.push(await this.update(name, id, patch));
    }
    return updated;
  }
  async deleteMany(name, query) {
    const def = entityDef(name);
    const where = buildFilter(def, query);
    const scope = this.scope(def);
    const params = [...where.params];
    let sql = `DELETE FROM ${def.table} WHERE ${where.sql}`;
    if (scope) {
      sql += ` AND ${scope.sql}`;
      params.push(...scope.params);
    }
    const result = await this.db.prepare(sql).bind(...params).run();
    return Number(result?.meta?.changes || 0);
  }
  // Month/week buckets with counts and sums, the shape the dashboard reads.
  async aggregate(name, { query = {}, dateBucket, groupBy, sum } = {}) {
    const def = entityDef(name);
    const where = buildFilter(def, query);
    const scope = this.scope(def);
    const params = [...where.params];
    const bucket = dateBucket?.field && def.fields[dateBucket.field] ? dateBucket.field : "created_date";
    const unit = dateBucket?.unit === "week" ? "week" : "month";
    const bucketSql = unit === "week" ? `date(${q(bucket)}, '-' || ((strftime('%w', ${q(bucket)}) + 6) % 7) || ' days')` : `date(${q(bucket)}, 'start of month')`;
    const groups = (Array.isArray(groupBy) ? groupBy : groupBy ? [groupBy] : []).filter((field) => def.fields[field] || field === "created_date");
    const sums = (Array.isArray(sum) ? sum : sum ? [sum] : []).filter((field) => def.fields[field]);
    const select = [`${bucketSql} AS created_date`];
    for (const field of groups) select.push(q(field));
    select.push("COUNT(*) AS count");
    for (const field of sums) select.push(`SUM(${q(field)}) AS sum_${field}`);
    let sql = `SELECT ${select.join(", ")} FROM ${def.table} WHERE ${where.sql}`;
    if (scope) {
      sql += ` AND ${scope.sql}`;
      params.push(...scope.params);
    }
    sql += ` GROUP BY ${[bucketSql, ...groups.map(q)].join(", ")}`;
    const { results } = await this.db.prepare(sql).bind(...params).all();
    return { rows: (results || []).map((row) => ({ ...row })) };
  }
};

// src/auth.js
var SESSION_COOKIE = "sdl_session";
var SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
var PBKDF2_ITERATIONS = 1e5;
var encoder = new TextEncoder();
function httpError2(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}
__name(httpError2, "httpError");
var toBase64Url = /* @__PURE__ */ __name((bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), "toBase64Url");
var fromBase64Url = /* @__PURE__ */ __name((value) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}, "fromBase64Url");
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256
  );
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(bits)}`;
}
__name(hashPassword, "hashPassword");
async function verifyPassword(password, stored) {
  if (!stored) return false;
  const [scheme, iterations, salt, hash] = String(stored).split("$");
  if (scheme !== "pbkdf2") return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: fromBase64Url(salt), iterations: Number(iterations), hash: "SHA-256" },
    key,
    256
  );
  return toBase64Url(bits) === hash;
}
__name(verifyPassword, "verifyPassword");
async function hmacKey(secret) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}
__name(hmacKey, "hmacKey");
async function signToken(payload, secret) {
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(body));
  return `${body}.${toBase64Url(signature)}`;
}
__name(signToken, "signToken");
async function verifyToken(token, secret) {
  if (!token || !token.includes(".")) return null;
  const [body, signature] = token.split(".");
  const valid = await crypto.subtle.verify("HMAC", await hmacKey(secret), fromBase64Url(signature), encoder.encode(body));
  if (!valid) return null;
  const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body)));
  if (payload.exp && Date.now() > payload.exp) return null;
  return payload;
}
__name(verifyToken, "verifyToken");
function readCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}
__name(readCookie, "readCookie");
var secureFlag = /* @__PURE__ */ __name((env2) => String(env2.APP_BASE_URL || "").startsWith("https://") ? "; Secure" : "", "secureFlag");
async function createSession(user, env2) {
  const token = await signToken(
    { sub: user.id, role: user.role, exp: Date.now() + SESSION_TTL_SECONDS * 1e3 },
    env2.AUTH_SECRET
  );
  return { token, cookie: `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secureFlag(env2)}` };
}
__name(createSession, "createSession");
var clearedCookie = `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
function publicUser(row) {
  if (!row) return null;
  const def = entityDef("User");
  const user = {};
  for (const column of ["id", "created_date", "updated_date", ...Object.keys(def.fields)]) user[column] = row[column];
  user.email = row.email || "";
  user.full_name = row.full_name || "";
  user.status = row.status || "active";
  user.two_factor_enabled = Boolean(row.totp_enabled);
  for (const [field, spec] of Object.entries(def.fields)) {
    if (spec.type === "boolean") user[field] = Boolean(row[field]);
  }
  return user;
}
__name(publicUser, "publicUser");
function findUserRow(env2, id) {
  const def = entityDef("User");
  return env2.DB.prepare(`SELECT * FROM ${def.table} WHERE id = ?`).bind(id).first();
}
__name(findUserRow, "findUserRow");
function findUserByEmail(env2, email) {
  const def = entityDef("User");
  return env2.DB.prepare(`SELECT * FROM ${def.table} WHERE lower(email) = ?`).bind(String(email || "").toLowerCase()).first();
}
__name(findUserByEmail, "findUserByEmail");
async function currentUser(env2, request) {
  const header = request.headers.get("Authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : null;
  const payload = await verifyToken(bearer || readCookie(request, SESSION_COOKIE), env2.AUTH_SECRET);
  if (!payload?.sub) return null;
  const row = await findUserRow(env2, payload.sub);
  if (!row || row.status === "blocked") return null;
  return publicUser(row);
}
__name(currentUser, "currentUser");
async function requireUser(env2, request) {
  const user = await currentUser(env2, request);
  if (!user) throw httpError2(401, "Authentication required");
  return user;
}
__name(requireUser, "requireUser");
var BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function generateTotpSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  let bits = "";
  for (const byte of bytes) bits += byte.toString(2).padStart(8, "0");
  let secret = "";
  for (let index = 0; index + 5 <= bits.length; index += 5) {
    secret += BASE32[parseInt(bits.slice(index, index + 5), 2)];
  }
  return secret;
}
__name(generateTotpSecret, "generateTotpSecret");
function decodeBase32(secret) {
  let bits = "";
  for (const char of String(secret).toUpperCase().replace(/=+$/, "")) {
    const value = BASE32.indexOf(char);
    if (value < 0) continue;
    bits += value.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(parseInt(bits.slice(index, index + 8), 2));
  }
  return new Uint8Array(bytes);
}
__name(decodeBase32, "decodeBase32");
async function totpCode(secret, offset = 0) {
  const counter = Math.floor(Date.now() / 1e3 / 30) + offset;
  const buffer = new ArrayBuffer(8);
  new DataView(buffer).setUint32(4, counter);
  const key = await crypto.subtle.importKey("raw", decodeBase32(secret), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, buffer));
  const offsetIndex = signature[19] & 15;
  const binary = (signature[offsetIndex] & 127) << 24 | signature[offsetIndex + 1] << 16 | signature[offsetIndex + 2] << 8 | signature[offsetIndex + 3];
  return String(binary % 1e6).padStart(6, "0");
}
__name(totpCode, "totpCode");
async function verifyTotp(secret, code) {
  const candidate = String(code || "").replace(/\s/g, "");
  if (!secret || !/^\d{6}$/.test(candidate)) return false;
  for (const offset of [0, -1, 1]) {
    if (await totpCode(secret, offset) === candidate) return true;
  }
  return false;
}
__name(verifyTotp, "verifyTotp");
function totpUri(secret, email) {
  const label = encodeURIComponent(`SDL:${email || "account"}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=SDL&algorithm=SHA-1&digits=6&period=30`;
}
__name(totpUri, "totpUri");
async function hashRecoveryCode(code) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(String(code).toUpperCase()));
  return toBase64Url(digest);
}
__name(hashRecoveryCode, "hashRecoveryCode");
function randomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}
__name(randomCode, "randomCode");

// src/db-client.js
function options(sort, limit) {
  if (sort && typeof sort === "object") return { sort: sort.sort, limit: sort.limit ?? limit };
  return { sort, limit };
}
__name(options, "options");
function entityApi(store, name) {
  return {
    list: /* @__PURE__ */ __name((sort, limit) => store.list(name, sort, limit), "list"),
    filter: /* @__PURE__ */ __name((query, sort, limit) => {
      const resolved = options(sort, limit);
      return store.filter(name, query, resolved.sort, resolved.limit);
    }, "filter"),
    get: /* @__PURE__ */ __name((id) => store.get(name, id), "get"),
    create: /* @__PURE__ */ __name((data) => store.create(name, data), "create"),
    update: /* @__PURE__ */ __name((id, data) => store.update(name, id, data), "update"),
    updateMany: /* @__PURE__ */ __name((query, patch) => store.updateMany(name, query, patch), "updateMany"),
    bulkCreate: /* @__PURE__ */ __name((items) => store.bulkCreate(name, items), "bulkCreate"),
    bulkUpdate: /* @__PURE__ */ __name((items) => store.bulkUpdate(name, items), "bulkUpdate"),
    delete: /* @__PURE__ */ __name((id) => store.delete(name, id), "delete"),
    deleteMany: /* @__PURE__ */ __name((query) => store.deleteMany(name, query), "deleteMany"),
    count: /* @__PURE__ */ __name((query) => store.count(name, query), "count"),
    aggregate: /* @__PURE__ */ __name((options2) => store.aggregate(name, options2), "aggregate")
  };
}
__name(entityApi, "entityApi");
var entityProxy = /* @__PURE__ */ __name((store) => new Proxy({}, { get: /* @__PURE__ */ __name((_target, name) => entityApi(store, String(name)), "get") }), "entityProxy");
async function getConnection(env2, provider) {
  const config2 = {
    gmail: {
      clientId: env2.GMAIL_CLIENT_ID,
      clientSecret: env2.GMAIL_CLIENT_SECRET,
      refreshToken: env2.GMAIL_REFRESH_TOKEN
    },
    googlesheets: {
      clientId: env2.GOOGLE_CLIENT_ID || env2.GMAIL_CLIENT_ID,
      clientSecret: env2.GOOGLE_CLIENT_SECRET || env2.GMAIL_CLIENT_SECRET,
      refreshToken: env2.GOOGLE_SHEETS_REFRESH_TOKEN || env2.GMAIL_REFRESH_TOKEN
    }
  }[provider];
  if (!config2?.refreshToken) {
    throw httpError2(503, `${provider} is not connected. Add the ${provider.toUpperCase()} OAuth secrets to the Worker.`);
  }
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config2.clientId,
      client_secret: config2.clientSecret,
      refresh_token: config2.refreshToken,
      grant_type: "refresh_token"
    })
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw httpError2(502, `${provider} authorization failed. Reconnect the Google account.`);
  }
  return { accessToken: data.access_token };
}
__name(getConnection, "getConnection");
function createDbClient(env2, { user = null, serviceRole = false } = {}) {
  const store = new EntityStore(env2.DB, user, { serviceRole });
  return {
    env: env2,
    entities: entityProxy(store),
    asServiceRole: {
      entities: entityProxy(new EntityStore(env2.DB, user, { serviceRole: true })),
      connectors: { getConnection: /* @__PURE__ */ __name((provider) => getConnection(env2, provider), "getConnection") }
    },
    auth: {
      me: /* @__PURE__ */ __name(async () => user, "me"),
      isAuthenticated: /* @__PURE__ */ __name(async () => Boolean(user), "isAuthenticated")
    },
    integrations: {
      Core: {
        UploadFile: /* @__PURE__ */ __name(async ({ file }) => {
          if (!file || !env2.FILES) throw httpError2(503, "File storage is not configured");
          const key = `${crypto.randomUUID()}-${String(file.name || "upload").replace(/[^\w.-]+/g, "_")}`;
          await env2.FILES.put(key, file.stream(), {
            httpMetadata: { contentType: file.type || "application/octet-stream" }
          });
          return { file_url: `${env2.APP_BASE_URL}/api/files/${key}`, file_name: file.name };
        }, "UploadFile")
      }
    }
  };
}
__name(createDbClient, "createDbClient");

// src/mailer.js
async function sendMail(env2, { to, subject, html }) {
  if (!env2.RESEND_API_KEY) {
    console.log(`[mail:skipped] to=${to} subject=${subject}`);
    return { sent: false, reason: "RESEND_API_KEY is not configured" };
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env2.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ from: env2.MAIL_FROM || "SDL <no-reply@shubhdhanlakshmi.com>", to, subject, html })
  });
  if (!response.ok) throw new Error(`Email provider error: ${response.status}`);
  return { sent: true };
}
__name(sendMail, "sendMail");

// src/functions/exportToGoogleSheet.js
var exportToGoogleSheet_exports = {};
__export(exportToGoogleSheet_exports, {
  default: () => exportToGoogleSheet_default
});
async function exportToGoogleSheet_default(req, ctx) {
  const db = ctx.db;
  try {
    const user = await db.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const { accessToken } = await db.asServiceRole.connectors.getConnection("googlesheets");
    const loans = await db.asServiceRole.entities.LoanApplication.list("-created_date", 1e3);
    const statusLabels = {
      pending_disbursement: "Pending Disbursement",
      disbursed: "Active",
      pending_verification: "Payment Under Verification",
      repaid: "Repaid",
      overdue: "Overdue",
      rejected: "Rejected"
    };
    const formatDate = /* @__PURE__ */ __name((d) => d ? new Date(d).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }) : "", "formatDate");
    const dateStr = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
    const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        properties: { title: `SDL Loan Export \u2014 ${dateStr}` }
      })
    });
    if (!createRes.ok) {
      const err = await createRes.text();
      return Response.json({ error: `Failed to create spreadsheet: ${err}` }, { status: 500 });
    }
    const sheetData = await createRes.json();
    const spreadsheetId = sheetData.spreadsheetId;
    const spreadsheetUrl = sheetData.spreadsheetUrl;
    const headers = [
      "Loan ID",
      "User Name",
      "Mobile",
      "Amount (Rs)",
      "Charges (Rs)",
      "Repayment Amount (Rs)",
      "Due Date",
      "Status",
      "Loan Date",
      "Disbursed Date",
      "Repaid Date",
      "UPI ID",
      "Rejection Reason"
    ];
    const rows = loans.map((l) => [
      l.loan_id || "",
      l.user_name || "",
      l.user_mobile || "",
      l.amount || 0,
      l.interest_amount || 0,
      l.repayment_amount || 0,
      l.due_date || "",
      statusLabels[l.status] || l.status || "",
      formatDate(l.loan_date || l.created_date),
      formatDate(l.disbursed_date),
      formatDate(l.repaid_date),
      l.user_upi_id || "",
      l.admin_rejection_reason || ""
    ]);
    const writeRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=RAW`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ values: [headers, ...rows] })
      }
    );
    if (!writeRes.ok) {
      const err = await writeRes.text();
      return Response.json({ error: `Failed to write data: ${err}` }, { status: 500 });
    }
    return Response.json({
      success: true,
      url: spreadsheetUrl,
      count: loans.length
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
__name(exportToGoogleSheet_default, "default");

// src/functions/generateLandingPage.js
var generateLandingPage_exports = {};
__export(generateLandingPage_exports, {
  default: () => generateLandingPage_default
});
var LOGIN_URL = "https://shubhdhanlakshmi-beta-version.db.app/login";
var REGISTER_URL = "https://shubhdhanlakshmi-beta-version.db.app/register";
var CANONICAL_URL = "https://shubhdhanlakshmi.com";
function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
__name(escapeHtml, "escapeHtml");
function textToHtml(str) {
  if (!str) return "";
  return escapeHtml(str).replace(/\n/g, "<br>");
}
__name(textToHtml, "textToHtml");
async function generateLandingPage_default(req, ctx) {
  const db = ctx.db;
  try {
    const user = await db.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const settingsList = await db.asServiceRole.entities.AppSettings.list();
    const s = settingsList[0] || {};
    const termsHtml = textToHtml(s.terms_conditions) || defaultTerms();
    const privacyHtml = textToHtml(s.privacy_policy) || defaultPrivacy();
    const aboutHtml = textToHtml(s.about_us) || defaultAbout();
    const lenderName = escapeHtml(s.lender_name || "Subrato Das");
    const lenderEmail = escapeHtml(s.lender_email || "shubhdhanlakshmifund@gmail.com");
    const lenderAddress = textToHtml(s.lender_address) || "Indian Doorstep, Gali no. 7, Block M, Near sector 59 metro station, Mamura, Sector 59, Gautam Buddha Nagar, Noida, Uttar Pradesh - 201301";
    const interestRate = s.interest_rate ?? 2;
    const portalCharge = s.portal_charge_percentage ?? 8;
    const processingFee = s.processing_fee_percentage ?? 9;
    const savingsPct = s.savings_percentage ?? 1;
    const referralPct = s.referral_percentage ?? 1;
    const html = buildHtml({
      termsHtml,
      privacyHtml,
      aboutHtml,
      lenderName,
      lenderEmail,
      lenderAddress,
      interestRate,
      portalCharge,
      processingFee,
      savingsPct,
      referralPct
    });
    return Response.json({
      html,
      filename: "sdl-landing-page.html"
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
__name(generateLandingPage_default, "default");
function defaultTerms() {
  return `By using the SDL (Shubh Dhan Lakshmi) platform, you agree to the following terms and conditions:<br><br>
 1. <strong>Loan Eligibility:</strong> You must be a salaried individual with a valid UPI ID and completed KYC verification.<br><br>
 2. <strong>Loan Amount:</strong> Loan amounts are determined based on your salary profile and repayment history, subject to admin approval.<br><br>
 3. <strong>Repayment:</strong> The full repayment amount (principal + charges) is due on your next salary date. Late payments incur a daily overdue charge.<br><br>
 4. <strong>Charges:</strong> Interest, portal charge, and processing fee are disclosed upfront before loan disbursement.<br><br>
 5. <strong>Savings:</strong> A percentage of your loan amount is credited back to your SDL wallet upon timely repayment.<br><br>
 6. <strong>Referrals:</strong> Referral earnings are credited only after the referred user's loan is repaid.<br><br>
 7. <strong>KYC:</strong> Providing accurate personal and identity information is mandatory. False information may result in loan rejection and account suspension.<br><br>
 8. <strong>Account Suspension:</strong> SDL reserves the right to suspend accounts for fraudulent activity, repeated defaults, or policy violations.`;
}
__name(defaultTerms, "defaultTerms");
function defaultPrivacy() {
  return `SDL (Shubh Dhan Lakshmi) is committed to protecting your personal information:<br><br>
 1. <strong>Data Collection:</strong> We collect your name, mobile number, PAN, address, UPI ID, and salary information for loan processing and KYC verification.<br><br>
 2. <strong>Data Usage:</strong> Your data is used solely for loan approval, disbursement, repayment tracking, and communication. We do not sell your data to third parties.<br><br>
 3. <strong>Data Security:</strong> All personal and financial data is encrypted and stored securely. Access is restricted to authorized personnel only.<br><br>
 4. <strong>Communication:</strong> You may receive WhatsApp messages and emails regarding loan status, repayment reminders, and platform updates.<br><br>
 5. <strong>Your Rights:</strong> You may request data deletion or account closure at any time by contacting our support team.<br><br>
 6. <strong>Third-Party Services:</strong> UPI payments are processed through your chosen payment app. We do not store your payment app credentials.`;
}
__name(defaultPrivacy, "defaultPrivacy");
function defaultAbout() {
  return `SDL (Shubh Dhan Lakshmi) is a friendly loan platform designed for India that allows users to take short-term salary-backed loans and repay them on their next salary date. Our mission is to provide quick, transparent, and hassle-free financial support to salaried individuals, with a focus on trust, speed, and customer satisfaction. With SDL, you get instant UPI disbursement, clear charges upfront, and a rewarding savings and referral program.`;
}
__name(defaultAbout, "defaultAbout");
function buildHtml(opts) {
  const {
    termsHtml,
    privacyHtml,
    aboutHtml,
    lenderName,
    lenderEmail,
    lenderAddress,
    interestRate,
    portalCharge,
    processingFee,
    savingsPct,
    referralPct
  } = opts;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">

<!-- Primary Meta Tags -->
<title>SDL \u2014 Shubh Dhan Lakshmi | Instant Salary-Backed Loans up to &#8377;20,000</title>
<meta name="title" content="SDL \u2014 Shubh Dhan Lakshmi | Instant Salary-Backed Loans up to &#8377;20,000">
<meta name="description" content="SDL (Shubh Dhan Lakshmi) \u2014 Get instant salary-backed loans up to &#8377;20,000 with UPI disbursement. Apply in minutes, repay on your next salary date. No hidden charges.">
<meta name="keywords" content="salary loan, instant loan, UPI loan, short term loan, salary advance, SDL, Shubh Dhan Lakshmi, quick loan India, personal loan, salaried loan">
<meta name="author" content="SDL (Shubh Dhan Lakshmi)">
<meta name="robots" content="index, follow">
<meta name="googlebot" content="index, follow">
<link rel="canonical" href="${CANONICAL_URL}/">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${CANONICAL_URL}/">
<meta property="og:title" content="SDL \u2014 Shubh Dhan Lakshmi | Instant Salary-Backed Loans">
<meta property="og:description" content="Get instant salary-backed loans up to &#8377;20,000 with UPI disbursement. Apply in minutes, repay on your next salary date.">
<meta property="og:site_name" content="SDL \u2014 Shubh Dhan Lakshmi">
<meta property="og:locale" content="en_IN">
<meta property="og:image" content="logo.png">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="${CANONICAL_URL}/">
<meta name="twitter:title" content="SDL \u2014 Shubh Dhan Lakshmi | Instant Salary-Backed Loans">
<meta name="twitter:description" content="Get instant salary-backed loans up to &#8377;20,000 with UPI disbursement. Apply in minutes, repay on your next salary date.">
<meta name="twitter:image" content="logo.png">

<!-- Mobile / PWA -->
<meta name="theme-color" content="#FF4B2B">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="SDL">
<meta name="mobile-web-app-capable" content="yes">
<meta name="application-name" content="SDL \u2014 Shubh Dhan Lakshmi">
<meta name="format-detection" content="telephone=yes">

<!-- Favicon & Logo (replace logo.png with your own logo file) -->
<link rel="icon" type="image/png" href="logo.png">
<link rel="apple-touch-icon" href="logo.png">
<link rel="shortcut icon" href="logo.png">

<!-- Structured Data for SEO -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "SDL \u2014 Shubh Dhan Lakshmi",
  "description": "Instant salary-backed loans with UPI disbursement for salaried individuals in India.",
  "url": "${CANONICAL_URL}",
  "logo": "${CANONICAL_URL}/logo.png",
  "image": "${CANONICAL_URL}/logo.png",
  "telephone": "+91-9310601973",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Gali no. 7, Block M, Near sector 59 metro station, Mamura, Sector 59",
    "addressLocality": "Gautam Buddha Nagar, Noida",
    "addressRegion": "Uttar Pradesh",
    "postalCode": "201301",
    "addressCountry": "IN"
  },
  "areaServed": "IN",
  "serviceType": "Salary-Backed Short-Term Loans",
  "provider": {
    "@type": "Organization",
    "name": "SDL \u2014 Shubh Dhan Lakshmi",
    "foundingDate": "2025"
  },
  "offers": {
    "@type": "Offer",
    "description": "Salary-backed loans up to &#8377;20,000 with UPI disbursement",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  }
}
<\/script>

<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--red:#FF4B2B;--orange:#FF8C42;--gold:#F5C67E;--dark:#2D1B12;--cream:#FFF8F3;--white:#fff;--shadow:0 20px 60px rgba(255,75,43,.15)}
html{scroll-behavior:smooth}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:var(--cream);color:var(--dark);overflow-x:hidden;line-height:1.6;position:relative;min-height:100vh}
section{padding:80px 20px;position:relative}
.container{max-width:1100px;margin:0 auto}
h1{font-size:clamp(2.2rem,6vw,4rem);font-weight:800;line-height:1.1;letter-spacing:-1px}
h2{font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;letter-spacing:-.5px;margin-bottom:16px}
h3{font-size:1.2rem;font-weight:700}
p{color:#6B5547}
.gradient-text{background:linear-gradient(135deg,var(--red),var(--orange));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;border-radius:50px;font-size:1rem;font-weight:700;text-decoration:none;transition:all .3s cubic-bezier(.4,0,.2,1);cursor:pointer;border:none}
.btn-primary{background:linear-gradient(135deg,var(--red),var(--orange));color:#fff;box-shadow:0 10px 30px rgba(255,75,43,.4)}
.btn-primary:hover{transform:translateY(-3px);box-shadow:0 15px 40px rgba(255,75,43,.5)}
.btn-outline{background:rgba(255,255,255,.7);backdrop-filter:blur(10px);color:var(--dark);border:2px solid rgba(255,75,43,.2)}
.btn-outline:hover{border-color:var(--orange);transform:translateY(-3px)}

/* Mouse-track orange blur background */
.bg-blur{position:fixed;top:0;left:0;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(255,140,66,.18) 0%,rgba(255,75,43,.08) 40%,transparent 70%);pointer-events:none;z-index:0;transform:translate(-50%,-50%);transition:transform .15s ease-out;filter:blur(40px);will-change:transform}
.bg-blur2{position:fixed;top:0;left:0;width:350px;height:350px;border-radius:50%;background:radial-gradient(circle,rgba(245,198,126,.15) 0%,rgba(255,140,66,.06) 40%,transparent 70%);pointer-events:none;z-index:0;transform:translate(-50%,-50%);transition:transform .25s ease-out;filter:blur(35px);will-change:transform}
body > *:not(.bg-blur):not(.bg-blur2){position:relative;z-index:1}

/* Navigation */
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 20px;transition:all .3s}
nav.scrolled{background:rgba(255,248,243,.85);backdrop-filter:blur(20px);box-shadow:0 4px 30px rgba(0,0,0,.08);padding:10px 20px}
.nav-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
.nav-logo-img{width:40px;height:40px;border-radius:12px;object-fit:cover;display:none}
.nav-logo-img.has-logo{display:block}
.nav-logo-fallback{display:flex;align-items:center}
.nav-logo-text{font-size:1.3rem;font-weight:800;color:var(--dark)}
.nav-logo-text span{color:var(--orange)}
.nav-links{display:flex;gap:28px;align-items:center}
.nav-links a{color:var(--dark);text-decoration:none;font-weight:600;font-size:.92rem;transition:color .2s;cursor:pointer}
.nav-links a:hover{color:var(--orange)}
.nav-cta{display:flex;gap:10px}
.nav-cta .btn{padding:10px 22px;font-size:.88rem}
.menu-toggle{display:none;background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--dark);z-index:101}
.menu-toggle.active{color:var(--red)}

/* Mobile slide-in menu */
.mobile-menu{position:fixed;top:0;right:0;width:280px;max-width:80vw;height:100vh;background:#fff;box-shadow:-10px 0 40px rgba(0,0,0,.15);z-index:200;transform:translateX(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;padding:80px 28px 28px;overflow-y:auto}
.mobile-menu.open{transform:translateX(0)}
.mobile-menu-overlay{position:fixed;inset:0;background:rgba(45,27,18,.5);backdrop-filter:blur(4px);z-index:199;opacity:0;pointer-events:none;transition:opacity .3s ease}
.mobile-menu-overlay.open{opacity:1;pointer-events:auto}
.mobile-menu a{color:var(--dark);text-decoration:none;font-weight:600;font-size:1.05rem;padding:14px 0;border-bottom:1px solid rgba(255,140,66,.1);transition:color .2s,padding-left .2s;cursor:pointer;display:block}
.mobile-menu a:hover{color:var(--orange);padding-left:8px}
.mobile-menu .mobile-cta{display:flex;flex-direction:column;gap:12px;margin-top:24px}
.mobile-menu .mobile-cta .btn{width:100%;justify-content:center}
.mobile-close{position:absolute;top:20px;right:20px;width:40px;height:40px;border-radius:50%;background:rgba(255,140,66,.1);border:none;font-size:1.4rem;cursor:pointer;color:var(--dark);display:flex;align-items:center;justify-content:center;transition:all .2s}
.mobile-close:hover{background:rgba(255,75,43,.15);color:var(--red);transform:rotate(90deg)}
@media(max-width:768px){.nav-links{display:none}.menu-toggle{display:block}.nav-cta{display:none}}

/* Hero */
.hero{min-height:100vh;display:flex;align-items:center;padding-top:100px;background:radial-gradient(ellipse at top right,rgba(255,140,66,.12),transparent 50%),radial-gradient(ellipse at bottom left,rgba(255,75,43,.08),transparent 50%),var(--cream)}
.hero-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:40px;align-items:center}
@media(max-width:768px){.hero-grid{grid-template-columns:1fr;text-align:center}}
.hero h1{margin-bottom:20px}
.hero-sub{font-size:1.15rem;margin-bottom:32px;max-width:480px}
@media(max-width:768px){.hero-sub{margin:0 auto 32px}}
.hero-cta{display:flex;gap:14px;flex-wrap:wrap}
@media(max-width:768px){.hero-cta{justify-content:center}}
.hero-stats{display:flex;gap:32px;margin-top:40px}
@media(max-width:768px){.hero-stats{justify-content:center}}
.stat{text-align:left}
@media(max-width:768px){.text-center-mobile{text-align:center}}
.stat-num{font-size:1.8rem;font-weight:800}
.stat-label{font-size:.78rem;color:#9B8B7F;font-weight:500}

/* 3D Limit Card with mouse track */
.hero-art{position:relative;height:460px;perspective:1200px;display:flex;align-items:center;justify-content:center}
@media(max-width:768px){.hero-art{height:380px;margin-top:20px}}
.limit-card-wrap{position:relative;width:340px;max-width:90vw;animation:floatCard 5s ease-in-out infinite}
@keyframes floatCard{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
.limit-card{width:100%;aspect-ratio:1.6/1;border-radius:24px;background:linear-gradient(135deg,#FF4B2B 0%,#FF8C42 50%,#F5C67E 100%);box-shadow:0 30px 80px rgba(255,75,43,.4),inset 0 1px 0 rgba(255,255,255,.3);padding:28px;color:#fff;display:flex;flex-direction:column;justify-content:space-between;transform-style:preserve-3d;transition:transform .15s ease-out;position:relative;overflow:hidden;cursor:pointer}
.limit-card::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle,rgba(255,255,255,.15) 0%,transparent 50%);pointer-events:none}
.limit-card-shine{position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.25) 50%,transparent 60%);pointer-events:none;transition:opacity .2s}
.limit-card-top{display:flex;justify-content:space-between;align-items:flex-start;position:relative;z-index:2}
.limit-card-chip{width:40px;height:30px;border-radius:6px;background:linear-gradient(135deg,#F5C67E,#FFD700);box-shadow:inset 0 1px 2px rgba(0,0,0,.2)}
.limit-card-label{font-size:.75rem;font-weight:600;opacity:.9;text-transform:uppercase;letter-spacing:1px;position:relative;z-index:2}
.limit-card-amount{font-size:2.8rem;font-weight:800;letter-spacing:-1px;position:relative;z-index:2;line-height:1}
.limit-card-amount span{font-size:1.4rem;vertical-align:top}
.limit-card-sub{font-size:.85rem;opacity:.85;margin-top:6px;position:relative;z-index:2}
.limit-card-bottom{display:flex;justify-content:space-between;align-items:flex-end;position:relative;z-index:2}
.limit-card-brand{font-size:1rem;font-weight:800;letter-spacing:.5px}
.limit-card-badge{background:rgba(255,255,255,.2);backdrop-filter:blur(10px);padding:6px 14px;border-radius:50px;font-size:.72rem;font-weight:600}
.art-orb{position:absolute;border-radius:50%;filter:blur(2px);animation:float 6s ease-in-out infinite;pointer-events:none}
.orb1{width:60px;height:60px;background:var(--gold);top:10%;right:5%;animation-delay:1s;box-shadow:0 10px 30px rgba(245,198,126,.5)}
.orb2{width:40px;height:40px;background:var(--orange);bottom:10%;left:0;animation-delay:2s;box-shadow:0 10px 25px rgba(255,140,66,.4)}
.orb3{width:30px;height:30px;background:var(--red);top:20%;left:10%;animation-delay:.5s;opacity:.7}
.coin{position:absolute;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--orange));display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;color:#fff;box-shadow:0 15px 40px rgba(245,198,126,.4);animation:floatCoin 5s ease-in-out infinite;pointer-events:none}
.coin1{top:5%;left:0;animation-delay:0s}
.coin2{bottom:5%;right:0;width:45px;height:45px;font-size:1.2rem;animation-delay:1.5s}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-25px)}}
@keyframes floatCoin{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-20px) rotate(10deg)}}

/* Section headers */
.sec-header{text-align:center;margin-bottom:50px}
.sec-header p{max-width:560px;margin:0 auto}

/* Features */
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
.feature-card{background:#fff;border-radius:24px;padding:36px 28px;box-shadow:0 10px 40px rgba(45,27,18,.06);transition:all .4s cubic-bezier(.4,0,.2,1);transform-style:preserve-3d;cursor:pointer;border:1px solid rgba(255,140,66,.08)}
.feature-card:hover{transform:translateY(-8px) rotateX(2deg);box-shadow:0 25px 60px rgba(255,75,43,.15);border-color:rgba(255,140,66,.3)}
.feature-icon{width:64px;height:64px;border-radius:18px;background:linear-gradient(135deg,var(--red),var(--orange));display:flex;align-items:center;justify-content:center;margin-bottom:20px;box-shadow:0 10px 25px rgba(255,75,43,.25)}
.feature-icon svg{width:30px;height:30px;fill:#fff}
.feature-card h3{margin-bottom:10px;font-size:1.15rem}
.feature-card p{font-size:.92rem;line-height:1.5}

/* How it works */
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;position:relative}
@media(max-width:768px){.steps{grid-template-columns:1fr}}
.step{text-align:center;position:relative}
.step-num{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--red),var(--orange));color:#fff;font-size:1.4rem;font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;box-shadow:0 10px 25px rgba(255,75,43,.3);position:relative;z-index:2}
.step h3{margin-bottom:10px}
.step p{font-size:.9rem;max-width:240px;margin:0 auto}
.steps-line{position:absolute;top:28px;left:16%;right:16%;height:3px;background:linear-gradient(90deg,transparent,var(--orange),var(--orange),transparent);z-index:1}
@media(max-width:768px){.steps-line{display:none}}

/* About */
.about{background:linear-gradient(135deg,#2D1B12,#3D2818);color:#fff;border-radius:32px;padding:60px 40px;overflow:hidden;position:relative}
.about::before{content:'';position:absolute;top:-50%;right:-20%;width:400px;height:400px;background:radial-gradient(circle,rgba(255,140,66,.2),transparent 70%);border-radius:50%}
.about h2{color:#fff;position:relative}
.about p{color:rgba(255,255,255,.8);font-size:1.05rem;position:relative;max-width:680px;margin-top:16px}
.about-stats{display:flex;gap:40px;margin-top:36px;flex-wrap:wrap;position:relative}
.about-stat-num{font-size:2rem;font-weight:800;background:linear-gradient(135deg,var(--gold),var(--orange));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.about-stat-label{font-size:.85rem;color:rgba(255,255,255,.6)}

/* FAQ */
.faq-list{max-width:760px;margin:0 auto}
.faq-item{background:#fff;border-radius:16px;margin-bottom:14px;overflow:hidden;box-shadow:0 4px 20px rgba(45,27,18,.04);transition:box-shadow .3s}
.faq-item.open{box-shadow:0 8px 30px rgba(255,75,43,.12)}
.faq-q{padding:22px 26px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;font-weight:700;font-size:1rem;color:var(--dark);transition:color .2s}
.faq-q:hover{color:var(--orange)}
.faq-icon{width:28px;height:28px;border-radius:50%;background:rgba(255,140,66,.12);display:flex;align-items:center;justify-content:center;transition:all .3s;flex-shrink:0;margin-left:12px}
.faq-item.open .faq-icon{background:linear-gradient(135deg,var(--red),var(--orange));color:#fff;transform:rotate(45deg)}
.faq-icon span{font-size:1.2rem;line-height:1}
.faq-a{max-height:0;overflow:hidden;transition:max-height .4s ease,padding .4s ease}
.faq-item.open .faq-a{max-height:400px;padding:0 26px 22px}
.faq-a p{font-size:.92rem;color:#6B5547}

/* Legal links section */
.legal-links{text-align:center}
.legal-links-wrap{display:inline-flex;gap:16px;flex-wrap:wrap;justify-content:center}
.legal-link{display:inline-flex;align-items:center;gap:8px;background:#fff;border:2px solid rgba(255,140,66,.15);border-radius:50px;padding:14px 32px;font-size:1rem;font-weight:700;color:var(--dark);text-decoration:none;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);box-shadow:0 4px 20px rgba(45,27,18,.04)}
.legal-link:hover{border-color:var(--orange);color:var(--orange);transform:translateY(-3px);box-shadow:0 10px 30px rgba(255,75,43,.15)}
.legal-link svg{width:18px;height:18px;fill:currentColor}

/* Legal modal */
.modal-overlay{position:fixed;inset:0;background:rgba(45,27,18,.6);backdrop-filter:blur(8px);z-index:200;display:none;align-items:flex-start;justify-content:center;padding:40px 20px;overflow-y:auto;opacity:0;transition:opacity .3s ease}
.modal-overlay.open{display:flex;opacity:1}
.modal{background:#fff;border-radius:24px;max-width:700px;width:100%;padding:40px;box-shadow:0 30px 80px rgba(0,0,0,.3);transform:translateY(30px);transition:transform .3s cubic-bezier(.34,1.56,.64,1);margin:auto}
.modal-overlay.open .modal{transform:translateY(0)}
.modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid rgba(255,140,66,.2)}
.modal-header h2{margin:0}
.modal-close{width:40px;height:40px;border-radius:50%;background:rgba(255,140,66,.1);border:none;font-size:1.3rem;cursor:pointer;color:var(--dark);transition:all .2s;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.modal-close:hover{background:rgba(255,75,43,.15);color:var(--red);transform:rotate(90deg)}
.modal-content{font-size:.95rem;line-height:1.8;color:#5A4538;max-height:60vh;overflow-y:auto;padding-right:8px}
.modal-content strong{color:var(--dark)}
.modal-content::-webkit-scrollbar{width:6px}
.modal-content::-webkit-scrollbar-thumb{background:rgba(255,140,66,.3);border-radius:10px}

/* Footer */
footer{background:#2D1B12;color:#fff;padding:60px 20px 30px}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;max-width:1100px;margin:0 auto}
@media(max-width:768px){.footer-grid{grid-template-columns:1fr 1fr}}
.footer-logo{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.footer-logo-img{width:40px;height:40px;border-radius:12px;object-fit:cover;display:none}
.footer-logo-img.has-logo{display:block}
.footer-logo-fallback{display:flex;align-items:center}
.footer-brand{font-size:1.5rem;font-weight:800;color:#fff}
.footer-brand span{color:var(--orange)}
.footer-col h4{color:#fff;font-size:1rem;margin-bottom:16px;font-weight:700}
.footer-col a{display:block;color:#fff;text-decoration:none;font-size:.88rem;margin-bottom:10px;transition:color .2s,padding-left .2s;cursor:pointer}
.footer-col a:hover{color:var(--orange);padding-left:4px}
.footer-desc{color:#fff;font-size:.88rem;max-width:300px;opacity:.85}
.footer-bottom{text-align:center;padding-top:30px;margin-top:40px;border-top:1px solid rgba(255,255,255,.15);font-size:.82rem;max-width:1100px;margin-left:auto;margin-right:auto;color:#fff}

/* Scroll animations */
.reveal{opacity:0;transform:translateY(40px);transition:opacity .7s ease,transform .7s ease}
.reveal.active{opacity:1;transform:translateY(0)}
.reveal-left{opacity:0;transform:translateX(-50px);transition:opacity .7s ease,transform .7s ease}
.reveal-left.active{opacity:1;transform:translateX(0)}
.reveal-right{opacity:0;transform:translateX(50px);transition:opacity .7s ease,transform .7s ease}
.reveal-right.active{opacity:1;transform:translateX(0)}
.reveal-scale{opacity:0;transform:scale(.9);transition:opacity .7s ease,transform .7s ease}
.reveal-scale.active{opacity:1;transform:scale(1)}

/* 3D tilt on touch */
.tilt-card{transition:transform .2s ease-out;transform-style:preserve-3d}

/* Trending animations */
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
.shimmer-text{background:linear-gradient(90deg,var(--red),var(--orange),var(--gold),var(--orange),var(--red));background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4s linear infinite}

@keyframes glowPulse{0%,100%{box-shadow:0 30px 80px rgba(255,75,43,.4),inset 0 1px 0 rgba(255,255,255,.3)}50%{box-shadow:0 30px 100px rgba(255,75,43,.55),inset 0 1px 0 rgba(255,255,255,.3)}}
.limit-card{animation:floatCard 5s ease-in-out infinite,glowPulse 3s ease-in-out infinite}

@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.gradient-border{position:relative;background:#fff;border-radius:24px;overflow:hidden}
.gradient-border::before{content:'';position:absolute;inset:0;padding:2px;background:linear-gradient(135deg,var(--red),var(--orange),var(--gold),var(--orange));background-size:300% 300%;animation:gradientShift 4s ease infinite;border-radius:24px;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:opacity .3s}
.feature-card:hover .gradient-border::before{opacity:1}

@keyframes bounceIn{0%{opacity:0;transform:scale(.3) translateY(40px)}60%{opacity:1;transform:scale(1.05) translateY(-5px)}100%{opacity:1;transform:scale(1) translateY(0)}}
.bounce-in{animation:bounceIn .7s cubic-bezier(.34,1.56,.64,1)}

@keyframes slideUpFade{0%{opacity:0;transform:translateY(30px)}100%{opacity:1;transform:translateY(0)}}

/* Scroll progress bar */
.scroll-progress{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--red),var(--orange),var(--gold));z-index:150;width:0;transition:width .1s ease;box-shadow:0 0 10px rgba(255,75,43,.5)}

/* Floating action pulse */
@keyframes pulseRing{0%{box-shadow:0 0 0 0 rgba(255,75,43,.4)}70%{box-shadow:0 0 0 20px rgba(255,75,43,0)}100%{box-shadow:0 0 0 0 rgba(255,75,43,0)}}
.pulse-btn{animation:pulseRing 2s infinite}

/* Counter glow */
@keyframes countGlow{0%,100%{text-shadow:0 0 0 rgba(255,75,43,0)}50%{text-shadow:0 0 20px rgba(255,140,66,.4)}}
.stat-num{animation:countGlow 3s ease-in-out infinite}

/* Marquee for trust badges */
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.trust-marquee{overflow:hidden;white-space:nowrap;padding:20px 0;background:rgba(255,140,66,.04);border-radius:16px}
.trust-marquee-inner{display:inline-flex;gap:40px;animation:marquee 20s linear infinite}
.trust-badge{display:inline-flex;align-items:center;gap:8px;font-size:.9rem;font-weight:600;color:var(--dark);opacity:.7}
.trust-badge svg{width:18px;height:18px;fill:var(--orange)}

/* Magnetic hover for buttons */
.btn-magnetic{transition:transform .2s cubic-bezier(.4,0,.2,1)}

/* Section divider wave */
.wave-divider{height:60px;width:100%;overflow:hidden;line-height:0}
.wave-divider svg{width:100%;height:100%;display:block}
</style>
</head>
<body>

<!-- Mouse-track orange blur background -->
<div class="bg-blur" id="bgBlur"></div>
<div class="bg-blur2" id="bgBlur2"></div>
<!-- Scroll progress bar -->
<div class="scroll-progress" id="scrollProgress"></div>

<!-- Navigation -->
<nav id="nav">
  <div class="nav-inner">
    <a href="#hero" class="nav-logo">
      <img src="logo.png" alt="SDL Logo" class="nav-logo-img" id="navLogoImg" onerror="this.classList.remove('has-logo'); this.style.display='none'">
      <span class="nav-logo-fallback" id="navLogoFallback">
        <svg width="40" height="40" viewBox="0 0 100 100"><defs><linearGradient id="navg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FF4B2B"/><stop offset="100%" stop-color="#FF8C42"/></linearGradient></defs><circle cx="50" cy="50" r="46" fill="url(#navg)"/><path d="M50 22 C40 35 30 40 30 55 C30 68 40 78 50 78 C60 78 70 68 70 55 C70 40 60 35 50 22 Z" fill="#fff" opacity=".9"/><circle cx="50" cy="55" r="8" fill="#FF4B2B"/><text x="50" y="94" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold" font-family="Arial">SDL</text></svg>
      </span>
      <span class="nav-logo-text">Shubh <span>Dhan Lakshmi</span></span>
    </a>
    <div class="nav-links">
      <a href="#features">Features</a>
      <a href="#how">How It Works</a>
      <a href="#about">About</a>
      <a href="#faq">FAQ</a>
      <a onclick="openModal('terms')">Terms</a>
      <a onclick="openModal('privacy')">Privacy</a>
    </div>
    <div class="nav-cta">
      <a href="${LOGIN_URL}" class="btn btn-outline">Login</a>
      <a href="${REGISTER_URL}" class="btn btn-primary">Create Account</a>
    </div>
    <button class="menu-toggle" id="menuToggle" onclick="toggleMenu()">&#9776;</button>
  </div>
</nav>

<!-- Mobile slide-in menu -->
<div class="mobile-menu-overlay" id="mobileOverlay" onclick="closeMobileMenu()"></div>
<div class="mobile-menu" id="mobileMenu">
  <button class="mobile-close" onclick="closeMobileMenu()">&times;</button>
  <a href="#features" onclick="closeMobileMenu()">Features</a>
  <a href="#how" onclick="closeMobileMenu()">How It Works</a>
  <a href="#about" onclick="closeMobileMenu()">About</a>
  <a href="#faq" onclick="closeMobileMenu()">FAQ</a>
  <a onclick="closeMobileMenu();openModal('terms')">Terms</a>
  <a onclick="closeMobileMenu();openModal('privacy')">Privacy</a>
  <div class="mobile-cta">
    <a href="${LOGIN_URL}" class="btn btn-outline">Login</a>
    <a href="${REGISTER_URL}" class="btn btn-primary">Create Account</a>
  </div>
</div>

<!-- Hero -->
<section class="hero" id="hero">
  <div class="container">
    <div class="hero-grid">
      <div class="text-center-mobile">
        <h1 class="reveal">Instant Salary-Backed <span class="shimmer-text">Loans</span> with UPI Disbursement</h1>
        <p class="hero-sub reveal" style="transition-delay:.1s">SDL (Shubh Dhan Lakshmi) gives you quick, transparent loans repaid on your next salary date. No hidden charges, no paperwork delays.</p>
        <div class="hero-cta reveal" style="transition-delay:.2s">
          <a href="${LOGIN_URL}" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/></svg>
            Login
          </a>
          <a href="${REGISTER_URL}" class="btn btn-outline">Create Account</a>
        </div>
        <div class="hero-stats reveal" style="transition-delay:.3s">
          <div class="stat"><div class="stat-num gradient-text">24h</div><div class="stat-label">Approval SLA</div></div>
          <div class="stat"><div class="stat-num gradient-text" data-count="100" data-suffix="%">0%</div><div class="stat-label">UPI Instant</div></div>
          <div class="stat"><div class="stat-num gradient-text" data-count="${savingsPct}" data-suffix="%">0%</div><div class="stat-label">Savings Back</div></div>
        </div>
      </div>
      <div class="hero-art reveal-right">
        <div class="art-orb orb1"></div>
        <div class="art-orb orb2"></div>
        <div class="art-orb orb3"></div>
        <div class="coin coin1">&#8377;</div>
        <div class="coin coin2">&#8377;</div>
        <div class="limit-card-wrap" id="limitCardWrap">
          <div class="limit-card" id="limitCard">
            <div class="limit-card-shine" id="cardShine"></div>
            <div class="limit-card-top">
              <div>
                <div class="limit-card-label">Your Loan Limit</div>
              </div>
              <div class="limit-card-chip"></div>
            </div>
            <div>
              <div class="limit-card-amount"><span>&#8377;</span>20,000</div>
              <div class="limit-card-sub">Repay on your next salary date</div>
            </div>
            <div class="limit-card-bottom">
              <div class="limit-card-brand">SDL</div>
              <div class="limit-card-badge">UPI Enabled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Trust Marquee -->
<div class="trust-marquee reveal">
  <div class="trust-marquee-inner">
    <span class="trust-badge"><svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z"/></svg> Bank-Grade Security</span>
    <span class="trust-badge"><svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.4-1.4L10 14.2l7.6-7.6L19 8l-9 9z"/></svg> 24h Approval</span>
    <span class="trust-badge"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg> UPI Instant Transfer</span>
    <span class="trust-badge"><svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg> Transparent Charges</span>
    <span class="trust-badge"><svg viewBox="0 0 24 24"><path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3z"/></svg> Refer &amp; Earn</span>
    <span class="trust-badge"><svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z"/></svg> Bank-Grade Security</span>
    <span class="trust-badge"><svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.4-1.4L10 14.2l7.6-7.6L19 8l-9 9z"/></svg> 24h Approval</span>
    <span class="trust-badge"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg> UPI Instant Transfer</span>
    <span class="trust-badge"><svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg> Transparent Charges</span>
    <span class="trust-badge"><svg viewBox="0 0 24 24"><path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3z"/></svg> Refer &amp; Earn</span>
  </div>
</div>

<!-- Features -->
<section id="features">
  <div class="container">
    <div class="sec-header reveal">
      <h2>Why Choose <span class="gradient-text">SDL?</span></h2>
      <p>Built for salaried Indians who need fast, fair, and transparent financial support \u2014 with rewards built in.</p>
    </div>
    <div class="features-grid">
      <div class="feature-card reveal tilt-card">
        <div class="feature-icon"><svg viewBox="0 0 24 24"><path d="M11.5 2L2 7v2h20V7L11.5 2zM4 10v8H2v2h19v-2h-2v-8h-3v8h-3v-8H9v8H6v-8H4zm17 10H2v2h19v-2z"/></svg></div>
        <h3>Instant UPI Disbursement</h3>
        <p>Approved loans are sent directly to your UPI ID within 24 hours \u2014 no bank visits, no waiting.</p>
      </div>
      <div class="feature-card reveal tilt-card" style="transition-delay:.1s">
        <div class="feature-icon"><svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4zm0 6c1.4 0 2.5 1.1 2.5 2.5S13.4 12 12 12s-2.5-1.1-2.5-2.5S10.6 7 12 7zm0 12c-2.3 0-4.3-1.2-5.5-3 0-1.8 3.7-2.8 5.5-2.8s5.5 1 5.5 2.8c-1.2 1.8-3.2 3-5.5 3z"/></svg></div>
        <h3>Salary-Backed Trust</h3>
        <p>Loan limits grow with your salary profile and repayment history. Build credit with every on-time repayment.</p>
      </div>
      <div class="feature-card reveal tilt-card" style="transition-delay:.2s">
        <div class="feature-icon"><svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg></div>
        <h3>Transparent Charges</h3>
        <p>Interest ${interestRate}%, portal ${portalCharge}%, processing ${processingFee}% \u2014 all disclosed upfront. No hidden fees.</p>
      </div>
      <div class="feature-card reveal tilt-card">
        <div class="feature-icon"><svg viewBox="0 0 24 24"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.6 2 4.5 4 4.9V13c0 1.7 1.3 3 3 3v4H7v2h10v-2h-3v-4c1.7 0 3-1.3 3-3v-.1c2-.4 4-2.3 4-4.9V7c0-1.1-.9-2-2-2zM5 9V7h2v3.8C5.8 10.4 5 9.3 5 9zm14 0c0 1.3-.8 2.4-2 2.8V7h2v2z"/></svg></div>
        <h3>${savingsPct}% Savings Back</h3>
        <p>Get ${savingsPct}% of your loan amount credited to your SDL wallet on every timely repayment. Save while you borrow.</p>
      </div>
      <div class="feature-card reveal tilt-card" style="transition-delay:.1s">
        <div class="feature-icon"><svg viewBox="0 0 24 24"><path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5c0-2.3-4.7-3.5-7-3.5zm8 0c-.3 0-.6 0-1 .1 1.2.9 1.5 1.8 1.5 2.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z"/></svg></div>
        <h3>Refer &amp; Earn ${referralPct}%</h3>
        <p>Invite friends and earn ${referralPct}% of their loan amount, credited automatically when they repay.</p>
      </div>
      <div class="feature-card reveal tilt-card" style="transition-delay:.2s">
        <div class="feature-icon"><svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-9H9V6c0-1.7 1.3-3 3-3s3 1.3 3 3v2z"/></svg></div>
        <h3>Secure KYC Verification</h3>
        <p>Bank-grade encryption protects your PAN, address, and UPI data. Verified within 24 hours.</p>
      </div>
    </div>
  </div>
</section>

<!-- How It Works -->
<section id="how" style="background:rgba(255,140,66,.04)">
  <div class="container">
    <div class="sec-header reveal">
      <h2>How It <span class="gradient-text">Works</span></h2>
      <p>Three simple steps from application to disbursement.</p>
    </div>
    <div class="steps">
      <div class="steps-line"></div>
      <div class="step reveal">
        <div class="step-num">1</div>
        <h3>Register &amp; Complete KYC</h3>
        <p>Create your account, verify your identity with PAN and address proof. Approval within 24 hours.</p>
      </div>
      <div class="step reveal" style="transition-delay:.15s">
        <div class="step-num">2</div>
        <h3>Request a Loan</h3>
        <p>Choose your amount, see all charges upfront, and submit. Get approved and receive funds via UPI.</p>
      </div>
      <div class="step reveal" style="transition-delay:.3s">
        <div class="step-num">3</div>
        <h3>Repay on Salary Date</h3>
        <p>Repay via UPI on your next salary date. Earn savings back and grow your loan limit for next time.</p>
      </div>
    </div>
  </div>
</section>

<!-- About -->
<section id="about">
  <div class="container">
    <div class="about reveal">
      <h2>About <span class="gradient-text" style="background:linear-gradient(135deg,#F5C67E,#FF8C42);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">SDL</span></h2>
      <p>${aboutHtml}</p>
      <div class="about-stats">
        <div><div class="about-stat-num">24h</div><div class="about-stat-label">Approval Time</div></div>
        <div><div class="about-stat-num">100%</div><div class="about-stat-label">UPI Disbursement</div></div>
        <div><div class="about-stat-num">${savingsPct}%</div><div class="about-stat-label">Savings on Repayment</div></div>
        <div><div class="about-stat-num">${referralPct}%</div><div class="about-stat-label">Referral Earnings</div></div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section id="faq" style="background:rgba(255,140,66,.04)">
  <div class="container">
    <div class="sec-header reveal">
      <h2>Frequently Asked <span class="gradient-text">Questions</span></h2>
      <p>Everything you need to know about SDL loans.</p>
    </div>
    <div class="faq-list">
      <div class="faq-item reveal">
        <div class="faq-q" onclick="toggleFaq(this)">What is SDL (Shubh Dhan Lakshmi)?<div class="faq-icon"><span>+</span></div></div>
        <div class="faq-a"><p>SDL is a friendly loan platform for India that provides short-term salary-backed loans. You borrow now and repay on your next salary date via UPI \u2014 no long forms, no bank visits.</p></div>
      </div>
      <div class="faq-item reveal" style="transition-delay:.05s">
        <div class="faq-q" onclick="toggleFaq(this)">How much can I borrow?<div class="faq-icon"><span>+</span></div></div>
        <div class="faq-a"><p>Your loan limit depends on your salary profile and repayment history. New users start with a modest limit that grows with each on-time repayment. Admins review and approve each loan within 24 hours.</p></div>
      </div>
      <div class="faq-item reveal" style="transition-delay:.1s">
        <div class="faq-q" onclick="toggleFaq(this)">What charges apply?<div class="faq-icon"><span>+</span></div></div>
        <div class="faq-a"><p>SDL charges are fully transparent: ${interestRate}% interest, ${portalCharge}% portal charge, and ${processingFee}% processing fee. The total repayment amount is shown before you request the loan. On timely repayment, you get ${savingsPct}% back in your wallet.</p></div>
      </div>
      <div class="faq-item reveal" style="transition-delay:.15s">
        <div class="faq-q" onclick="toggleFaq(this)">How do I receive the loan?<div class="faq-icon"><span>+</span></div></div>
        <div class="faq-a"><p>Once approved, the loan amount is transferred directly to your UPI ID within 24 hours. You'll receive a WhatsApp notification and email confirmation with your agreement.</p></div>
      </div>
      <div class="faq-item reveal" style="transition-delay:.2s">
        <div class="faq-q" onclick="toggleFaq(this)">What happens if I'm late?<div class="faq-icon"><span>+</span></div></div>
        <div class="faq-a"><p>A daily overdue charge applies for late payments. We'll send reminders via WhatsApp before your due date. Consistent on-time repayments increase your loan limit for future borrowing.</p></div>
      </div>
      <div class="faq-item reveal" style="transition-delay:.25s">
        <div class="faq-q" onclick="toggleFaq(this)">How does the referral program work?<div class="faq-icon"><span>+</span></div></div>
        <div class="faq-a"><p>Share your referral link with friends. When they register and repay their first loan, you earn ${referralPct}% of their loan amount \u2014 credited automatically to your wallet.</p></div>
      </div>
      <div class="faq-item reveal" style="transition-delay:.3s">
        <div class="faq-q" onclick="toggleFaq(this)">Is my data safe?<div class="faq-icon"><span>+</span></div></div>
        <div class="faq-a"><p>Yes. All personal and financial data is encrypted and stored securely. We use your information only for loan processing and KYC verification. We never sell your data to third parties.</p></div>
      </div>
    </div>
  </div>
</section>

<!-- Legal Links -->
<section id="legal" style="padding:60px 20px">
  <div class="container">
    <div class="legal-links reveal">
      <div class="sec-header" style="margin-bottom:30px">
        <h2>Legal <span class="gradient-text">Documents</span></h2>
        <p>Click to read our terms and privacy policy.</p>
      </div>
      <div class="legal-links-wrap">
        <a class="legal-link" onclick="openModal('terms')">
          <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          Terms &amp; Conditions
        </a>
        <a class="legal-link" onclick="openModal('privacy')">
          <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
          Privacy Policy
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Footer -->
<footer>
  <div class="footer-grid">
    <div>
      <div class="footer-logo">
        <img src="logo.png" alt="SDL Logo" class="footer-logo-img" id="footerLogoImg" onerror="this.classList.remove('has-logo'); this.style.display='none'">
        <span class="footer-logo-fallback" id="footerLogoFallback">
          <svg width="40" height="40" viewBox="0 0 100 100"><defs><linearGradient id="ftg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FF4B2B"/><stop offset="100%" stop-color="#FF8C42"/></linearGradient></defs><circle cx="50" cy="50" r="46" fill="url(#ftg)"/><path d="M50 22 C40 35 30 40 30 55 C30 68 40 78 50 78 C60 78 70 68 70 55 C70 40 60 35 50 22 Z" fill="#fff" opacity=".9"/><circle cx="50" cy="55" r="8" fill="#FF4B2B"/><text x="50" y="94" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold" font-family="Arial">SDL</text></svg>
        </span>
        <div class="footer-brand">Shubh <span>Dhan Lakshmi</span></div>
      </div>
      <p class="footer-desc">Instant salary-backed loans with UPI disbursement. Built for India's salaried workforce.</p>
    </div>
    <div class="footer-col">
      <h4>Quick Links</h4>
      <a href="#features">Features</a>
      <a href="#how">How It Works</a>
      <a href="#faq">FAQ</a>
      <a href="#about">About Us</a>
    </div>
    <div class="footer-col">
      <h4>Legal</h4>
      <a onclick="openModal('terms')">Terms &amp; Conditions</a>
      <a onclick="openModal('privacy')">Privacy Policy</a>
    </div>
    <div class="footer-col">
      <h4>Get Started</h4>
      <a href="${LOGIN_URL}">Login</a>
      <a href="${REGISTER_URL}">Create Account</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 SDL (Shubh Dhan Lakshmi) All rights reserved.</p>
  </div>
</footer>

<!-- Legal Modal -->
<div class="modal-overlay" id="modalOverlay" onclick="closeModalOnOverlay(event)">
  <div class="modal" onclick="event.stopPropagation()">
    <div class="modal-header">
      <h2 id="modalTitle">Terms &amp; Conditions</h2>
      <button class="modal-close" onclick="closeModal()">&times;</button>
    </div>
    <div class="modal-content" id="modalContent"></div>
  </div>
</div>

<script>
// === Logo detection: if logo.png loads, show it; otherwise show SVG fallback ===
function checkLogo(imgId, fallbackId) {
  var img = document.getElementById(imgId);
  var fb = document.getElementById(fallbackId);
  if (img && img.naturalWidth > 0) {
    img.classList.add('has-logo');
    if (fb) fb.style.display = 'none';
  }
}
window.addEventListener('load', function() {
  ['navLogoImg', 'footerLogoImg'].forEach(function(id) {
    var img = document.getElementById(id);
    if (img) {
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('has-logo');
      } else {
        img.onload = function() { this.classList.add('has-logo'); };
      }
    }
  });
});

// === Nav scroll effect ===
window.addEventListener('scroll', function(){
  var nav = document.getElementById('nav');
  if(window.scrollY > 30) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// === Mobile slide-in menu ===
function toggleMenu(){
  var menu = document.getElementById('mobileMenu');
  var overlay = document.getElementById('mobileOverlay');
  var toggle = document.getElementById('menuToggle');
  menu.classList.add('open');
  overlay.classList.add('open');
  toggle.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu(){
  var menu = document.getElementById('mobileMenu');
  var overlay = document.getElementById('mobileOverlay');
  var toggle = document.getElementById('menuToggle');
  menu.classList.remove('open');
  overlay.classList.remove('open');
  toggle.classList.remove('active');
  document.body.style.overflow = '';
}

// === FAQ accordion ===
function toggleFaq(el){
  var item = el.parentElement;
  item.classList.toggle('open');
}

// === Legal modal ===
var termsContent = ${JSON.stringify(termsHtml)};
var privacyContent = ${JSON.stringify(privacyHtml)};

function openModal(type) {
  var overlay = document.getElementById('modalOverlay');
  var title = document.getElementById('modalTitle');
  var content = document.getElementById('modalContent');
  if (type === 'terms') {
    title.textContent = 'Terms & Conditions';
    content.innerHTML = termsContent;
  } else {
    title.textContent = 'Privacy Policy';
    content.innerHTML = privacyContent;
  }
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  var overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}
function closeModalOnOverlay(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

// === Scroll reveal animation ===
var observer = new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if(entry.isIntersecting){
      entry.target.classList.add('active');
    }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(function(el){observer.observe(el)});

// === 3D tilt on feature cards ===
document.querySelectorAll('.tilt-card').forEach(function(card){
  card.addEventListener('mousemove', function(e){
    var rect = card.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var cx = rect.width / 2;
    var cy = rect.height / 2;
    var rx = ((y - cy) / cy) * -6;
    var ry = ((x - cx) / cx) * 6;
    card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-8px)';
  });
  card.addEventListener('mouseleave', function(){
    card.style.transform = '';
  });
  card.addEventListener('touchmove', function(e){
    var t = e.touches[0];
    var rect = card.getBoundingClientRect();
    var x = t.clientX - rect.left;
    var y = t.clientY - rect.top;
    var cx = rect.width / 2;
    var cy = rect.height / 2;
    var rx = ((y - cy) / cy) * -6;
    var ry = ((x - cx) / cx) * 6;
    card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-8px)';
  });
  card.addEventListener('touchend', function(){
    card.style.transform = '';
  });
});

// === 3D mouse-track tilt on limit card ===
(function(){
  var card = document.getElementById('limitCard');
  var wrap = document.getElementById('limitCardWrap');
  var shine = document.getElementById('cardShine');
  if (!card) return;
  function handleMove(clientX, clientY) {
    var rect = card.getBoundingClientRect();
    var x = clientX - rect.left;
    var y = clientY - rect.top;
    var cx = rect.width / 2;
    var cy = rect.height / 2;
    var rx = ((y - cy) / cy) * -12;
    var ry = ((x - cx) / cx) * 14;
    card.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(1.03)';
    if (shine) {
      var px = (x / rect.width) * 100;
      var py = (y / rect.height) * 100;
      shine.style.background = 'radial-gradient(circle at ' + px + '% ' + py + '%, rgba(255,255,255,.3) 0%, transparent 50%)';
    }
  }
  card.addEventListener('mousemove', function(e){ handleMove(e.clientX, e.clientY); });
  card.addEventListener('mouseleave', function(){
    card.style.transform = '';
    if (shine) shine.style.background = '';
  });
  card.addEventListener('touchmove', function(e){
    e.preventDefault();
    var t = e.touches[0];
    handleMove(t.clientX, t.clientY);
  }, {passive: false});
  card.addEventListener('touchend', function(){
    card.style.transform = '';
    if (shine) shine.style.background = '';
  });
})();

// === Mouse / touch track orange blur background ===
(function(){
  var blur1 = document.getElementById('bgBlur');
  var blur2 = document.getElementById('bgBlur2');
  var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
  var cx = tx, cy = ty;
  var cx2 = tx, cy2 = ty;
  function animate() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    cx2 += (tx - cx2) * 0.04;
    cy2 += (ty - cy2) * 0.04;
    if (blur1) blur1.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
    if (blur2) blur2.style.transform = 'translate(' + cx2 + 'px,' + cy2 + 'px) translate(-50%,-50%)';
    requestAnimationFrame(animate);
  }
  document.addEventListener('mousemove', function(e){ tx = e.clientX; ty = e.clientY; });
  document.addEventListener('touchmove', function(e){
    var t = e.touches[0]; if (t) { tx = t.clientX; ty = t.clientY; }
  }, {passive: true});
  animate();
})();

// === Hero parallax on scroll ===
window.addEventListener('scroll', function(){
  var scrolled = window.scrollY;
  var art = document.querySelector('.hero-art');
  if(art && scrolled < 600) art.style.transform = 'translateY(' + (scrolled * 0.15) + 'px)';
  // Scroll progress bar
  var progress = document.getElementById('scrollProgress');
  if (progress) {
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
    progress.style.width = pct + '%';
  }
});

// === Animated number counter ===
function animateCounter(el, target, suffix) {
  var start = 0;
  var duration = 1500;
  var startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var val = Math.floor(eased * target);
    el.textContent = suffix ? (val + suffix) : val;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = suffix ? (target + suffix) : target;
  }
  requestAnimationFrame(step);
}

var counterObserver = new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = '1';
      var target = entry.target.dataset.count;
      var suffix = entry.target.dataset.suffix || '';
      if (target) animateCounter(entry.target, Number(target), suffix);
    }
  });
}, {threshold:0.5});
document.querySelectorAll('[data-count]').forEach(function(el){counterObserver.observe(el)});

// === Magnetic button effect ===
document.querySelectorAll('.btn-primary, .btn-outline').forEach(function(btn){
  btn.classList.add('btn-magnetic');
  btn.addEventListener('mousemove', function(e){
    var rect = btn.getBoundingClientRect();
    var x = e.clientX - rect.left - rect.width / 2;
    var y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = 'translate(' + (x * 0.15) + 'px,' + (y * 0.15) + 'px) translateY(-3px)';
  });
  btn.addEventListener('mouseleave', function(){
    btn.style.transform = '';
  });
});

// === Stagger reveal for feature cards ===
document.querySelectorAll('.feature-card').forEach(function(card, i){
  card.style.transitionDelay = (i * 0.08) + 's';
});
<\/script>
</body>
</html>`;
}
__name(buildHtml, "buildHtml");

// src/functions/getReferralDashboard.js
var getReferralDashboard_exports = {};
__export(getReferralDashboard_exports, {
  default: () => getReferralDashboard_default
});
async function getReferralDashboard_default(req, ctx) {
  const db = ctx.db;
  try {
    const user = await db.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (!user.id) return Response.json({ friends: [], loans: [] });
    const friends = await db.asServiceRole.entities.User.filter({ referrer_id: user.id });
    const loans = [];
    for (const f of friends) {
      const fls = await db.asServiceRole.entities.LoanApplication.filter({ user_id: f.id }, "-created_date");
      for (const l of fls) {
        loans.push({
          id: l.id,
          friendName: f.display_name || f.full_name || "",
          friendMobile: f.mobile_number || "",
          friendPic: f.profile_picture || "",
          amount: l.amount,
          repayment_amount: l.repayment_amount,
          due_date: l.due_date,
          status: l.status
        });
      }
    }
    return Response.json({
      friends: friends.map((f) => ({
        name: f.display_name || f.full_name || "",
        mobile: f.mobile_number || "",
        pic: f.profile_picture || "",
        kyc_status: f.kyc_status || ""
      })),
      loans
    });
  } catch (error) {
    return Response.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
__name(getReferralDashboard_default, "default");

// src/functions/lookupPincode.js
var lookupPincode_exports = {};
__export(lookupPincode_exports, {
  default: () => lookupPincode_default
});
async function lookupPincode_default(req, ctx) {
  const db = ctx.db;
  try {
    const user = await db.auth.me();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const pincode = body?.pincode;
    if (!pincode || !/^\d{6}$/.test(String(pincode))) {
      return Response.json({ error: "Invalid pincode" }, { status: 400 });
    }
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    if (!res.ok) {
      return Response.json({ error: "Postal API error" }, { status: 502 });
    }
    const data = await res.json();
    if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length) {
      const po = data[0].PostOffice[0];
      return Response.json({ city: po.District || "", state: po.State || "" });
    }
    return Response.json({ error: "Pincode not found" }, { status: 404 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
__name(lookupPincode_default, "default");

// src/functions/sendAppUpdate.js
var sendAppUpdate_exports = {};
__export(sendAppUpdate_exports, {
  default: () => sendAppUpdate_default
});
async function sendAppUpdate_default(req, ctx) {
  const db = ctx.db;
  try {
    const user = await db.auth.me().catch((e) => e.status === 401 ? null : Promise.reject(e));
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json().catch(() => ({}));
    const version2 = String(body.version || "").trim();
    const downloadUrl = String(body.download_url || "").trim();
    const notes = String(body.notes || "").trim();
    const reminderDays = [1, 2].includes(Number(body.reminder_days)) ? Number(body.reminder_days) : 2;
    if (!version2) return Response.json({ error: "Add the updated version." }, { status: 400 });
    if (version2.length > 40) return Response.json({ error: "Version is too long." }, { status: 400 });
    if (!/^https?:\/\/\S+$/i.test(downloadUrl)) {
      return Response.json({ error: "Paste a valid download link starting with http:// or https://" }, { status: 400 });
    }
    if (notes.length > 500) return Response.json({ error: "Notes are too long (max 500 characters)." }, { status: 400 });
    await db.asServiceRole.entities.AppUpdate.updateMany({ is_active: true }, { $set: { is_active: false } });
    const userCount = await db.asServiceRole.entities.User.count({ role: "user", app_installed: true }).catch(() => 0);
    const update = await db.asServiceRole.entities.AppUpdate.create({
      version: version2,
      download_url: downloadUrl,
      notes,
      reminder_days: reminderDays,
      is_active: true,
      sent_at: (/* @__PURE__ */ new Date()).toISOString(),
      sent_count: userCount
    });
    return Response.json({ update, notified: userCount });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
__name(sendAppUpdate_default, "default");

// src/functions/sendLimitAssignedEmail.js
var sendLimitAssignedEmail_exports = {};
__export(sendLimitAssignedEmail_exports, {
  default: () => sendLimitAssignedEmail_default
});

// src/shared/emailTemplate.js
var LOGO_URL = "https://media.db.com/images/public/6a65ccde323b932e9e9dc990/42c50083d_applogo.png";
function logoImg(size = 76) {
  return `<img src="${LOGO_URL}" alt="SDL" width="${size}" height="${size}" style="border-radius:18px; display:block; margin:0 auto 10px auto;" />`;
}
__name(logoImg, "logoImg");
function emailHeader() {
  return `<tr>
    <td style="background: linear-gradient(135deg, #ff4d2e 0%, #ff8a3d 100%); padding: 28px 32px; text-align:center;">
      ${logoImg(76)}
      <div style="font-size: 30px; font-weight: 800; color:#ffffff; letter-spacing: 1px; margin-bottom: 4px;">SDL</div>
      <div style="font-size: 13px; color:#ffe8dc; font-weight:500; letter-spacing: 0.5px;">India's No. 1 Friendly Loan</div>
    </td>
  </tr>`;
}
__name(emailHeader, "emailHeader");
function emailFooter(closingLine) {
  return `<tr>
    <td style="background-color:#2b1810; padding: 24px 32px; text-align:center;">
      ${logoImg(56)}
      <div style="font-size:16px; font-weight:800; color:#ffffff; margin-bottom:4px;">SDL</div>
      <div style="font-size:12px; color:#d8b8a8; margin-bottom:12px;">India's No. 1 Friendly Loan</div>
      <div style="font-size:11px; color:#9a7d70; line-height:1.6;">${closingLine}<br>Warm regards, Team SDL</div>
    </td>
  </tr>`;
}
__name(emailFooter, "emailFooter");
function base64UrlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(base64UrlEncode, "base64UrlEncode");
function buildRawMessage(to, from, subject, htmlBody) {
  const encodedSubject = /[^\x00-\x7F]/.test(subject) ? `=?utf-8?B?${base64UrlEncode(subject)}?=` : subject;
  const mime = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    htmlBody
  ].join("\r\n");
  return base64UrlEncode(mime);
}
__name(buildRawMessage, "buildRawMessage");

// src/functions/sendLimitAssignedEmail.js
function limitAssignedEmail({ borrowerName, limit }) {
  return `<!DOCTYPE html><html lang="en"><body style="margin:0; padding:0; background-color:#fdf1e9; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf1e9; padding: 30px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 12px; overflow:hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
        ${emailHeader()}
        <tr><td style="background-color:#fff4ee; padding: 10px 32px; text-align:center; border-bottom: 1px solid #ffe1d1;">
          <span style="display:inline-block; background-color:#ff4d2e; color:#ffffff; font-size:12px; font-weight:700; padding:4px 14px; border-radius: 20px; letter-spacing: 0.5px;">&#10003; LOAN LIMIT ASSIGNED</span>
        </td></tr>
        <tr><td style="padding: 32px;">
          <p style="font-size:16px; color:#2b2b2b; margin: 0 0 16px 0;">Dear <strong>${borrowerName}</strong>,</p>
          <p style="font-size:15px; color:#4a4a4a; line-height:1.6; margin: 0 0 24px 0;">Great news! Your KYC verification is complete and your loan limit has now been assigned. You can apply for loans up to the amount below.</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
            <tr><td style="background: linear-gradient(135deg, #fff1ea 0%, #ffe3d3 100%); border-radius: 10px; padding: 20px 24px; text-align:center; border: 1px solid #ffd3b8;">
              <div style="font-size:12px; color:#a15c3f; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:6px;">Your Approved Loan Limit</div>
              <div style="font-size:28px; font-weight:800; color:#ff4d2e;">Rs. ${limit}</div>
            </td></tr>
          </table>
          <p style="font-size:14px; color:#4a4a4a; line-height:1.6; margin: 0;">Your limit will increase based on your good repayment history. Log in to the SDL app to apply for your first loan.</p>
        </td></tr>
        ${emailFooter("Thank you for choosing us for your financial needs.")}
      </table>
    </td></tr>
  </table>
</body></html>`;
}
__name(limitAssignedEmail, "limitAssignedEmail");
async function sendLimitAssignedEmail_default(req, ctx) {
  const db = ctx.db;
  try {
    const user = await db.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json();
    const { userId, limit } = body;
    if (!userId || !limit) return Response.json({ error: "userId and limit required" }, { status: 400 });
    const borrower = await db.asServiceRole.entities.User.get(userId);
    if (!borrower) return Response.json({ error: "User not found" }, { status: 404 });
    if (!borrower.email) return Response.json({ error: "User has no email address" }, { status: 400 });
    const borrowerName = borrower.display_name || borrower.full_name || "User";
    const subject = "SDL Loan Limit Assigned";
    const emailBody = limitAssignedEmail({ borrowerName, limit: String(limit) });
    const { accessToken } = await db.asServiceRole.connectors.getConnection("gmail");
    const rawMessage = buildRawMessage(
      borrower.email,
      "shubhdhanlakshmifund@gmail.com",
      subject,
      emailBody
    );
    const sendRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ raw: rawMessage })
      }
    );
    if (!sendRes.ok) {
      const errText = await sendRes.text();
      return Response.json({ error: `Gmail send failed: ${errText}` }, { status: 500 });
    }
    return Response.json({ success: true, sentTo: borrower.email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
__name(sendLimitAssignedEmail_default, "default");

// src/functions/sendLoanEmail.js
var sendLoanEmail_exports = {};
__export(sendLoanEmail_exports, {
  default: () => sendLoanEmail_default
});
function approvalEmail({ borrowerName, principal, repayment, dueDate, agreementLink }) {
  return `<!DOCTYPE html><html lang="en"><body style="margin:0; padding:0; background-color:#fdf1e9; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf1e9; padding: 30px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 12px; overflow:hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
        ${emailHeader()}
        <tr><td style="background-color:#fff4ee; padding: 10px 32px; text-align:center; border-bottom: 1px solid #ffe1d1;">
          <span style="display:inline-block; background-color:#28a745; color:#ffffff; font-size:12px; font-weight:700; padding:4px 14px; border-radius: 20px; letter-spacing: 0.5px;">&#10003; LOAN APPROVED &amp; DISBURSED</span>
        </td></tr>
        <tr><td style="padding: 32px;">
          <p style="font-size:16px; color:#2b2b2b; margin: 0 0 16px 0;">Dear <strong>${borrowerName}</strong>,</p>
          <p style="font-size:15px; color:#4a4a4a; line-height:1.6; margin: 0 0 24px 0;">We are pleased to inform you that your loan has been <strong style="color:#ff4d2e;">approved and successfully disbursed</strong> to your account.</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
            <tr><td style="background: linear-gradient(135deg, #fff1ea 0%, #ffe3d3 100%); border-radius: 10px; padding: 20px 24px; text-align:center; border: 1px solid #ffd3b8;">
              <div style="font-size:12px; color:#a15c3f; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:6px;">Loan Amount Disbursed</div>
              <div style="font-size:28px; font-weight:800; color:#ff4d2e;">Rs. ${principal}</div>
            </td></tr>
          </table>
          <div style="font-size:15px; font-weight:700; color:#2b2b2b; margin-bottom:12px;">Repayment Details</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ded2; border-radius:8px; overflow:hidden; margin-bottom: 24px;">
            <tr style="background-color:#fff8f4;">
              <td style="padding: 12px 18px; font-size:14px; color:#7a7a7a; border-bottom:1px solid #f0ded2;">Amount Due</td>
              <td style="padding: 12px 18px; font-size:14px; color:#2b2b2b; font-weight:700; text-align:right; border-bottom:1px solid #f0ded2;">Rs. ${repayment}</td>
            </tr>
            <tr>
              <td style="padding: 12px 18px; font-size:14px; color:#7a7a7a;">Due Date</td>
              <td style="padding: 12px 18px; font-size:14px; color:#2b2b2b; font-weight:700; text-align:right;">${dueDate}</td>
            </tr>
          </table>
          <p style="font-size:14px; color:#4a4a4a; line-height:1.6; margin: 0;">Please find the <strong>loan agreement</strong> below for your reference and records. We kindly request you to review it and reach out to us in case of any queries.</p>
        </td></tr>
        ${agreementLink ? `<tr><td style="padding: 0 32px 32px 32px; text-align:center;"><a href="${agreementLink}" style="display:inline-block; background: linear-gradient(135deg, #ff4d2e 0%, #ff8a3d 100%); color:#ffffff; text-decoration:none; font-size:14px; font-weight:700; padding: 12px 32px; border-radius: 30px;">View Loan Agreement</a></td></tr>` : ""}
        ${emailFooter("Thank you for choosing us for your financial needs.")}
      </table>
    </td></tr>
  </table>
</body></html>`;
}
__name(approvalEmail, "approvalEmail");
function closureEmail({ borrowerName }) {
  return `<!DOCTYPE html><html lang="en"><body style="margin:0; padding:0; background-color:#fdf1e9; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf1e9; padding: 30px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 12px; overflow:hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
        ${emailHeader()}
        <tr><td style="background-color:#fff4ee; padding: 10px 32px; text-align:center; border-bottom: 1px solid #ffe1d1;">
          <span style="display:inline-block; background-color:#28a745; color:#ffffff; font-size:12px; font-weight:700; padding:4px 14px; border-radius: 20px; letter-spacing: 0.5px;">&#10003; LOAN REPAID IN FULL</span>
        </td></tr>
        <tr><td style="padding: 32px;">
          <p style="font-size:16px; color:#2b2b2b; margin: 0 0 16px 0;">Dear <strong>${borrowerName}</strong>,</p>
          <p style="font-size:15px; color:#4a4a4a; line-height:1.6; margin: 0 0 24px 0;">We are pleased to confirm that your loan has been <strong style="color:#ff4d2e;">successfully repaid in full</strong>. Thank you for your timely and responsible repayment.</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
            <tr><td style="background: linear-gradient(135deg, #fff1ea 0%, #ffe3d3 100%); border-radius: 10px; padding: 22px 24px; text-align:center; border: 1px solid #ffd3b8;">
              <div style="font-size:32px; margin-bottom: 6px;">&#127881;</div>
              <div style="font-size:16px; font-weight:800; color:#ff4d2e;">Loan Closed Successfully</div>
              <div style="font-size:13px; color:#a15c3f; margin-top:4px;">Your account is now fully settled</div>
            </td></tr>
          </table>
          <div style="font-size:15px; font-weight:700; color:#2b2b2b; margin-bottom:12px;">What This Means for You</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ded2; border-radius:8px; overflow:hidden; margin-bottom: 24px;">
            <tr style="background-color:#fff8f4;">
              <td style="padding: 16px 18px;">
                <div style="font-size:13px; color:#7a7a7a; margin-bottom:4px;">Credit Limit Status</div>
                <div style="font-size:15px; color:#2b2b2b; font-weight:700;">Updated &#10003; \u2014 Improved Eligibility for Future Borrowing</div>
              </td>
            </tr>
          </table>
          <p style="font-size:14px; color:#4a4a4a; line-height:1.6; margin: 0;">We appreciate your continued trust in us and look forward to serving your financial needs again.</p>
        </td></tr>
        ${emailFooter("Thank you for choosing us for your financial needs.")}
      </table>
    </td></tr>
  </table>
</body></html>`;
}
__name(closureEmail, "closureEmail");
async function sendLoanEmail_default(req, ctx) {
  const db = ctx.db;
  try {
    const user = await db.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json();
    const { loanId, emailType } = body;
    if (!loanId || !emailType) return Response.json({ error: "loanId and emailType required" }, { status: 400 });
    const loan = await db.asServiceRole.entities.LoanApplication.get(loanId);
    if (!loan) return Response.json({ error: "Loan not found" }, { status: 404 });
    const borrower = await db.asServiceRole.entities.User.get(loan.user_id);
    if (!borrower) return Response.json({ error: "Borrower not found" }, { status: 404 });
    const settingsList = await db.asServiceRole.entities.AppSettings.list();
    const appSettings = settingsList[0] || {};
    if (emailType === "closure" && appSettings.closure_email_enabled === false) {
      return Response.json({ success: true, skipped: true, message: "Closure email is disabled" });
    }
    if (emailType !== "closure" && appSettings.loan_email_enabled === false) {
      return Response.json({ success: true, skipped: true, message: "Loan approval email is disabled" });
    }
    const borrowerName = borrower.display_name || borrower.full_name || "User";
    let emailBody, subject;
    if (emailType === "closure") {
      subject = "SDL Loan Repayment Confirmed";
      emailBody = closureEmail({ borrowerName });
    } else {
      subject = "SDL Loan Approved & Disbursed";
      emailBody = approvalEmail({
        borrowerName,
        principal: String(loan.amount),
        repayment: String(loan.repayment_amount),
        dueDate: loan.due_date || "",
        agreementLink: loan.agreement_pdf_url || ""
      });
    }
    const { accessToken } = await db.asServiceRole.connectors.getConnection("gmail");
    const rawMessage = buildRawMessage(
      borrower.email,
      "shubhdhanlakshmifund@gmail.com",
      subject,
      emailBody
    );
    const sendRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ raw: rawMessage })
      }
    );
    if (!sendRes.ok) {
      const errText = await sendRes.text();
      return Response.json({ error: `Gmail send failed: ${errText}` }, { status: 500 });
    }
    return Response.json({ success: true, sentTo: borrower.email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
__name(sendLoanEmail_default, "default");

// src/functions/sendPromotionalEmail.js
var sendPromotionalEmail_exports = {};
__export(sendPromotionalEmail_exports, {
  default: () => sendPromotionalEmail_default
});
function base64UrlEncode2(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(base64UrlEncode2, "base64UrlEncode");
function buildRawMessage2(to, from, subject, htmlBody) {
  const encodedSubject = /[^\x00-\x7F]/.test(subject) ? `=?utf-8?B?${base64UrlEncode2(subject)}?=` : subject;
  const mime = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    htmlBody
  ].join("\r\n");
  return base64UrlEncode2(mime);
}
__name(buildRawMessage2, "buildRawMessage");
async function sendPromotionalEmail_default(req, ctx) {
  const db = ctx.db;
  try {
    const user = await db.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json();
    const { recipientType, userId, subject, htmlBody, fromName } = body;
    if (!recipientType || !subject || !htmlBody) {
      return Response.json({ error: "recipientType, subject, and htmlBody are required" }, { status: 400 });
    }
    let recipients = [];
    if (recipientType === "single") {
      if (!userId) return Response.json({ error: "userId required for single recipient" }, { status: 400 });
      const u = await db.asServiceRole.entities.User.get(userId);
      if (u && u.email) {
        recipients = [{ email: u.email, name: u.display_name || u.full_name || "User" }];
      }
    } else if (recipientType === "kyc_incomplete") {
      const users = await db.asServiceRole.entities.User.filter({
        kyc_status: { $nin: ["approved"] },
        role: "user"
      });
      recipients = users.filter((u) => u.email).map((u) => ({ email: u.email, name: u.display_name || u.full_name || "User" }));
    } else if (recipientType === "active_loans") {
      const users = await db.asServiceRole.entities.User.filter({ role: "user", account_status: "active" });
      recipients = users.filter((u) => u.email).map((u) => ({ email: u.email, name: u.display_name || u.full_name || "User" }));
    } else if (recipientType === "all") {
      const users = await db.asServiceRole.entities.User.filter({ role: "user" });
      recipients = users.filter((u) => u.email).map((u) => ({ email: u.email, name: u.display_name || u.full_name || "User" }));
    } else {
      return Response.json({ error: "Invalid recipientType" }, { status: 400 });
    }
    if (recipients.length === 0) {
      return Response.json({ error: "No recipients found with email addresses" }, { status: 400 });
    }
    const { accessToken } = await db.asServiceRole.connectors.getConnection("gmail");
    const from = fromName ? `${fromName} <shubhdhanlakshmifund@gmail.com>` : "shubhdhanlakshmifund@gmail.com";
    let sent = 0;
    let failed = 0;
    const failedEmails = [];
    for (const r of recipients) {
      try {
        const personalizedBody = htmlBody.replace(/\{\{name\}\}/g, r.name);
        const rawMessage = buildRawMessage2(r.email, from, subject, personalizedBody);
        const sendRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ raw: rawMessage })
        });
        if (sendRes.ok) {
          sent++;
        } else {
          failed++;
          failedEmails.push(r.email);
        }
      } catch (e) {
        failed++;
        failedEmails.push(r.email);
      }
    }
    return Response.json({
      success: true,
      sent,
      failed,
      total: recipients.length,
      failedEmails: failedEmails.slice(0, 10)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
__name(sendPromotionalEmail_default, "default");

// src/functions/sendRepaymentReminders.js
var sendRepaymentReminders_exports = {};
__export(sendRepaymentReminders_exports, {
  default: () => sendRepaymentReminders_default
});

// src/shared/reminderContent.js
var REMINDER_STAGES = [
  { id: "t_minus_2", offset: -2, label: "2 days before due date" },
  { id: "t_minus_1", offset: -1, label: "1 day before due date" },
  { id: "due", offset: 0, label: "Due today" },
  { id: "plus_1", offset: 1, label: "1 day overdue" },
  { id: "plus_2", offset: 2, label: "2 days overdue" }
];
function stageForOffset(offset) {
  const found = REMINDER_STAGES.find((s) => s.offset === offset);
  return found ? found.id : null;
}
__name(stageForOffset, "stageForOffset");
function stageLabel(stage) {
  const found = REMINDER_STAGES.find((s) => s.id === stage);
  return found ? found.label : stage;
}
__name(stageLabel, "stageLabel");
function inr(value) {
  return "\u20B9" + (Number(value) || 0).toLocaleString("en-IN");
}
__name(inr, "inr");
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function prettyDate(dateStr) {
  if (!dateStr) return "-";
  const parts = String(dateStr).slice(0, 10).split("-").map(Number);
  const [y, m, d] = parts;
  if (!y || !m || !d) return String(dateStr);
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}`;
}
__name(prettyDate, "prettyDate");
function headline(stage, overdueDays) {
  if (stage === "t_minus_2") return "Your loan repayment is due in *2 days*.";
  if (stage === "t_minus_1") return "Your loan repayment is due *tomorrow*.";
  if (stage === "due") return "Your loan repayment is due *today*.";
  return `Your repayment is now *${overdueDays} day${overdueDays === 1 ? "" : "s"} overdue*.`;
}
__name(headline, "headline");
function plainHeadline(stage, overdueDays) {
  return headline(stage, overdueDays).replace(/\*/g, "");
}
__name(plainHeadline, "plainHeadline");
function actionLine(stage, overdueDays) {
  if (overdueDays > 0) return "Please clear the full amount immediately to stop further overdue charges.";
  if (stage === "due") return "Please repay today to keep your loan account in good standing.";
  return "Please keep the repayment amount ready on your due date to avoid overdue charges.";
}
__name(actionLine, "actionLine");
function reminderSubject(stage, amount, overdueDays) {
  if (overdueDays > 0) return `SDL Overdue Payment \u2014 ${inr(amount)} pending`;
  if (stage === "due") return `SDL Repayment Due Today \u2014 ${inr(amount)}`;
  if (stage === "t_minus_1") return `SDL Repayment Due Tomorrow \u2014 ${inr(amount)}`;
  return `SDL Repayment Reminder \u2014 ${inr(amount)} due soon`;
}
__name(reminderSubject, "reminderSubject");
function buildReminderMessage(opts) {
  const {
    stage,
    userName,
    loanCode,
    loanAmount,
    repaymentAmount,
    dueDate,
    overdueDays,
    overdueAmount,
    totalPayable,
    waived = false,
    websiteUrl
  } = opts;
  const lines = [
    "\u{1FA94} *Repayment Reminder* \u{1F64F}",
    "",
    `Dear *${userName}*,`,
    "",
    headline(stage, overdueDays),
    "",
    `Loan ID: *${loanCode || "-"}*`,
    `Loan Amount: *${inr(loanAmount)}*`,
    `Repayment Amount: *${inr(repaymentAmount)}*`,
    `Due Date: *${prettyDate(dueDate)}*`
  ];
  if (overdueDays > 0) {
    lines.push(
      `Overdue Days: *${overdueDays}*`,
      `Overdue Charges: *${waived ? "Waived" : inr(overdueAmount)}*`,
      `Total Payable Now: *${inr(totalPayable)}*`
    );
  }
  lines.push(
    "",
    actionLine(stage, overdueDays),
    "",
    `Visit: ${websiteUrl}`,
    "",
    "Regards,",
    "SDL Team \u{1FA94}"
  );
  return lines.join("\n");
}
__name(buildReminderMessage, "buildReminderMessage");
function buildReminderEmailHtml(opts) {
  const {
    stage,
    userName,
    loanCode,
    loanAmount,
    repaymentAmount,
    dueDate,
    overdueDays,
    overdueAmount,
    totalPayable,
    waived = false,
    websiteUrl
  } = opts;
  const isOverdue = overdueDays > 0;
  const badge = isOverdue ? "PAYMENT OVERDUE" : stage === "due" ? "PAYMENT DUE TODAY" : "REPAYMENT REMINDER";
  const badgeColor = isOverdue ? "#c62828" : "#e05a1e";
  const overdueRows = isOverdue ? `<tr style="background-color:#fff4f4;">
         <td style="padding: 12px 18px; font-size:14px; color:#7a7a7a; border-bottom:1px solid #f0ded2;">Overdue Days</td>
         <td style="padding: 12px 18px; font-size:14px; color:#c62828; font-weight:700; text-align:right; border-bottom:1px solid #f0ded2;">${overdueDays}</td>
       </tr>
       <tr style="background-color:#fff4f4;">
         <td style="padding: 12px 18px; font-size:14px; color:#7a7a7a; border-bottom:1px solid #f0ded2;">Overdue Charges</td>
         <td style="padding: 12px 18px; font-size:14px; color:#c62828; font-weight:700; text-align:right; border-bottom:1px solid #f0ded2;">${waived ? "Waived" : inr(overdueAmount)}</td>
       </tr>` : "";
  return `<!DOCTYPE html><html lang="en"><body style="margin:0; padding:0; background-color:#fdf1e9; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf1e9; padding: 30px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 12px; overflow:hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
        ${emailHeader()}
        <tr><td style="background-color:#fff4ee; padding: 10px 32px; text-align:center; border-bottom: 1px solid #ffe1d1;">
          <span style="display:inline-block; background-color:${badgeColor}; color:#ffffff; font-size:12px; font-weight:700; padding:4px 14px; border-radius: 20px; letter-spacing: 0.5px;">${badge}</span>
        </td></tr>
        <tr><td style="padding: 32px;">
          <p style="font-size:16px; color:#2b2b2b; margin: 0 0 16px 0;">Dear <strong>${userName}</strong>,</p>
          <p style="font-size:15px; color:#4a4a4a; line-height:1.6; margin: 0 0 24px 0;">${plainHeadline(stage, overdueDays)}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
            <tr><td style="background: linear-gradient(135deg, #fff1ea 0%, #ffe3d3 100%); border-radius: 10px; padding: 20px 24px; text-align:center; border: 1px solid #ffd3b8;">
              <div style="font-size:12px; color:#a15c3f; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:6px;">${isOverdue ? "Total Payable Now" : "Amount Due"}</div>
              <div style="font-size:28px; font-weight:800; color:#ff4d2e;">${inr(isOverdue ? totalPayable : repaymentAmount)}</div>
            </td></tr>
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ded2; border-radius:8px; overflow:hidden; margin-bottom: 24px;">
            <tr style="background-color:#fff8f4;">
              <td style="padding: 12px 18px; font-size:14px; color:#7a7a7a; border-bottom:1px solid #f0ded2;">Loan ID</td>
              <td style="padding: 12px 18px; font-size:14px; color:#2b2b2b; font-weight:700; text-align:right; border-bottom:1px solid #f0ded2;">${loanCode || "-"}</td>
            </tr>
            <tr>
              <td style="padding: 12px 18px; font-size:14px; color:#7a7a7a; border-bottom:1px solid #f0ded2;">Loan Amount</td>
              <td style="padding: 12px 18px; font-size:14px; color:#2b2b2b; font-weight:700; text-align:right; border-bottom:1px solid #f0ded2;">${inr(loanAmount)}</td>
            </tr>
            <tr style="background-color:#fff8f4;">
              <td style="padding: 12px 18px; font-size:14px; color:#7a7a7a; border-bottom:1px solid #f0ded2;">Repayment Amount</td>
              <td style="padding: 12px 18px; font-size:14px; color:#2b2b2b; font-weight:700; text-align:right; border-bottom:1px solid #f0ded2;">${inr(repaymentAmount)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 18px; font-size:14px; color:#7a7a7a;${isOverdue ? " border-bottom:1px solid #f0ded2;" : ""}">Due Date</td>
              <td style="padding: 12px 18px; font-size:14px; color:#2b2b2b; font-weight:700; text-align:right;${isOverdue ? " border-bottom:1px solid #f0ded2;" : ""}">${prettyDate(dueDate)}</td>
            </tr>
            ${overdueRows}
          </table>
          <p style="font-size:14px; color:#4a4a4a; line-height:1.6; margin: 0 0 24px 0;">${actionLine(stage, overdueDays)}</p>
          <div style="text-align:center;">
            <a href="${websiteUrl}" style="display:inline-block; background: linear-gradient(135deg, #ff4d2e 0%, #ff8a3d 100%); color:#ffffff; text-decoration:none; font-size:14px; font-weight:700; padding: 12px 32px; border-radius: 30px;">Visit SDL</a>
          </div>
        </td></tr>
        ${emailFooter(`Need help? Reach us at ${websiteUrl}`)}
      </table>
    </td></tr>
  </table>
</body></html>`;
}
__name(buildReminderEmailHtml, "buildReminderEmailHtml");

// src/functions/sendRepaymentReminders.js
var IST = "Asia/Kolkata";
var DEFAULT_WEBSITE = "https://shubhdhanlakshmi.in/";
function istToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(/* @__PURE__ */ new Date());
}
__name(istToday, "istToday");
function istHour() {
  return Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: IST, hour: "2-digit", hour12: false }).format(/* @__PURE__ */ new Date())
  );
}
__name(istHour, "istHour");
function dayDiff(a, b) {
  const toUtc = /* @__PURE__ */ __name((s) => {
    const [y, m, d] = String(s).slice(0, 10).split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  }, "toUtc");
  return Math.round((toUtc(a) - toUtc(b)) / 864e5);
}
__name(dayDiff, "dayDiff");
function chunk(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}
__name(chunk, "chunk");
async function sendRepaymentReminders_default(req, ctx) {
  const db = ctx.db;
  try {
    const user = await db.auth.me().catch((e) => e.status === 401 ? null : Promise.reject(e));
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json().catch(() => ({}));
    const force = body?.force === true;
    const dryRun = body?.dryRun === true;
    const settingsList = await db.asServiceRole.entities.AppSettings.list();
    const settings = settingsList[0] || {};
    const websiteUrl = (settings.reminder_website_url || DEFAULT_WEBSITE).trim();
    const emailEnabled = settings.reminder_email_enabled !== false;
    const overdueRate = Number(settings.overdue_daily_rate) || 1;
    const today = istToday();
    const hour = istHour();
    const withinWindow = hour >= 8 && hour < 11;
    const shouldSendEmail = emailEnabled && !dryRun && (force || withinWindow);
    const loansPage = await db.asServiceRole.entities.LoanApplication.filter(
      { status: { $in: ["disbursed", "overdue"] } },
      { limit: 500 }
    );
    const loans = loansPage.items || [];
    const candidates = [];
    for (const loan of loans) {
      if (!loan.due_date) continue;
      const offset = dayDiff(today, loan.due_date);
      const stage = stageForOffset(offset);
      if (!stage) continue;
      candidates.push({ loan, stage, offset });
    }
    if (candidates.length === 0) {
      return Response.json({ generated: 0, sent: 0, failed: 0, message: "No reminders scheduled for today" });
    }
    const existingPage = await db.asServiceRole.entities.RepaymentReminder.filter(
      { loan_id: { $in: candidates.map((c) => c.loan.id) } },
      { limit: 500 }
    );
    const alreadyCreated = new Set((existingPage.items || []).map((r) => `${r.loan_id}:${r.stage}`));
    const userIds = [...new Set(candidates.map((c) => c.loan.user_id).filter(Boolean))];
    const users = userIds.length ? await db.asServiceRole.entities.User.filter({ id: { $in: userIds } }) : [];
    const userMap = {};
    users.forEach((u) => {
      userMap[u.id] = u;
    });
    const records = [];
    for (const { loan, stage, offset } of candidates) {
      if (alreadyCreated.has(`${loan.id}:${stage}`)) continue;
      const borrower = userMap[loan.user_id] || {};
      const overdueDays = Math.max(0, offset);
      const loanAmount = Number(loan.amount) || 0;
      const repaymentAmount = Number(loan.repayment_amount) || 0;
      const overdueAmount = overdueDays && !loan.overdue_waived ? Math.round(loanAmount * overdueDays * overdueRate / 100) : 0;
      const userName = borrower.display_name || borrower.full_name || loan.user_name || "User";
      const base = {
        stage,
        userName,
        loanCode: loan.loan_id,
        loanAmount,
        repaymentAmount,
        dueDate: loan.due_date,
        overdueDays,
        overdueAmount,
        totalPayable: repaymentAmount + overdueAmount,
        waived: !!loan.overdue_waived,
        websiteUrl
      };
      records.push({
        loan_id: loan.id,
        loan_code: loan.loan_id || "",
        user_id: loan.user_id || "",
        user_name: userName,
        user_mobile: loan.user_mobile || borrower.mobile_number || "",
        user_email: borrower.email || "",
        stage,
        stage_label: stageLabel(stage),
        scheduled_for: today,
        due_date: loan.due_date,
        loan_amount: loanAmount,
        repayment_amount: repaymentAmount,
        overdue_days: overdueDays,
        overdue_amount: overdueAmount,
        total_payable: repaymentAmount + overdueAmount,
        whatsapp_message: buildReminderMessage(base),
        email_status: shouldSendEmail && borrower.email ? "pending" : "skipped"
      });
    }
    if (dryRun) {
      return Response.json({
        generated: 0,
        dryRun: true,
        wouldCreate: records.map((r) => ({ loan: r.loan_code, stage: r.stage, email: r.user_email }))
      });
    }
    if (records.length > 0) {
      await db.asServiceRole.entities.RepaymentReminder.bulkCreate(records);
    }
    if (!shouldSendEmail) {
      return Response.json({
        generated: records.length,
        sent: 0,
        failed: 0,
        message: emailEnabled ? "Reminder messages are ready. Emails go out only between 8:00 and 10:59 AM IST." : "Reminder emails are turned off in settings. WhatsApp messages are ready to copy."
      });
    }
    const pendingPage = await db.asServiceRole.entities.RepaymentReminder.filter(
      { email_status: { $in: force ? ["pending", "skipped"] : ["pending"] }, scheduled_for: today },
      { sort: "-created_date", limit: 100 }
    );
    const pending = pendingPage.items || [];
    if (pending.length === 0) {
      return Response.json({ generated: records.length, sent: 0, failed: 0, message: "Nothing pending to email" });
    }
    let accessToken = null;
    try {
      const connection = await db.asServiceRole.connectors.getConnection("gmail");
      accessToken = connection.accessToken;
    } catch (e) {
      accessToken = null;
    }
    let sent = 0;
    const failedUpdates = [];
    const sentUpdates = [];
    for (const batch of chunk(pending, 6)) {
      const results = await Promise.allSettled(
        batch.map(async (record) => {
          if (!record.user_email || !accessToken) throw new Error("No recipient email or Gmail connection");
          const base = {
            stage: record.stage,
            userName: record.user_name,
            loanCode: record.loan_code,
            loanAmount: record.loan_amount,
            repaymentAmount: record.repayment_amount,
            dueDate: record.due_date,
            overdueDays: record.overdue_days || 0,
            overdueAmount: record.overdue_amount || 0,
            waived: (record.overdue_days || 0) > 0 && !(record.overdue_amount || 0),
            totalPayable: record.total_payable,
            websiteUrl
          };
          const raw = buildRawMessage(
            record.user_email,
            "shubhdhanlakshmifund@gmail.com",
            reminderSubject(record.stage, record.total_payable || record.repayment_amount, record.overdue_days || 0),
            buildReminderEmailHtml(base)
          );
          const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ raw }),
            signal: AbortSignal.timeout(15e3)
          });
          if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText.slice(0, 300));
          }
          return record.id;
        })
      );
      results.forEach((result, index) => {
        const record = batch[index];
        if (result.status === "fulfilled") {
          sent += 1;
          sentUpdates.push({ id: record.id, email_status: "sent", email_sent_at: (/* @__PURE__ */ new Date()).toISOString() });
        } else {
          failedUpdates.push({
            id: record.id,
            email_status: "failed",
            email_error: String(result.reason?.message || result.reason || "send failed").slice(0, 400)
          });
        }
      });
    }
    if (sentUpdates.length) await db.asServiceRole.entities.RepaymentReminder.bulkUpdate(sentUpdates);
    if (failedUpdates.length) await db.asServiceRole.entities.RepaymentReminder.bulkUpdate(failedUpdates);
    return Response.json({ generated: records.length, sent, failed: failedUpdates.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
__name(sendRepaymentReminders_default, "default");

// src/functions/submitKyc.js
var submitKyc_exports = {};
__export(submitKyc_exports, {
  default: () => submitKyc_default
});
var KYC_FIELDS = [
  "full_name",
  "display_name",
  "mobile_number",
  "pan_number",
  "upi_id",
  "salary_date",
  "salary_date_set_date",
  "salary_slip_updated_date",
  "referrer_name",
  "referrer_mobile",
  "address_line1",
  "address_line2",
  "city",
  "state",
  "pincode",
  "pan_card_image",
  "aadhaar_front_image",
  "aadhaar_back_image",
  "salary_slip_image",
  "additional_documents"
];
var REQUIRED = [
  "full_name",
  "mobile_number",
  "pan_number",
  "upi_id",
  "salary_date",
  "pan_card_image",
  "aadhaar_front_image",
  "aadhaar_back_image",
  "salary_slip_image"
];
function istDate(offsetMs = 0) {
  return new Date(Date.now() + 198e5 + offsetMs).toISOString().split("T")[0];
}
__name(istDate, "istDate");
async function submitKyc_default(req, ctx) {
  const db = ctx.db;
  try {
    const user = await db.auth.me().catch((e) => e.status === 401 ? null : Promise.reject(e));
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json().catch(() => ({}));
    if (body.reapply) {
      if (!["rejected", "hold"].includes(user.kyc_status || "")) {
        return Response.json({ error: "Re-apply is only available after a rejection." }, { status: 400 });
      }
      await db.asServiceRole.entities.User.update(user.id, {
        kyc_status: "pending",
        rejection_reason: ""
      });
      return Response.json({ ok: true, kyc_status: "pending" });
    }
    if (user.kyc_status === "approved") {
      return Response.json({ error: "Your KYC is already approved." }, { status: 400 });
    }
    const today = istDate(0);
    const tomorrow = istDate(864e5);
    const blockedUntil = user.kyc_blocked_until || "";
    const attempts = user.kyc_attempt_date === today ? Number(user.kyc_attempt_count) || 0 : 0;
    if (blockedUntil && today < blockedUntil) {
      return Response.json({ error: `KYC submissions are blocked until ${blockedUntil}.` }, { status: 429 });
    }
    const settingsList = await db.asServiceRole.entities.AppSettings.list();
    const dailyLimit = Number(settingsList?.[0]?.kyc_daily_limit) || 3;
    if (attempts >= dailyLimit) {
      await db.asServiceRole.entities.User.update(user.id, { kyc_blocked_until: tomorrow });
      return Response.json({ error: `You have used all ${dailyLimit} KYC attempts for today.` }, { status: 429 });
    }
    const patch = {};
    for (const key of KYC_FIELDS) {
      if (body[key] !== void 0 && body[key] !== null) patch[key] = body[key];
    }
    for (const key of REQUIRED) {
      if (!patch[key]) return Response.json({ error: `${key} is required` }, { status: 400 });
    }
    const pan = String(patch.pan_number).trim().toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
      return Response.json({ error: "Enter a valid PAN number." }, { status: 400 });
    }
    if (!/^\d{10}$/.test(String(patch.mobile_number))) {
      return Response.json({ error: "Enter a valid 10-digit mobile number." }, { status: 400 });
    }
    const mobile = String(patch.mobile_number);
    if (mobile !== String(user.mobile_number || "")) {
      const mobileTaken = await db.asServiceRole.entities.User.filter({ mobile_number: mobile });
      if (mobileTaken.some((u) => u.id !== user.id)) {
        return Response.json({ error: "This mobile number is already registered." }, { status: 400 });
      }
    }
    let referrerId = user.referrer_id || "";
    const referrerMobile = String(patch.referrer_mobile || "").trim();
    if (referrerMobile) {
      const referrers = await db.asServiceRole.entities.User.filter({ mobile_number: referrerMobile });
      const referrer = referrers.find((u) => u.id !== user.id);
      if (referrer) referrerId = referrer.id;
    }
    if (!/^\d{1,2}$/.test(String(patch.salary_date))) {
      return Response.json({ error: "Enter a valid salary date." }, { status: 400 });
    }
    const nextCount = attempts + 1;
    const update = {
      ...patch,
      pan_number: pan,
      referrer_id: referrerId,
      salary_date: Number(patch.salary_date),
      kyc_status: "pending",
      registration_complete: true,
      kyc_attempt_count: nextCount,
      kyc_attempt_date: today
    };
    if (nextCount >= dailyLimit) update.kyc_blocked_until = tomorrow;
    await db.asServiceRole.entities.User.update(user.id, update);
    return Response.json({
      ok: true,
      kyc_status: "pending",
      attempts_left: Math.max(0, dailyLimit - nextCount)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
__name(submitKyc_default, "default");

// src/functions/submitPartnerRequest.js
var submitPartnerRequest_exports = {};
__export(submitPartnerRequest_exports, {
  default: () => submitPartnerRequest_default
});
async function submitPartnerRequest_default(req, ctx) {
  const db = ctx.db;
  try {
    const user = await db.auth.me().catch((e) => e.status === 401 ? null : Promise.reject(e));
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.partner_status === "approved") {
      return Response.json({ error: "You are already an SDL partner." }, { status: 400 });
    }
    if (!user.pan_number || !user.upi_id) {
      return Response.json({ error: "Complete your KYC (PAN and UPI) before becoming a partner." }, { status: 400 });
    }
    const existing = await db.asServiceRole.entities.PartnerRequest.filter({ user_id: user.id });
    if (existing.some((r) => r.status === "pending")) {
      return Response.json({ error: "Your partner request is already under review." }, { status: 400 });
    }
    const address = [user.address_line1, user.address_line2, user.city, user.state, user.pincode].filter(Boolean).join(", ");
    const created = await db.asServiceRole.entities.PartnerRequest.create({
      user_id: user.id,
      user_name: user.display_name || user.full_name,
      user_mobile: user.mobile_number,
      user_email: user.email,
      user_pan: user.pan_number,
      user_upi_id: user.upi_id,
      user_address: address,
      status: "pending"
    });
    await db.asServiceRole.entities.User.update(user.id, { partner_status: "pending" });
    return Response.json({ ok: true, id: created.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
__name(submitPartnerRequest_default, "default");

// src/functions/submitRepaymentProof.js
var submitRepaymentProof_exports = {};
__export(submitRepaymentProof_exports, {
  default: () => submitRepaymentProof_default
});
async function submitRepaymentProof_default(req, ctx) {
  const db = ctx.db;
  try {
    const user = await db.auth.me().catch((e) => e.status === 401 ? null : Promise.reject(e));
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json().catch(() => ({}));
    const loanId = body.loanId;
    if (!loanId) return Response.json({ error: "loanId is required" }, { status: 400 });
    const screenshots = (Array.isArray(body.screenshots) ? body.screenshots : []).slice(0, 10).map((s) => ({ screenshot: String(s?.screenshot || ""), amount: Number(s?.amount) || 0 })).filter((s) => s.screenshot);
    if (!screenshots.length) {
      return Response.json({ error: "At least one payment screenshot is required" }, { status: 400 });
    }
    const loan = await db.asServiceRole.entities.LoanApplication.get(loanId).catch((e) => e.status === 404 ? null : Promise.reject(e));
    if (!loan) return Response.json({ error: "Loan not found" }, { status: 404 });
    if (loan.user_id !== user.id) return Response.json({ error: "Forbidden" }, { status: 403 });
    if (!["disbursed", "overdue"].includes(loan.status)) {
      return Response.json({ error: "This loan is not open for repayment." }, { status: 400 });
    }
    await db.asServiceRole.entities.LoanApplication.update(loanId, {
      repayment_screenshots: JSON.stringify(screenshots),
      repayment_screenshot: screenshots[0].screenshot,
      status: "pending_verification"
    });
    return Response.json({ ok: true, status: "pending_verification" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
__name(submitRepaymentProof_default, "default");

// src/functions/systemHealthCheck.js
var systemHealthCheck_exports = {};
__export(systemHealthCheck_exports, {
  default: () => systemHealthCheck_default
});
async function systemHealthCheck_default(req, ctx) {
  const db = ctx.db;
  try {
    const user = await db.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const entityNames2 = [
      "User",
      "LoanApplication",
      "WalletTransaction",
      "SupportTicket",
      "TeamMember",
      "AppSettings",
      "AdminCapital",
      "Notification",
      "PartnerRequest",
      "PartnerDeposit",
      "PartnerWithdrawal",
      "PartnerLoanAssignment"
    ];
    const checks = [];
    for (const name of entityNames2) {
      try {
        const items = await db.asServiceRole.entities[name].list("-created_date", 1);
        checks.push({ category: "Database", name, status: "ok", detail: `${items.length} record(s) accessible` });
      } catch (e) {
        checks.push({ category: "Database", name, status: "error", detail: e.message });
      }
    }
    try {
      const settings = await db.asServiceRole.entities.AppSettings.list();
      if (settings.length > 0) {
        const s = settings[0];
        const missing = [];
        if (!s.admin_upi_id) missing.push("UPI ID");
        if (!s.interest_rate) missing.push("Interest Rate");
        if (missing.length > 0) {
          checks.push({ category: "Configuration", name: "App Settings", status: "warning", detail: `Missing: ${missing.join(", ")}` });
        } else {
          checks.push({ category: "Configuration", name: "App Settings", status: "ok", detail: "Fully configured" });
        }
      } else {
        checks.push({ category: "Configuration", name: "App Settings", status: "warning", detail: "No settings record found" });
      }
    } catch (e) {
      checks.push({ category: "Configuration", name: "App Settings", status: "error", detail: e.message });
    }
    const functionNames = ["getReferralDashboard", "lookupPincode", "sendLoanEmail", "verifyReferrer", "systemHealthCheck"];
    for (const fn of functionNames) {
      checks.push({ category: "Backend Functions", name: fn, status: "ok", detail: "Deployed" });
    }
    checks.push({ category: "Integrations", name: "Core (LLM, Upload, Email)", status: "ok", detail: "Platform-managed" });
    const errors = checks.filter((c) => c.status === "error").length;
    const warnings = checks.filter((c) => c.status === "warning").length;
    return Response.json({
      overall: errors === 0 ? warnings > 0 ? "warnings" : "healthy" : "issues",
      errorCount: errors,
      warningCount: warnings,
      totalChecks: checks.length,
      checks,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
__name(systemHealthCheck_default, "default");

// src/functions/verifyReferrer.js
var verifyReferrer_exports = {};
__export(verifyReferrer_exports, {
  default: () => verifyReferrer_default
});
var BLOCKED_MOBILE = "7894561237";
async function verifyReferrer_default(req, ctx) {
  const db = ctx.db;
  try {
    const user = await db.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json().catch(() => ({}));
    const mobile = String(body?.mobile_number || "").trim();
    if (!/^\d{10}$/.test(mobile)) {
      return Response.json({ found: false, error: "Invalid mobile number" }, { status: 400 });
    }
    if (mobile === String(user.mobile_number || "")) {
      return Response.json({ found: false, error: "Referrer cannot be yourself" });
    }
    if (BLOCKED_MOBILE === mobile) {
      return Response.json({ found: false, error: "This number cannot be used as a referrer" });
    }
    const referrers = await db.asServiceRole.entities.User.filter({ mobile_number: mobile });
    if (referrers && referrers.length > 0) {
      const r = referrers[0];
      return Response.json({ found: true, name: r.display_name || r.full_name || "" });
    }
    return Response.json({ found: false });
  } catch (error) {
    return Response.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
__name(verifyReferrer_default, "default");

// src/index.js
var functions = {
  exportToGoogleSheet: exportToGoogleSheet_exports,
  generateLandingPage: generateLandingPage_exports,
  getReferralDashboard: getReferralDashboard_exports,
  lookupPincode: lookupPincode_exports,
  sendAppUpdate: sendAppUpdate_exports,
  sendLimitAssignedEmail: sendLimitAssignedEmail_exports,
  sendLoanEmail: sendLoanEmail_exports,
  sendPromotionalEmail: sendPromotionalEmail_exports,
  sendRepaymentReminders: sendRepaymentReminders_exports,
  submitKyc: submitKyc_exports,
  submitPartnerRequest: submitPartnerRequest_exports,
  submitRepaymentProof: submitRepaymentProof_exports,
  systemHealthCheck: systemHealthCheck_exports,
  verifyReferrer: verifyReferrer_exports
};
var json = /* @__PURE__ */ __name((body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } }), "json");
var src_default = {
  async fetch(request, env2) {
    const url = new URL(request.url);
    try {
      if (!url.pathname.startsWith("/api/")) {
        if (env2.ASSETS) return env2.ASSETS.fetch(request);
        return json({ error: "Not found" }, 404);
      }
      return await handleApi(request, env2, url);
    } catch (error) {
      const status = error.status || 500;
      if (status >= 500) console.error(error);
      return json({ error: error.message || "Server error" }, status);
    }
  },
  // Nightly reminder run (see "triggers" in wrangler.jsonc).
  async scheduled(_event, env2, ctx) {
    const user = { id: "scheduler", role: "admin" };
    const db = createDbClient(env2, { user, serviceRole: true });
    const request = new Request("https://internal/functions/sendRepaymentReminders", { method: "POST", body: "{}" });
    await sendRepaymentReminders_default(request, { db, env: env2, user });
    ctx.waitUntil(Promise.resolve());
  }
};
async function handleApi(request, env2, url) {
  const parts = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  const method = request.method;
  if (parts[0] === "health") return json({ ok: true, time: (/* @__PURE__ */ new Date()).toISOString() });
  if (parts[0] === "auth") return handleAuth(request, env2, parts.slice(1));
  if (parts[0] === "files") return handleFiles(request, env2, parts.slice(1));
  if (parts[0] === "entities") return handleEntities(request, env2, url, parts.slice(1));
  if (parts[0] === "functions") {
    const handler = functions[parts[1]];
    if (!handler) throw httpError2(404, `Unknown function: ${parts[1]}`);
    const user = await currentUser(env2, request);
    const db = createDbClient(env2, { user });
    return handler.default(request, { db, env: env2, user });
  }
  throw httpError2(404, "Not found");
}
__name(handleApi, "handleApi");
async function handleAuth(request, env2, parts) {
  const method = request.method;
  const route = `${method} ${parts[0] || ""}${parts[1] ? `/${parts[1]}` : ""}`;
  if (route === "POST register") {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw httpError2(400, "Enter a valid email address");
    if (String(body.password || "").length < 8) throw httpError2(400, "Password must be at least 8 characters");
    if (await findUserByEmail(env2, email)) throw httpError2(400, "This email is already registered");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const row = await env2.DB.prepare(
      `INSERT INTO users (id, created_date, updated_date, email, full_name, role, status, kyc_status, password_hash, terms_accepted)
       VALUES (?, ?, ?, ?, ?, 'user', 'active', 'not_submitted', ?, 0) RETURNING *`
    ).bind(crypto.randomUUID(), now, now, email, String(body.full_name || "").trim(), await hashPassword(body.password)).first();
    const session = await createSession(publicUser(row), env2);
    return json({ access_token: session.token, user: publicUser(row) }, 200, { "Set-Cookie": session.cookie });
  }
  if (route === "POST login") {
    const body = await request.json().catch(() => ({}));
    const row = await findUserByEmail(env2, body.email);
    if (!row) throw httpError2(401, "Invalid email or password");
    if (!row.password_hash) {
      throw httpError2(403, "This account has no password yet. Use the password reset link to set one.");
    }
    if (!await verifyPassword(body.password, row.password_hash)) {
      throw httpError2(401, "Invalid email or password");
    }
    if (row.totp_enabled) {
      if (!body.totp_code) return json({ error: "Two-factor code required", code: "mfa_required" }, 401);
      const recoveryCodes = JSON.parse(row.recovery_codes || "[]");
      const recoveryHash = await hashRecoveryCode(body.totp_code);
      const recoveryIndex = recoveryCodes.indexOf(recoveryHash);
      if (!await verifyTotp(row.totp_secret, body.totp_code) && recoveryIndex < 0) {
        throw httpError2(401, "Invalid two-factor code");
      }
      if (recoveryIndex >= 0) {
        recoveryCodes.splice(recoveryIndex, 1);
        await env2.DB.prepare("UPDATE users SET recovery_codes = ? WHERE id = ?").bind(JSON.stringify(recoveryCodes), row.id).run();
      }
    }
    const session = await createSession(publicUser(row), env2);
    return json({ access_token: session.token, user: publicUser(row) }, 200, { "Set-Cookie": session.cookie });
  }
  if (route === "POST logout") {
    return json({ ok: true }, 200, { "Set-Cookie": clearedCookie });
  }
  if (route === "GET me") {
    return json({ user: await requireUser(env2, request) });
  }
  if (route === "PATCH me" || route === "PUT me") {
    const user = await requireUser(env2, request);
    const body = await request.json().catch(() => ({}));
    const store = new EntityStore(env2.DB, user);
    return json({ user: await store.update("User", user.id, body) });
  }
  if (route === "POST password-reset/request") {
    const body = await request.json().catch(() => ({}));
    const row = await findUserByEmail(env2, body.email);
    if (row) {
      const token = [...crypto.getRandomValues(new Uint8Array(32))].map((b) => b.toString(16).padStart(2, "0")).join("");
      const expires = new Date(Date.now() + 60 * 60 * 1e3).toISOString();
      await env2.DB.prepare("INSERT INTO password_resets (token, user_id, expires_at) VALUES (?, ?, ?)").bind(token, row.id, expires).run();
      const link = `${env2.APP_BASE_URL}/reset-password?token=${token}`;
      await sendMail(env2, {
        to: row.email,
        subject: "Reset your SDL password",
        html: `<p>Use this link within an hour to set a new password:</p><p><a href="${link}">${link}</a></p>`
      });
      if (!env2.RESEND_API_KEY) console.log(`[password-reset] ${row.email} -> ${link}`);
    }
    return json({ ok: true });
  }
  if (route === "POST password-reset/confirm") {
    const body = await request.json().catch(() => ({}));
    if (String(body.password || "").length < 8) throw httpError2(400, "Password must be at least 8 characters");
    const reset = await env2.DB.prepare("SELECT * FROM password_resets WHERE token = ?").bind(String(body.token || "")).first();
    if (!reset || reset.used_at || reset.expires_at < (/* @__PURE__ */ new Date()).toISOString()) {
      throw httpError2(400, "This reset link is invalid or has expired");
    }
    await env2.DB.prepare("UPDATE users SET password_hash = ?, updated_date = ? WHERE id = ?").bind(await hashPassword(body.password), (/* @__PURE__ */ new Date()).toISOString(), reset.user_id).run();
    await env2.DB.prepare("UPDATE password_resets SET used_at = ? WHERE token = ?").bind((/* @__PURE__ */ new Date()).toISOString(), reset.token).run();
    const row = await findUserRow(env2, reset.user_id);
    const session = await createSession(publicUser(row), env2);
    return json({ access_token: session.token, user: publicUser(row) }, 200, { "Set-Cookie": session.cookie });
  }
  if (route === "GET mfa/status") {
    const user = await requireUser(env2, request);
    const row = await findUserRow(env2, user.id);
    return json({ enabled: Boolean(row.totp_enabled) });
  }
  if (route === "POST mfa/enroll") {
    const user = await requireUser(env2, request);
    const secret = generateTotpSecret();
    await env2.DB.prepare("UPDATE users SET totp_secret = ?, totp_enabled = 0 WHERE id = ?").bind(secret, user.id).run();
    return json({ secret, otpauth_url: totpUri(secret, user.email) });
  }
  if (route === "POST mfa/activate") {
    const user = await requireUser(env2, request);
    const body = await request.json().catch(() => ({}));
    const row = await findUserRow(env2, user.id);
    if (!await verifyTotp(row.totp_secret, body.code)) throw httpError2(400, "That code is not valid");
    const codes = Array.from({ length: 8 }, () => randomCode());
    const hashes = await Promise.all(codes.map((code) => hashRecoveryCode(code)));
    await env2.DB.prepare("UPDATE users SET totp_enabled = 1, recovery_codes = ? WHERE id = ?").bind(JSON.stringify(hashes), user.id).run();
    return json({ enabled: true, recovery_codes: codes });
  }
  if (route === "POST mfa/disable") {
    const user = await requireUser(env2, request);
    const body = await request.json().catch(() => ({}));
    const row = await findUserRow(env2, user.id);
    if (!await verifyPassword(body.password, row.password_hash)) throw httpError2(401, "Wrong password");
    await env2.DB.prepare("UPDATE users SET totp_enabled = 0, totp_secret = NULL, recovery_codes = NULL WHERE id = ?").bind(user.id).run();
    return json({ enabled: false });
  }
  throw httpError2(404, "Not found");
}
__name(handleAuth, "handleAuth");
async function handleFiles(request, env2, parts) {
  if (!env2.FILES) throw httpError2(503, "File storage is not configured");
  if (request.method === "POST" && !parts[0]) {
    await requireUser(env2, request);
    const form = await request.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") throw httpError2(400, "Attach a file");
    const key = `${crypto.randomUUID()}-${String(file.name || "upload").replace(/[^\w.-]+/g, "_")}`;
    await env2.FILES.put(key, file.stream(), { httpMetadata: { contentType: file.type || "application/octet-stream" } });
    return json({ file_url: `${env2.APP_BASE_URL}/api/files/${key}`, file_name: file.name });
  }
  if (request.method === "GET" && parts[0]) {
    const object = await env2.FILES.get(decodeURIComponent(parts.join("/")));
    if (!object) throw httpError2(404, "File not found");
    return new Response(object.body, {
      headers: {
        "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  }
  throw httpError2(404, "Not found");
}
__name(handleFiles, "handleFiles");
async function handleEntities(request, env2, url, parts) {
  const name = parts[0];
  const sub = parts[1];
  const def = entityDef(name);
  const user = await requireUser(env2, request);
  const store = new EntityStore(env2.DB, user);
  const method = request.method;
  if (method === "GET" && !sub) {
    const query = parseQuery(url);
    const rows = await store.filter(name, query.filter, query.sort, query.limit);
    return json({ data: rows });
  }
  if (method === "GET" && sub === "count") {
    return json({ count: await store.count(name, parseQuery(url).filter) });
  }
  if (method === "POST" && sub === "aggregate") {
    const body = await request.json().catch(() => ({}));
    return json(await store.aggregate(name, body));
  }
  if (method === "POST" && sub === "bulk") {
    const body = await request.json().catch(() => ({}));
    return json({ data: await store.bulkCreate(name, body.items || []) });
  }
  if ((method === "PATCH" || method === "PUT") && sub === "bulk") {
    const body = await request.json().catch(() => ({}));
    return json({ data: await store.bulkUpdate(name, body.items || []) });
  }
  if (method === "POST" && sub === "delete-many") {
    const body = await request.json().catch(() => ({}));
    return json({ deleted: await store.deleteMany(name, body.query || body) });
  }
  if (method === "POST" && !sub) {
    const body = await request.json().catch(() => ({}));
    return json({ data: await store.create(name, body) });
  }
  if (method === "GET" && sub) {
    const row = await store.get(name, sub);
    if (!row) throw httpError2(404, `${name} not found`);
    return json({ data: row });
  }
  if ((method === "PATCH" || method === "PUT") && sub) {
    const body = await request.json().catch(() => ({}));
    return json({ data: await store.update(name, sub, body) });
  }
  if (method === "DELETE" && sub) {
    return json({ data: await store.delete(name, sub) });
  }
  if (def.rls === void 0) throw httpError2(404, "Not found");
  throw httpError2(405, "Method not allowed");
}
__name(handleEntities, "handleEntities");
function parseQuery(url) {
  const params = url.searchParams;
  let filter = {};
  if (params.get("q")) filter = JSON.parse(params.get("q"));
  return {
    filter,
    sort: params.get("sort") || "-created_date",
    limit: params.get("limit") ? Number(params.get("limit")) : void 0
  };
}
__name(parseQuery, "parseQuery");

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-9XuvRg/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-9XuvRg/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
