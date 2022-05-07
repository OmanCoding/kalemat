const Sentry = require("@sentry/browser");
const { BrowserTracing } = require("@sentry/tracing");
const mixpanel = require("mixpanel-browser");

global.window.Sentry = Sentry;
global.window.BrowserTracing = BrowserTracing;
global.window.mixpanel = mixpanel;
