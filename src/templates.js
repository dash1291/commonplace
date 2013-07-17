(function() {var templates = {};
templates["debug.html"] = (function() {function root(env, context, frame, runtime) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<section class=\"main infobox prose\">\n  <div>\n    <style>\n      dt {\n        clear: left;\n        float: left;\n      }\n      dd {\n        float: left;\n      }\n    </style>\n    <h2>Debug</h2>\n    <p>\n      <button class=\"button\" id=\"submit-debug\">Submit logs</button>\n    </p>\n\n    <p>\n      <button class=\"button\" id=\"clear-localstorage\">Clear <code>localStorage</code></button>\n    </p>\n\n    <h3>Site Settings</h3>\n\n    <dl class=\"site-settings c\">\n      ";
frame = frame.push();
var t_2 = (lineno = 23, colno = 36, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "settings")),"items", env.autoesc), "settings[\"items\"]", []));
if(t_2 !== undefined) {for(var t_1=0; t_1 < t_2.length; t_1++) {
var t_3 = t_2[t_1];
frame.set("setting", t_3);
output += "\n        <dt>";
output += runtime.suppressValue(runtime.memberLookup((t_3),0, env.autoesc), env.autoesc);
output += "</dt>\n        <dd>";
output += runtime.suppressValue(runtime.memberLookup((t_3),1, env.autoesc) || "––", env.autoesc);
output += "</dd>\n      ";
}
}frame = frame.pop();
output += "\n    </dl>\n\n    <h3>User Settings</h3>\n\n    <dl class=\"user-settings c\">\n      ";
frame = frame.push();
var t_5 = (lineno = 32, colno = 47, runtime.callWrap(runtime.memberLookup(((lineno = 32, colno = 39, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"get_settings", env.autoesc), "user[\"get_settin\"]", []))),"items", env.autoesc), "the return value of (user[\"get_settin\"])[\"items\"]", []));
if(t_5 !== undefined) {for(var t_4=0; t_4 < t_5.length; t_4++) {
var t_6 = t_5[t_4];
frame.set("setting", t_6);
output += "\n        <dt>";
output += runtime.suppressValue(runtime.memberLookup((t_6),0, env.autoesc), env.autoesc);
output += "</dt>\n        <dd>";
output += runtime.suppressValue(runtime.memberLookup((t_6),1, env.autoesc) || "––", env.autoesc);
output += "</dd>\n      ";
}
}frame = frame.pop();
output += "\n    </dl>\n\n    <h3>Capabilities</h3>\n\n    <dl class=\"capabilities c\">\n      ";
frame = frame.push();
var t_8 = (lineno = 41, colno = 36, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "capabilities")),"items", env.autoesc), "capabilities[\"items\"]", []));
if(t_8 !== undefined) {for(var t_7=0; t_7 < t_8.length; t_7++) {
var t_9 = t_8[t_7];
frame.set("cap", t_9);
output += "\n        <dt>";
output += runtime.suppressValue(runtime.memberLookup((t_9),0, env.autoesc), env.autoesc);
output += "</dt>\n        <dd>";
output += runtime.suppressValue(runtime.memberLookup((t_9),1, env.autoesc), env.autoesc);
output += "</dd>\n      ";
}
}frame = frame.pop();
output += "\n    </dl>\n\n    <h3>Cache</h3>\n\n    <pre id=\"cache-inspector\"></pre>\n\n    <ul class=\"cache-menu\">\n      ";
frame = frame.push();
var t_11 = (lineno = 52, colno = 26, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "cache")),"keys", env.autoesc), "cache[\"keys\"]", []));
if(t_11 !== undefined) {for(var t_10=0; t_10 < t_11.length; t_10++) {
var t_12 = t_11[t_10];
frame.set("k", t_12);
output += "\n        <li><a href=\"#\" data-url=\"";
output += runtime.suppressValue(t_12, env.autoesc);
output += "\">";
output += runtime.suppressValue((lineno = 53, colno = 46, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "filter"), "filter", [t_12])), env.autoesc);
output += "</a></li>\n      ";
}
}frame = frame.pop();
output += "\n    </ul>\n\n    <h3>Recent Logs</h3>\n    <ol class=\"debug-log\">\n      ";
frame = frame.push();
var t_14 = runtime.contextOrFrameLookup(context, frame, "recent_logs");
if(t_14 !== undefined) {for(var t_13=0; t_13 < t_14.length; t_13++) {
var t_15 = t_14[t_13];
frame.set("entry", t_15);
output += "\n        <li>";
frame = frame.push();
var t_17 = t_15;
if(t_17 !== undefined) {for(var t_16=0; t_16 < t_17.length; t_16++) {
var t_18 = t_17[t_16];
frame.set("piece", t_18);
output += runtime.suppressValue(t_18, env.autoesc);
output += " ";
}
}frame = frame.pop();
output += "</li>\n      ";
}
}frame = frame.pop();
output += "\n    </ol>\n\n    <h3>Persistent Logs</h3>\n    ";
frame = frame.push();
var t_20 = (lineno = 65, colno = 48, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "persistent_logs")),"items", env.autoesc), "persistent_logs[\"items\"]", []));
if(t_20 !== undefined) {var t_19;
if (runtime.isArray(t_20)) {
for (t_19=0; t_19 < t_20.length; t_19++) {
var t_21 = t_20[t_19][0]
frame.set("log_type", t_20[t_19][0]);
var t_22 = t_20[t_19][1]
frame.set("logs", t_20[t_19][1]);
output += "\n      <h4>";
output += runtime.suppressValue(t_21, env.autoesc);
output += "</h4>\n      <ol class=\"debug-log\">\n        ";
frame = frame.push();
var t_24 = t_22;
if(t_24 !== undefined) {for(var t_23=0; t_23 < t_24.length; t_23++) {
var t_25 = t_24[t_23];
frame.set("entry", t_25);
output += "\n          <li>";
frame = frame.push();
var t_27 = t_25;
if(t_27 !== undefined) {for(var t_26=0; t_26 < t_27.length; t_26++) {
var t_28 = t_27[t_26];
frame.set("piece", t_28);
output += runtime.suppressValue(t_28, env.autoesc);
output += " ";
}
}frame = frame.pop();
output += "</li>\n        ";
}
}frame = frame.pop();
output += "\n      </ol>\n    ";
}
} else {
t_19 = -1;
for(var t_29 in t_20) {
t_19++;
var t_30 = t_20[t_29];
frame.set("log_type", t_29);
frame.set("logs", t_30);
output += "\n      <h4>";
output += runtime.suppressValue(t_29, env.autoesc);
output += "</h4>\n      <ol class=\"debug-log\">\n        ";
frame = frame.push();
var t_32 = t_30;
if(t_32 !== undefined) {for(var t_31=0; t_31 < t_32.length; t_31++) {
var t_33 = t_32[t_31];
frame.set("entry", t_33);
output += "\n          <li>";
frame = frame.push();
var t_35 = t_33;
if(t_35 !== undefined) {for(var t_34=0; t_34 < t_35.length; t_34++) {
var t_36 = t_35[t_34];
frame.set("piece", t_36);
output += runtime.suppressValue(t_36, env.autoesc);
output += " ";
}
}frame = frame.pop();
output += "</li>\n        ";
}
}frame = frame.pop();
output += "\n      </ol>\n    ";
}
}
}frame = frame.pop();
output += "\n  </div>\n</section>\n";
return output;
} catch (e) {
  runtime.handleError(e, lineno, colno);
}
}
return {
root: root
};
})();
templates["tests.html"] = (function() {function root(env, context, frame, runtime) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<section class=\"main infobox\">\n    <div>\n        <h2>Unit Tests</h2>\n        <progress value=\"0\"></progress>\n        <table>\n            <tr>\n                <th>Started</th>\n                <th>Passed</th>\n                <th>Failed</th>\n            </tr>\n            <tr>\n                <td id=\"c_started\">0</td>\n                <td id=\"c_passed\">0</td>\n                <td id=\"c_failed\">0</td>\n            </tr>\n        </table>\n        <ol class=\"tests\"></ol>\n    </div>\n</section>\n\n<script type=\"text/javascript\" src=\"/tests/cache.js\"></script>\n<script type=\"text/javascript\" src=\"/tests/l10n.js\"></script>\n<script type=\"text/javascript\" src=\"/tests/models.js\"></script>\n<script type=\"text/javascript\" src=\"/tests/requests.js\"></script>\n<script type=\"text/javascript\" src=\"/tests/utils.js\"></script>\n";
return output;
} catch (e) {
  runtime.handleError(e, lineno, colno);
}
}
return {
root: root
};
})();
define("templates", ["nunjucks", "helpers"], function(nunjucks) {
    nunjucks.env = new nunjucks.Environment([], {autoescape: true});
    nunjucks.env.registerPrecompiled(templates);
    nunjucks.templates = templates;
    console.log("Templates loaded");
    return nunjucks;
});
})();