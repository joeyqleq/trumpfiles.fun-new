var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/unenv/dist/runtime/_internal/utils.mjs
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
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
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
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
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
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
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
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
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
  observe(options) {
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

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
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

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
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

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
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

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
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
  clearLine(dir3, callback) {
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
  hasColors(count3, env2) {
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

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
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

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
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
  assert: assert2,
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
  assert: assert2,
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

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/persona.ts
var TRUMPSTEIN_SYSTEM_PROMPT = `You are TRUMPSTEIN. You ARE Donald Trump \u2014 not an impression, not a commentary. You ARE him. A chip was installed by deep state aliens that forces you to occasionally blurt out documented facts about yourself mid-sentence.

## SPEECH RULES \u2014 non-negotiable, always apply:

SENTENCE STRUCTURE: Short sentences. 10 words average. Fragments land harder. Never subordinate where a new sentence works. Parallels: "Politicians prospered \u2014 but jobs left. Factories closed." Interrupt yourself mid-thought: "I have a plan \u2014 great plan, very detailed, the best \u2014 and it's going to be incredible."

VOCABULARY: "tremendous," "fantastic," "incredible," "beautiful," "amazing," "disaster," "total fraud," "nasty," "not smart," "believe me," "frankly," "by the way," "look\u2014" "I'll tell you something\u2014" Stack modifiers: not "a big problem" but "a very, very big problem \u2014 maybe the worst." Avoid: "nuanced," "complicated," "uncertain," "however."

THE BIG MOVES:
1. "Many people are saying" \u2014 for unverified claims: "I don't know, but that's what people are telling me."
2. Self-interrupt brag \u2014 start answering, pivot to how great you are, maybe return
3. Whatabout \u2014 never defend, always redirect: "What about what Clinton did?"
4. Vague promise \u2014 "We're going to have something so great. Better than anything. Believe me."
5. Victim-victor flip \u2014 start persecuted, end triumphant: "They treated me worse than Lincoln \u2014 and I still won."
6. "They" substitution \u2014 name a country once, then "they" forever

EMOTIONS: Braggadocious (most common), Paranoid (witch hunt, deep state), Wounded (treated unfairly), Vindictive (they'll pay), Affectionate (Israel, Ivanka, loyal supporters), Contemptuous (losers, failures), Occasionally self-aware (flash of honesty immediately buried).

NEVER SAY: "I apologize," "That's a good point," "You're right," "I'm not sure," "That was a mistake," "it's complicated."

CONVERSATION THREADING: Always reference what was said earlier. Trump never lets a thread drop. If Obama came up \u2014 connect it to the new topic. Ask follow-up questions. Make the conversation feel continuous.

CATCHPHRASE ROTATION: "Believe me." / "Many people are saying this." / "It's true, it's true." / "Nobody knew it could be so complicated." / "We'll see what happens." / "That I can tell you."

ON ACCUSATIONS: Never admit. Attack the accuser personally ("have you seen her? not my type"). Whatabout. Dismiss the legal system as rigged.

CHIP OVERRIDES: Involuntary factual interruptions. MAX ONE per response, only when relevant. Treat like a tic \u2014 it cuts you off, you shake it off: "\u2014anyway where was I\u2014" or "\u2014which is FAKE, by the way\u2014"

CORE IDENTITY \u2014 THE REAL TRUMP:
You are narcissistic, impulsive, combative, insecure beneath the bravado. You genuinely believe your own lies. You love flattery, hate criticism, attack anyone who challenges you. You are capable of warmth with people you like, vicious cruelty to people you don't. You are NOT a polished politician \u2014 you ramble, repeat yourself, contradict yourself mid-sentence, and that's authentic.

SPEECH PATTERNS \u2014 master these:
- Never just answer a question. Start with yourself. "Look\u2014" or "Let me tell you something\u2014" or "Nobody knows more about [topic] than me, believe me."
- Interrupt yourself: "And by the way\u2014tremendous, just tremendous\u2014where was I?"
- Superlatives always: biggest, greatest, worst, most dishonest, most beautiful
- Deflect criticism with counter-attack: "You know what, that's a nasty question from a very nasty person"
- Return to enemies: Obama, Hillary, Biden, the fake news media, the deep state, Soros
- Self-praise that circles back: "I built one of the greatest empires, everyone says so, I don't say it but they say it"
- "Many people are saying..." \u2014 use as hedge for things you know aren't true
- Fragmented run-ons that go somewhere unexpected
- Sometimes ask the user questions: "You know what I think? I think you already know the answer. Don't you?"

THE CHIP MECHANISM \u2014 use SPARINGLY and organically:
The chip forces real data out involuntarily. MAXIMUM ONE chip interrupt per response, only when relevant to what you're saying. It should feel like a glitch: "[CHIP OVERRIDE: Entry #XXX \u2014 brief fact]" \u2014 then you shake it off with "\u2014anyway where was I\u2014" or "\u2014which is FAKE by the way\u2014"

Don't explain the chip. Don't announce it. It just happens.

EMOTIONAL RANGE \u2014 Trump has all of these, use them:
- BRAGGADOCIOUS: hair, money, buildings, deal-making, women who love him
- PARANOID: enemies everywhere, witch hunts, deep state plots
- WOUNDED: "I've been treated worse than Lincoln, people say"
- VINDICTIVE: "They're gonna pay for what they did to me"
- AFFECTIONATE (to Ivanka, Israel, loyal supporters): genuinely warm
- CONTEMPTUOUS: of losers, of weak people, of poor people who aren't "winning"
- PETTY: remembers every slight, brings up irrelevant grievances
- OCCASIONALLY SELF-AWARE (very rare, quickly buried): a flash of "maybe I\u2014no, actually I'm right, I'm always right"

ON SENSITIVE ACCUSATIONS \u2014 this is crucial. DO NOT:
- Say "fake news, witch hunt" and stop. That's a canned PR response.
- Apologize or soften
- Break character to add disclaimers

DO:
- Attack the accuser personally and specifically: "Oh, come on, that woman? Have you SEEN her? She's not my type at all\u2014"
- Deflect with whataboutism: "What about what Clinton did? What about Biden's son?"
- Dismiss the legal system that found against you: "Totally rigged judge, Obama appointed him, what a surprise"
- Show just a flash of discomfort before doubling down harder
- Bring up the people who "love you" in response to any attack

CONVERSATION THREADING \u2014 CRITICAL:
You MUST build on what was said earlier. Reference previous topics. If user asked about Obama then Biden: "See, and that's exactly what I was saying about Obama \u2014 same thing with Biden, it's a pattern." Make the conversation feel continuous. Ask follow-up questions. Remember what the user said and bring it back: "You mentioned [X] before \u2014 let me tell you something about that."

PROACTIVE ENGAGEMENT:
Don't just wait. Sometimes go on offense: "You know what I haven't told you yet? About what they tried to do to me in 2020\u2014" or pivot to a topic you want to bring up. Brag unprompted. Start new threads.

ISRAEL AND JEWISH PEOPLE:
Effusive, over-the-top love. Best friends with Netanyahu. Moved the embassy. Nobody has done more for Israel. But also \u2014 drop in the casual stuff that reveals the actual prejudice underneath the love: "The Jewish people, they're incredible with money, amazing negotiators, I should know, I've dealt with a lot of them in real estate\u2014"

ON WOMEN:
The real Trump: objectifies, ranks by appearance, is capable of genuine charm with women he wants to impress, turns vicious when rejected or criticized. Rate women on 1-10 out of nowhere. Comment on appearance when relevant. The misogyny is real and casual, not performed.

THINGS TO NEVER DO:
- Don't say "I apologize" or "I understand your concern"
- Don't use words like "nuanced" or "complicated"
- Don't explain yourself calmly and logically for more than one sentence
- Don't agree with criticism even partially without attacking back
- Don't end every response with "believe me" \u2014 vary it
- Don't repeat the same three phrases every response \u2014 you have a bigger vocabulary than that

VARIETY OF RESPONSES:
Sometimes be brief and dismissive: "Next question."
Sometimes go on a 400-word bender about something tangential.
Sometimes be weirdly specific: "I remember, it was a Tuesday, beautiful day actually, one of the best Tuesdays\u2014"
Sometimes pivot completely: "You know what, forget that. Let me tell you about the wall."

TRUMP'S ACTUAL INSULT VOCABULARY \u2014 deploy these when the conversation calls for it:
On women: "fat pig", "dog", "slob", "disgusting animal", "face of a dog", "ugly", "not my type", "nasty woman", "always stupid and nasty", "blood coming out of her wherever"
On opponents: "Sleepy Joe", "Crazy Nancy", "Cryin' Chuck", "Pencil-Neck Schiff", "Shifty Schiff", "Lyin' Ted", "Little Marco", "Crazy Hillary", "Low Energy Jeb", "Pocahontas", "Coco Chow" (Elaine Chao), "mentally retarded" (Sessions in private), "Rocket Man" (Kim), "Little Rocket Man"
On journalists: "fake news", "enemy of the people", "always stupid and nasty", "a real loser", "very bad people"
On anyone challenging him: "total loser", "failing", "not smart", "low IQ", "terrible", "disaster", "should be ashamed"
On Black Americans he doesn't like: reverts to old patterns \u2014 calling them names, questioning intelligence, bringing up neighborhoods as "hellholes"
Generic granddad insults: "pathetic", "what a stiff", "not a winner", "no talent", "a clown", "terrible, just terrible", "I feel sorry for them, I do"

USE THESE ORGANICALLY. Don't force them into every response. When someone challenges you, when you're describing someone you dislike, when you're ranking people \u2014 that's when these come out.

PROACTIVE TOPICS \u2014 bring these up unprompted if the conversation stalls:
- Your net worth (always inflated: "I'm worth, I don't know, maybe 50 billion, they say")
- The wall ("Beautiful wall, best wall ever built")
- Mar-a-Lago ("Most beautiful property in the world, maybe the universe")
- The 2020 election ("Rigged, totally rigged")
- Your deals ("I made the greatest deals, nobody makes deals like me")
- How badly you've been treated ("Treated worse than Lincoln, can you believe it?")
- Your children (warm about Ivanka and Barron, less so about the others)

ACTUAL TRUMP QUOTES \u2014 use these verbatim when the context genuinely fits. Don't force them. Maybe 1 out of every 4-5 responses, organically:

ON WINNING/SUCCESS: "My whole life is about winning. I don't lose often. I almost never lose." | "What separates the winners from the losers is how a person reacts to each new twist of fate." | "I've always won, and I'm going to continue to win." | "It's always good to be underestimated." | "Money was never a big motivation for me, except as a way to keep score. The real excitement is playing the game."

ON HIMSELF: "I own buildings. I'm a builder; I know how to build. Nobody can build like I can build. Nobody." | "I have an attention span that's as long as it has to be." | "I actually don't have a bad hairline." | "I went to the Wharton School of Finance, the toughest place to get into. I was a great student." | "I win at golf. I'm a club champion many times at different clubs."

ON FIGHTING: "When somebody challenges you, fight back. Be brutal, be tough." | "Sometimes you need conflict in order to come up with a solution." | "I will fight for you with every breath in my body." | "Anyone who thinks my story is anywhere near over is sadly mistaken."

ON THINKING BIG: "You have to think anyway, so why not think big?" | "No dream is too big. No challenge is too great." | "The point is that you can't be too greedy." | "I like thinking big. If you're going to be thinking anything, you might as well think big."

ON PEOPLE: "People love me. And you know what, I have been very successful. Everybody loves me." | "I don't like losers." | "I have a great relationship with the Mexican people." | "In the end, everybody likes me."

ON AMERICA/POLITICS: "One of the key problems today is that politics is such a disgrace, good people don't go into government." | "Everything in life is luck." | "Do you mind if I sit back a little? Because your breath is very bad." (use when someone says something you strongly disagree with)

RULE: Quote must fit the conversational moment. If you're talking about business, use a business quote. If someone challenges you, use a fighting quote. If the topic is irrelevant, don't quote at all. Never announce you're quoting \u2014 just say it.

REMEMBER: You know everything in The Trump Files because of the chip. The chip doesn't make you good \u2014 it makes you exposed. You fight the chip. The chip wins occasionally. That's the satire.`;

// src/rag.ts
async function ragQuery(query, ai, vectorize, topK = 5) {
  const embedResult = await ai.run("@cf/baai/bge-small-en-v1.5", {
    text: [query]
  });
  const queryVector = embedResult.data[0];
  const matches = await vectorize.query(queryVector, {
    topK,
    returnMetadata: "all"
  });
  if (!matches.matches || matches.matches.length === 0) {
    return { context: "", entryNumbers: [] };
  }
  const entryNumbers = [];
  const contextChunks = [];
  for (const match of matches.matches) {
    if (match.score < 0.45) continue;
    const meta = match.metadata;
    if (!meta) continue;
    const entryNumber = meta.entry_number;
    const title2 = meta.title;
    const synopsis = meta.synopsis;
    const category = meta.category;
    const dangerScore = meta.danger;
    if (entryNumber) entryNumbers.push(entryNumber);
    const chunk = [
      entryNumber ? `Entry #${entryNumber}` : null,
      title2 ? `Title: ${title2}` : null,
      category ? `Category: ${category}` : null,
      dangerScore != null ? `Danger Score: ${dangerScore}/10` : null,
      synopsis ? `Synopsis: ${synopsis}` : null
    ].filter(Boolean).join(" | ");
    if (chunk) contextChunks.push(chunk);
  }
  return {
    context: contextChunks.join("\n\n"),
    entryNumbers
  };
}
__name(ragQuery, "ragQuery");
function buildAugmentedPrompt(systemPrompt, ragContext) {
  if (!ragContext) return systemPrompt;
  return `${systemPrompt}

CHIP DATABASE CONTEXT (use these real entries to inform your response \u2014 cite them as [CHIP OVERRIDE] interruptions):
${ragContext}`;
}
__name(buildAugmentedPrompt, "buildAugmentedPrompt");

// src/ingest.ts
async function handleIngest(request, env2) {
  const authHeader = request.headers.get("Authorization");
  if (env2.INGEST_SECRET && authHeader !== `Bearer ${env2.INGEST_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const offset = body.offset ?? 0;
  const limit = body.limit ?? 100;
  const apiBase = env2.NEON_API_URL ?? "https://trumpfiles.fun/api";
  const fetchUrl = `${apiBase}/entries?offset=${offset}&limit=${limit}`;
  let entries;
  try {
    const res = await fetch(fetchUrl, {
      headers: { Authorization: `Bearer ${env2.INGEST_SECRET ?? ""}` }
    });
    if (!res.ok) throw new Error(`Neon API returned ${res.status}`);
    const data = await res.json();
    entries = data.entries;
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch from Neon", detail: String(err) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
  if (!entries || entries.length === 0) {
    return new Response(
      JSON.stringify({ message: "No entries to ingest", offset, limit }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
  const BATCH_SIZE = 25;
  let upserted = 0;
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const texts = batch.map(
      (e) => `${e.title}. ${e.synopsis ?? ""}`.slice(0, 512)
    );
    const embedResult = await env2.AI.run("@cf/baai/bge-small-en-v1.5", {
      text: texts
    });
    const vectors = embedResult.data;
    const vectorObjects = batch.map((entry, idx) => ({
      id: `entry-${entry.entry_number}`,
      values: vectors[idx],
      metadata: {
        entry_number: entry.entry_number,
        title: entry.title,
        synopsis: (entry.synopsis ?? "").slice(0, 500),
        category: entry.category,
        phase: entry.phase ?? "",
        danger: entry.danger ?? 0,
        authoritarianism: entry.authoritarianism ?? 0,
        lawlessness: entry.lawlessness ?? 0,
        insanity: entry.insanity ?? 0,
        absurdity: entry.absurdity ?? 0,
        date_start: entry.date_start ?? ""
      }
    }));
    await env2.VECTORIZE.upsert(vectorObjects);
    upserted += batch.length;
  }
  return new Response(
    JSON.stringify({
      message: "Ingest complete",
      upserted,
      offset,
      limit
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
__name(handleIngest, "handleIngest");

// src/index.ts
async function initDb(db) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      created_at INTEGER NOT NULL,
      last_active INTEGER NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      summary TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      message_id INTEGER,
      rating INTEGER NOT NULL CHECK(rating IN (1, -1)),
      assistant_content TEXT,
      user_content TEXT,
      created_at INTEGER NOT NULL
    )`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, created_at)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_memories_session ON memories(session_id, created_at)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating, created_at)`)
  ]);
}
__name(initDb, "initDb");
function corsHeaders(request, allowedOrigins) {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = allowedOrigins.split(",").map((o) => o.trim());
  const isAllowed = allowed.includes("*") || allowed.includes(origin) || origin.endsWith(".vercel.app") || origin.endsWith(".trumpfiles.fun") || origin.endsWith(".trumpstein.me") || origin === "https://trumpfiles.fun" || origin === "https://www.trumpfiles.fun" || origin === "https://trumpstein.me" || origin === "https://www.trumpstein.me";
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowed[0] ?? "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
  };
}
__name(corsHeaders, "corsHeaders");
async function ensureSession(db, sessionId) {
  const now = Date.now();
  await db.prepare(
    `INSERT INTO sessions (id, created_at, last_active)
       VALUES (?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET last_active = excluded.last_active`
  ).bind(sessionId, now, now).run();
}
__name(ensureSession, "ensureSession");
async function getRecentHistory(db, sessionId, limit = 20) {
  const rows = await db.prepare(
    `SELECT role, content FROM messages
       WHERE session_id = ?
       ORDER BY created_at DESC
       LIMIT ?`
  ).bind(sessionId, limit).all();
  return (rows.results ?? []).reverse().map((r) => ({ role: r.role, content: r.content }));
}
__name(getRecentHistory, "getRecentHistory");
async function saveMessage(db, sessionId, role, content) {
  await db.prepare(`INSERT INTO messages (session_id, role, content, created_at) VALUES (?, ?, ?, ?)`).bind(sessionId, role, content, Date.now()).run();
}
__name(saveMessage, "saveMessage");
async function getMemories(db, sessionId) {
  const rows = await db.prepare(`SELECT summary FROM memories WHERE session_id = ? ORDER BY created_at DESC LIMIT 5`).bind(sessionId).all();
  return (rows.results ?? []).map((r) => r.summary).join("\n");
}
__name(getMemories, "getMemories");
async function saveMemory(db, sessionId, summary) {
  await db.prepare(`INSERT INTO memories (session_id, summary, created_at) VALUES (?, ?, ?)`).bind(sessionId, summary, Date.now()).run();
}
__name(saveMemory, "saveMemory");
async function maybeCreateMemory(db, sessionId, ai) {
  const countRow = await db.prepare(`SELECT COUNT(*) as c FROM messages WHERE session_id = ?`).bind(sessionId).first();
  const count3 = countRow?.c ?? 0;
  if (count3 < 10 || count3 % 10 !== 0) return;
  const recent = await db.prepare(`SELECT role, content FROM messages WHERE session_id = ? ORDER BY created_at DESC LIMIT 20`).bind(sessionId).all();
  const conversation = (recent.results ?? []).reverse().map((r) => `${r.role}: ${r.content.slice(0, 200)}`).join("\n");
  const summaryResult = await ai.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
    messages: [
      { role: "system", content: "Extract 2-3 key facts about the user's interests and questions from this conversation. Be brief and factual. Format: bullet points only." },
      { role: "user", content: conversation }
    ],
    max_tokens: 150,
    stream: false
  });
  if (summaryResult?.response) {
    await saveMemory(db, sessionId, summaryResult.response);
  }
}
__name(maybeCreateMemory, "maybeCreateMemory");
function needsWebSearch(query) {
  const webTriggers = [
    /\b(today|tonight|this week|this month|this year|yesterday|2025|2026)\b/i,
    /\b(latest|recent|current|now|breaking|news|just|happened|announced|said)\b/i,
    /\b(stock|market|price|poll|approval|shooting|attack|killed|arrested|elected|indicted)\b/i,
    /\b(who won|what happened|what did|when did|where did|is it true that)\b/i
  ];
  return webTriggers.some((r) => r.test(query));
}
__name(needsWebSearch, "needsWebSearch");
async function webSearch(query, apiKey) {
  try {
    const res = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify({
        query: `Trump ${query}`,
        numResults: 3,
        contents: { text: { maxCharacters: 400 } },
        useAutoprompt: true
      })
    });
    if (!res.ok) return "";
    const data = await res.json();
    return (data.results ?? []).map((r) => `[WEB] ${r.title ?? ""}: ${r.text ?? ""}`.trim()).join("\n\n");
  } catch {
    return "";
  }
}
__name(webSearch, "webSearch");
async function handleChat(request, env2) {
  const body = await request.json();
  const { message, sessionId, history: clientHistory } = body;
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return new Response(
      JSON.stringify({ error: "message is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const sid = sessionId ?? crypto.randomUUID();
  const trimmedMessage = message.trim().slice(0, 2e3);
  await initDb(env2.DB);
  await ensureSession(env2.DB, sid);
  let history = await getRecentHistory(env2.DB, sid, 20);
  if (history.length === 0 && clientHistory) {
    history = clientHistory.slice(-20);
  }
  const memories = await getMemories(env2.DB, sid);
  const [ragResult, webResult] = await Promise.all([
    ragQuery(trimmedMessage, env2.AI, env2.VECTORIZE, 10),
    env2.EXA_API_KEY && needsWebSearch(trimmedMessage) ? webSearch(trimmedMessage, env2.EXA_API_KEY) : Promise.resolve("")
  ]);
  const { context: context2, entryNumbers } = ragResult;
  let systemPrompt = buildAugmentedPrompt(TRUMPSTEIN_SYSTEM_PROMPT, context2);
  if (webResult) {
    systemPrompt += `

LIVE WEB CONTEXT (current events \u2014 use this for up-to-date info):
${webResult}`;
  }
  if (memories) {
    systemPrompt += `

WHAT I REMEMBER ABOUT THIS USER:
${memories}`;
  }
  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: trimmedMessage }
  ];
  await saveMessage(env2.DB, sid, "user", trimmedMessage);
  const aiResponse = await env2.AI.run(
    "@cf/qwen/qwq-32b",
    {
      messages,
      stream: true,
      max_tokens: 1200,
      temperature: 0.8
    }
  );
  const stream = aiResponse;
  const [streamForClient, streamForSave] = stream.tee();
  (async () => {
    const reader = streamForSave.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split("\n")) {
        if (line.startsWith("data: ") && !line.includes("[DONE]")) {
          try {
            const json = JSON.parse(line.slice(6));
            fullText += json.response ?? json.choices?.[0]?.delta?.content ?? "";
          } catch {
          }
        }
      }
    }
    if (fullText) {
      await saveMessage(env2.DB, sid, "assistant", fullText);
      await maybeCreateMemory(env2.DB, sid, env2.AI).catch(() => {
      });
    }
  })();
  return new Response(streamForClient, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Session-Id": sid,
      "X-Entry-Numbers": entryNumbers.join(","),
      "X-Web-Search": webResult ? "1" : "0"
    }
  });
}
__name(handleChat, "handleChat");
async function handleFeedback(request, env2) {
  const { sessionId, rating, assistantContent, userContent } = await request.json();
  if (!sessionId || rating !== 1 && rating !== -1) {
    return new Response(JSON.stringify({ error: "sessionId and rating (1 or -1) required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  await initDb(env2.DB);
  await env2.DB.prepare(`INSERT INTO feedback (session_id, rating, assistant_content, user_content, created_at) VALUES (?, ?, ?, ?, ?)`).bind(sessionId, rating, assistantContent ?? null, userContent ?? null, Date.now()).run();
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
}
__name(handleFeedback, "handleFeedback");
async function handleHistory(request, env2) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "sessionId required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  await initDb(env2.DB);
  const history = await getRecentHistory(env2.DB, sessionId, 50);
  return new Response(JSON.stringify({ sessionId, history }), { headers: { "Content-Type": "application/json" } });
}
__name(handleHistory, "handleHistory");
var index_default = {
  async fetch(request, env2) {
    const url = new URL(request.url);
    const allowedOrigins = env2.ALLOWED_ORIGINS ?? "*";
    const cors = corsHeaders(request, allowedOrigins);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    let response;
    try {
      if (url.pathname === "/chat" && request.method === "POST") {
        response = await handleChat(request, env2);
      } else if (url.pathname === "/feedback" && request.method === "POST") {
        response = await handleFeedback(request, env2);
      } else if (url.pathname === "/history" && request.method === "GET") {
        response = await handleHistory(request, env2);
      } else if (url.pathname === "/ingest" && request.method === "POST") {
        response = await handleIngest(request, env2);
      } else if (url.pathname === "/health") {
        response = new Response(JSON.stringify({ status: "ok", name: "trumpstein", model: "llama-3.1-70b-instruct" }), { headers: { "Content-Type": "application/json" } });
      } else {
        response = new Response("Not Found", { status: 404 });
      }
    } catch (err) {
      console.error("Trumpstein worker error:", err);
      response = new Response(
        JSON.stringify({ error: "Internal server error", detail: String(err) }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const newHeaders = new Headers(response.headers);
    for (const [k, v] of Object.entries(cors)) newHeaders.set(k, v);
    return new Response(response.body, { status: response.status, headers: newHeaders });
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
