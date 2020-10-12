/*content of wemass remote js(not minified)*/
(function() {
  window.__wmass = window.__wmass || {};
  window.__wmass.dmp = window.__wmass.dmp || {};
  let
    permutiveScript = document.createElement("script"),
    permutivemethods = ["addon", "identify", "track", "trigger", "query", "segment", "segments", "ready", "on", "once", "user", "consent"];
  ! function(n, e, o, r, i) {
    if (!e) {
      e = e || {}, window.permutive = e, e.q = [], e.config = i || {}, e.config.projectId = o, e.config.apiKey = r, e.config.environment = e.config.environment || "production";
      for (var t = permutivemethods, c = 0; c < t.length; c++) {
        var f = t[c];
        e[f] = function(n) {
          return function() {
            var o = Array.prototype.slice.call(arguments, 0);
            e.q.push({
              functionName: n,
              arguments: o
            })
          }
        }(f)
      }
    }
  }(document, window.permutive, "<PROJECT_ID>", "<PUBLIC_API_KEY>", {});

  for (var pMethod of permutivemethods) {
    if (!window.__wmass.dmp[pMethod]) {
      /*cloning all permutive methods*/
      window.__wmass.dmp = window.permutive;
    }
  }
  permutiveScript.setAttribute("async", "async");
  permutiveScript.setAttribute("src", "https://cdn.permutive.com/><PROJECT_ID>-web.js");
  (document.head || document.body).appendChild(permutiveScript);
})();

/**this will go on the page */

__wmass.dmp.addon('web', {
  page: {
    type: "<STRING>",
    content: {
      categories: ["<LIST>", "<OF>", "<STRINGS>"]
    },
    article: {
      id: "<STRING>",
      title: "<STRING>",
      description: "<STRING>",
      topics: ["<LIST>", "<OF>", "<STRINGS>"],
      authors: ["<LIST>", "<OF>", "<STRINGS>"],
      modifiedAt: "< DATE / TIME > ",
      publishedAt: "< DATE / TIME > ",
      premium: "< BOOLEAN >",
      wordCount: "< INTEGER >",
      paragraphCount: "< INTEGER >",
      section: "<STRING>",
      subsection: "<STRING>"
    },
    user: {
      type: "<STRING>",
      age: "< INTEGER >",
      gender: "<STRING>"
    }
  }
});
