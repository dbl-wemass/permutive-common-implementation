(function () {
  /**
   * aqui van todas las variables globales de la ejecucion
   */
  //Crea las variables globales que referencian el window top y detecta si se está dentro de un iframe.
  let windowTop,
    windowSelf = window,
    voyEnTop = true,
    esteIframeId = false,
    esteIframe = false,
    esSafeFrame = false,
    testMode = {},
    logInfo = function () {},
    logLog = function () {},
    logWarn = function () {},
    logError = function () {};
  try {
    windowTop = window.top;
  } catch (e) {
    voyEnTop = false;
    windowTop = windowSelf;
  }
  if (!windowTop["__wmass"]) windowTop["__wmass"] = {};
  let permutiveProjectId = "__%permutive_project_id%__",
    permutivePublicApiKey = "__%permutive_public_api_key%__",
    permutiveExtraConfig = {},
    loggerPrefix = `%cDMP`,
    loggerStyle = `display: inline-block; color: #fff; background: #658; padding: 1px 4px; border-radius: 3px;`,
    testModeTestables = {
      forceDmpId: {
        anyof: "string",
      },
      forceDmpPKey: {
        anyof: "string",
      },
    },
    testModeCookieName = "__%tagNameMd5%__";
  //=require wemass-modules/modules/wemassObject/windowobject.js
  /**
   * @variables en alpha requeridas
   * loggerPrefix=`%cDMP`,
   * loggerStyle=  `display: inline-block; color: #fff; background: #658; padding: 1px 4px; border-radius: 3px;`,
   */
  try {
    if (!windowTop["__wmass"].logger) {
      windowTop["__wmass"].logger = (
        decorationPrefixName = "",
        decorationPrefixStyle = ""
      ) => {
        let logInfo,
          logInfoBuffer = [],
          logLog,
          logLogBuffer = [],
          logWarn,
          logWarnBuffer = [],
          logError,
          logErrorBuffer = [],
          getDate = () => {
            let date = new Date(),
              mili = date.getMilliseconds().toString();
            return `${date.toLocaleTimeString()}:${mili.padStart(4, "0")}`;
          },
          getLogLevel = (level) => {
            let validLogs = { info: 1, log: 2, warn: 3, error: 4 },
              logLevel = validLogs[testMode.enableLog];
            return testMode.enableLog === true || logLevel >= level;
          };
        logInfo = logLog = logWarn = logError = function () {};
        if (windowTop.console) {
          let decorationBaseName = "%cWemass",
            decorationBaseStyle =
              "display: inline-block; color: #fff; background: #92c01f; padding: 1px 4px; border-radius: 3px;",
            decorationLabels = `${decorationBaseName}${decorationPrefixName}`,
            decorationStyles = [decorationBaseStyle, decorationPrefixStyle];
          if (windowTop.console.info) {
            logInfo = function () {
              let hayLog = getLogLevel(1),
                _decorationLabels = decorationLabels + "%c INFO",
                _decorationStyles = [
                  ...decorationStyles,
                  "display: inline-block; color: #111 background: #e3e3e3; padding: 1px 4px; border-radius: 3px;",
                ],
                leargs = Array.prototype.slice.call(arguments),
                leOutput = [
                  _decorationLabels,
                  ..._decorationStyles,
                  getDate(),
                  ...leargs,
                ];
              if (hayLog) {
                while (logInfoBuffer.length > 0) logInfoBuffer.shift()();
                console.info.apply(console, leOutput);
              } else
                logInfoBuffer.push(console.info.bind(console, ...leOutput));
            };
          }
          if (windowTop.console.log) {
            logLog = function () {
              let hayLog = getLogLevel(2),
                _decorationLabels = decorationLabels + "%c LOG",
                _decorationStyles = [
                  ...decorationStyles,
                  "display: inline-block; color: #111 background: #3c3c3b; padding: 1px 4px; border-radius: 3px;",
                ],
                leargs = Array.prototype.slice.call(arguments),
                leOutput = [
                  _decorationLabels,
                  ..._decorationStyles,
                  getDate(),
                  ...leargs,
                ];
              if (hayLog) {
                while (logLogBuffer.length > 0) logLogBuffer.shift()();
                console.log.apply(console, leOutput);
              } else logLogBuffer.push(console.log.bind(console, ...leOutput));
            };
          }
          if (windowTop.console.warn) {
            logWarn = function () {
              let hayLog = getLogLevel(3),
                _decorationLabels = decorationLabels + "%c WARN",
                _decorationStyles = [
                  ...decorationStyles,
                  "display: inline-block; color: #111 background: orange; padding: 1px 4px; border-radius: 3px;",
                ],
                leargs = Array.prototype.slice.call(arguments),
                leOutput = [
                  _decorationLabels,
                  ..._decorationStyles,
                  getDate(),
                  ...leargs,
                ];
              if (hayLog) {
                while (logWarnBuffer.length > 0) logWarnBuffer.shift()();
                console.warn.apply(console, leOutput);
              } else
                logWarnBuffer.push(console.warn.bind(console, ...leOutput));
            };
          }
          if (windowTop.console.error) {
            logError = function () {
              let hayLog = getLogLevel(4),
                _decorationLabels = decorationLabels + "%c ERROR",
                _decorationStyles = [
                  ...decorationStyles,
                  "display: inline-block; color: #111 background: red; padding: 1px 4px; border-radius: 3px;",
                ],
                leargs = Array.prototype.slice.call(arguments),
                leOutput = [
                  _decorationLabels,
                  ..._decorationStyles,
                  getDate(),
                  ...leargs,
                ];
              if (hayLog) {
                while (logErrorBuffer.length > 0) logErrorBuffer.shift()();
                console.error.apply(console, leOutput);
              } else
                logErrorBuffer.push(console.error.bind(console, ...leOutput));
            };
          }
        }
        return [logInfo, logLog, logWarn, logError];
      };
    }
    [logInfo, logLog, logWarn, logError] = windowTop["__wmass"].logger(
      loggerPrefix,
      loggerStyle
    );
  } catch (e) {
    //nda
  }

  //=require wemass-modules/modules/wemassObject/windowobject.js
  let readCookie = (cookieName) => {
    let busqueda = `${cookieName}=`,
      cookies = windowTop.document.cookie.split(";");
    for (let cookie of cookies) {
      while (cookie.charAt(0) === " ")
        cookie = cookie.substring(1, cookie.length);
      if (cookie.indexOf(busqueda) === 0)
        return cookie.substring(busqueda.length, cookie.length);
    }
    return null;
  };
  //=require wemass-modules/modules/wemassObject/windowobject.js
  /**
   * Detects real type of the objects like 'Array()', `new Number(1)`, `new Boolean(true)`, etc
   *
   * @param   {mixed} obj - object to get type of
   * @param   {object} [options] - object to get type of
   * @returns {string} precise type
   */
  let preciseTypeOf = (obj, options) => {
    var type,
      stamp = Object.prototype.toString.call(obj);

    options = options || {};

    if (!type && obj === undefined) type = "undefined";
    if (!type && obj === null) type = "null";

    if (
      !type &&
      obj.constructor &&
      typeof obj.constructor.isBuffer == "function" &&
      obj.constructor.isBuffer(obj)
    )
      type = "buffer";

    if (!type && typeof window == "object" && obj === window) type = "global";
    if (!type && typeof global == "object" && obj === global) type = "global";

    if (!type && typeof obj == "number" && isNaN(obj)) type = "nan";
    if (
      !type &&
      typeof obj == "object" &&
      stamp == "[object Number]" &&
      isNaN(obj)
    )
      type = "nan";

    if (!type && typeof obj == "object" && stamp.substr(-6) == "Event]")
      type = "event";
    if (!type && stamp.substr(0, 12) == "[object HTML") type = "html";
    if (!type && stamp.substr(0, 12) == "[object Node") type = "html";

    // last resort
    if (!type) type = stamp.match(/\[object\s*([^\]]+)\]/)[1].toLowerCase();

    // be even more precise by reporting "instance of" names
    // Note: only check objects that were created by constructors
    if (type == "object" && options.pojoOnly && obj.constructor) {
      // some constructors don't have names
      type = obj.constructor.name || "unknown";

      // preserve `object` response for POJOs
      if (type == "Object") type = "object";
    }

    return type;
  };
  let getUrlParams = () => {
    let prefix = "wmsstst",
      queryString = windowTop.location.search.replace("?", "");
    if (esSafeFrame && preciseTypeOf(windowTop.AMP_CONTEXT_DATA) === "object") {
      let outReferral = false,
        {
          sourceUrl = false,
          location: { href: ampHref = false } = {},
        } = windowTop.AMP_CONTEXT_DATA;
      if (preciseTypeOf(ampHref) === "string") outReferral = ampHref;
      else if (preciseTypeOf(sourceUrl) === "string") outReferral = sourceUrl;
      if (
        outReferral !== false &&
        outReferral.length > 0 &&
        outReferral.indexOf("?") !== -1
      )
        queryString = outReferral.split("?")[1];
    }
    if (queryString.indexOf(prefix) === -1) return {};
    let parameters = queryString.split("&"),
      output = {};
    for (let paramater of parameters) {
      if (paramater.indexOf(prefix) !== -1) {
        if (paramater === prefix) output[enableTestCreatives] = true;
        else {
          let [paramaterName, paramaterValue] = paramater
            .replace(`${prefix}.`, "")
            .split("=");
          if (paramaterName.indexOf("key.") === 0) {
            paramaterName = paramaterName.replace("key.", "");
            if (!output.keywords) output.keywords = {};
            if (!output.keywords[paramaterName])
              output.keywords[paramaterName] = [];
            if (output.keywords[paramaterName].indexOf(paramaterValue) === -1)
              output.keywords[paramaterName].push(paramaterValue);
          } else {
            if (paramaterValue === "true") paramaterValue = true;
            if (preciseTypeOf(paramaterValue) === "string") {
              if (!output[paramaterName])
                output[paramaterName] = paramaterValue;
              else {
                if (preciseTypeOf(output[paramaterName]) === "string")
                  output[paramaterName] = [output[paramaterName]];
                output[paramaterName].push(paramaterValue);
              }
            } else output[paramaterName] = paramaterValue;
          }
        }
      }
    }
    logInfo("parametros wemass detectados", output);
    return output;
  };
  let writeCookie = (valor, periodo, cookieId) => {
    /*Funcion que setea las cookies
     *valor:valor al que se va a setear la cookie
     *periodo: periodo para la cookie ej: 3M = tres minutos
     *cookieId: id de la cookie
     **/
    let date = new Date(),
      milisegundos = 1000,
      objetoAccion = {
        B: () => {
          /*borrar*/
          milisegundos *= 0;
        },
        M: (p) => {
          /*Minuto*/
          milisegundos *= 60 * p;
        },
        H: (p) => {
          /*Hora*/
          milisegundos *= 3600 * p;
        },
        D: (p) => {
          /*Dia*/
          milisegundos *= 86400 * p;
        },
        X: () => {
          /*la vida*/
          milisegundos *= 86400000;
        },
      };
    for (let contador = 0; contador < periodo.length; contador++) {
      if (periodo[contador] in objetoAccion)
        objetoAccion[periodo[contador]](
          parseInt(periodo.replace(periodo[contador], "")) || 1
        );
    }
    milisegundos += date.getTime();
    date.setTime(milisegundos);
    //GPT_$pub_LOG(valor,milisegundos,date);
    document.cookie = `${cookieId}=${valor}; path=/; domain=${
      location.hostname
    }; expires=${date.toUTCString()}; samesite=none; secure`;
  };
  //=require wemass-modules/modules/helpers/preciseTypeOf.js
  /**
     * @variables en alpha requeridas 
     * estModeTestables = {
          forceDmpId: {
            anyof: "string",
          },
          forceDmpPKey: {
            anyof: "string",
          },
        },
        testModeCookieName = "__%tagNameMd5%__";
     */
  try {
    if (!windowTop["__wmass"].testMode) {
      windowTop["__wmass"].testMode = function (
        setTestables = {},
        cookieName = "wmsstst"
      ) {
        let readTestMode = () => {
            let testValues = readCookie(cookieName);
            if (preciseTypeOf(testValues) === "string") {
              try {
                return JSON.parse(testValues);
              } catch (e) {
                console.log(e, `error > valor de wmsstst = ${testValues}`);
              }
            }
            return {};
          },
          setTestMode = (value) => {
            let cookiesToClean = [
              "raPreviewMode=0; Max-Age=0; path=/; samesite=None; domain=.richaudience.com; secure",
              `apn_prebid_debug=0; Max-Age=0; samesite=none; secure`,
            ];
            for (let cookieToClean of cookiesToClean) {
              document.cookie = cookieToClean;
            }
            if (value === false) writeCookie(value, "B", cookieName);
            else writeCookie(JSON.stringify(value), "H", cookieName);
          },
          mergeTestables = (testables) => {
            let outTests = {
              enableLog: {
                values: [true, "info", "log", "warn", "error"],
                cookie: true,
              },
            };
            //añadiendo nuevos test al testMode
            for (let testName in testables) {
              if (!outTests[testName]) outTests[testName] = testables[testName];
            }
            return outTests;
          },
          mergeParameters = (...ristraParams) => {
            let outParams = {};
            for (let parametros of ristraParams) {
              if (preciseTypeOf(parametros) === "object") {
                for (let parametro in parametros) {
                  if (!outParams[parametro])
                    outParams[parametro] = parametros[parametro];
                }
              }
            }
            return outParams;
          },
          enabledTests = mergeTestables(setTestables);
        return (argumentParameters = {}) => {
          if (argumentParameters === false) {
            setTestMode(false);
            return {};
          } else if (preciseTypeOf(argumentParameters) === "object") {
            let cookieParameters = readTestMode(),
              urlParameters = getUrlParams(),
              parameters = mergeParameters(
                argumentParameters,
                cookieParameters,
                urlParameters
              ),
              cookieValues = {},
              volatileValues = {};
            for (let parameter in parameters) {
              if (enabledTests[parameter]) {
                let este = false,
                  valule = parameters[parameter],
                  testFor = enabledTests[parameter],
                  { values, cookie = false, anyof } = testFor,
                  typeofValidValues = preciseTypeOf(values),
                  typeofAnyof = preciseTypeOf(anyof),
                  typeofValule = preciseTypeOf(valule);
                if (typeofAnyof === "string" && typeofValule === anyof) {
                  este = true;
                }
                switch (typeofValidValues) {
                  case "array":
                    if (values.indexOf(valule) > -1) este = true;
                    break;
                  case "boolean":
                    este = valule === true;
                  case "function":
                    este = values(valule);
                }
                if (este === true) {
                  volatileValues[parameter] = valule;
                  if (cookie === true) cookieValues[parameter] = valule;
                }
              }
            }
            if (Object.keys(cookieValues).length > 0) setTestMode(cookieValues);
            return volatileValues;
          }
        };
      };
    }
    testMode = new windowTop["__wmass"].testMode(
      testModeTestables,
      testModeCookieName
    )();
  } catch (e) {
    //do nothing
  }

  logLog("Loading Wemass DMP Tag __%tagName%__");
  let getWmssMethod = (pMethod) => {
    if (pMethod === "addon") {
      return function (tipo, data = {}, ...resto) {
        if (!data.page) data.page = {};
        let itemType = data.page.type;
        if (itemType === "noticia" && !data.page.classifications_watson)
          data.page.classifications_watson = {
            categories: "$alchemy_taxonomy",
            keywords: "$alchemy_keywords",
            sentiment: "$alchemy_document_sentiment",
          };
        logInfo(`Llamando a __wmass.dmp.addon con argumentos`, [
          tipo,
          data,
          ...resto,
        ]);
        windowTop.permutive[pMethod].apply(null, [tipo, data, ...resto]);
      };
    }
    return function () {
      logInfo(`Llamando a __wmass.dmp.${pMethod} con argumentos`, arguments);
      windowTop.permutive[pMethod].apply(null, arguments);
    };
  };
  //=require wemass-modules/modules/helpers/preciseTypeOf.js
  let createElemento = (nodeName, attributes = {}) => {
    let esString = preciseTypeOf(nodeName) === "string",
      xmlns = "http://www.w3.org/2000/svg";
    if (esString) {
      if (attributes.useNs)
        nodeName = document.createElementNS(xmlns, nodeName);
      else nodeName = document.createElement(nodeName);
    }
    if (typeof attributes != void 0)
      for (let attributeName in attributes)
        if (preciseTypeOf(attributeName) === "string") {
          let value = attributes[attributeName],
            typeofValue = preciseTypeOf(value);
          switch (attributeName) {
            case "T":
              /*añade texto al nodo*/
              nodeName.appendChild(document.createTextNode(value));
              break;
            case "com":
              /*añade un comentario al nodo*/
              nodeName.appendChild(document.createComment(value));
              break;
            case "Ct":
              /*Cambia el estilo inline al nodo*/
              nodeName.style.cssText = value;
              break;
            case "Cn":
              /*cambia la classname al nodo*/
              if (typeofValue === "string" || typeofValue === "array") {
                let allClases,
                  classText = [];
                if (typeofValue === "string") {
                  allClases = [value];
                } else if (typeofValue === "array") allClases = value;
                if (preciseTypeOf(allClases) === "array") {
                  for (let clase of allClases) {
                    if (preciseTypeOf(clase) === "string") {
                      if (clase.charAt(0) === ".") clase = clase.substr(1);
                      classText.push(clase);
                    }
                  }
                }
                if (classText.length > 0) nodeName.classList.add(...classText);
              }
              break;
            case "H":
              nodeName.innerHTML = value;
              break;
            case "St":
              /*se usa solo al crear nodos style, esto les pone el contenido interior.*/
              if (!!(windowSelf.attachEvent && !windowSelf.opera))
                nodeName.styleSheet.cssText = value;
              else
                createElemento(nodeName, {
                  T: value,
                });
              break;
            default:
              /*añade la propiedad al elemento*/
              if (attributeName !== "useNs") {
                if (attributes.useNs)
                  nodeName.setAttributeNS(null, attributeName, value);
                else nodeName.setAttribute(attributeName, value);
              }
              //nodeName[attributeName] = value;
              break;
          }
        }
    if (esString) return nodeName /*.cloneNode(!0)*/;
    return void 0;
  };
  let loadAsyncScript = (
    src = "about:blank",
    className = "asyncScript",
    leWindod = windowSelf
  ) => {
    let script = createElemento("script", {
      src,
      async: "async",
      Cn: [className],
    });
    (leWindod.document.body || leWindod.document.head).appendChild(script);
  };
  let initDmp = (
    permutiveDocument,
    permutiveObject,
    projectId,
    publicKey,
    permutiveConfig
  ) => {
    //only one DMP Initialization per page
    if (!windowTop["__wmass"].dmp) {
      if (
        preciseTypeOf(projectId) === "string" &&
        projectId.length > 0 &&
        preciseTypeOf(publicKey) === "string" &&
        publicKey.length > 0
      ) {
        logLog(`cargando dmp projectId: ${projectId}, key: ${publicKey}`);
        //preventing invalid config to be sent
        if (preciseTypeOf(permutiveExtraConfig) !== "object")
          permutiveExtraConfig = {};
        windowTop["__wmass"].dmp = windowTop["__wmass"].dmp || {};
        let permutiveMethods = [
          "addon",
          "identify",
          "track",
          "trigger",
          "query",
          "segment",
          "segments",
          "ready",
          "on",
          "once",
          "user",
          "consent",
        ];
        if (!permutiveObject) {
          permutiveObject = permutiveObject || {};
          windowTop.permutive = permutiveObject;
          permutiveObject.q = [];
          permutiveObject.config = permutiveConfig || {};
          permutiveObject.config.projectId = projectId;
          permutiveObject.config.apiKey = publicKey;
          permutiveObject.config.environment =
            permutiveObject.config.environment || "production";
          for (let permutiveMethod of permutiveMethods) {
            permutiveObject[permutiveMethod] = (function (n) {
              return function () {
                let o = Array.prototype.slice.call(arguments, 0);
                permutiveObject.q.push({
                  functionName: n,
                  arguments: o,
                });
              };
            })(permutiveMethod);
          }
        }
        loadAsyncScript(`https://cdn.permutive.com/${projectId}-web.js`);
        //cloning methods in wemass object
        for (let pMethod of permutiveMethods) {
          if (
            !windowTop["__wmass"].dmp[pMethod] &&
            windowTop.permutive[pMethod]
          ) {
            windowTop["__wmass"].dmp[pMethod] = getWmssMethod(pMethod);
          }
        }
      }
    }
  };
  //=require wemass-modules/modules/wemassObject/testmode.js
  //=require wemass-modules/modules/helpers/preciseTypeOf.js
  //=require wemass-modules/modules/wemassObject/windowobject.js
  //=require wemass-modules/modules/wemassObject/logger.js
  //=require wemass-modules/modules/helpers/preciseTypeOf.js
  /**
   * expone los valores
   * windowTop.__wmass["consentData"] con el valor de consentimiento en version 1 o 2 segun corresponda cuando el usuario guarda los valores.
   * tfcversion 1 o 2
   * sobreescritura de @variables en omega requeridas
   * cmpCallbackTcf1 ={
   *    getConsentData:function (consentData) {do somenthing}
   *    eventName2:function (consentData) {do somenthing}
   * }
   * cmpCallbackTcf2={
   *    addEventListener:function (tcData, success) {do somenthing}
   * },
   * cmpTimeout:{
   *    milis: false = no timeout, esperara hasta que el usuario acepte el cosentimiento.
   *    callback:function(){ do something }
   *
   */
  let tcfVersion,
    consento,
    setWebCMPData = ({
      cmpCallbackTcf1 = {},
      cmpCallbackTcf2 = {},
      cmpTimeout = {},
    }) => {
      let { milis = false, callback } = cmpTimeout,
        typeofCallback = preciseTypeOf(callback);
      if (windowTop["__cmp"] || windowTop["__tcfapi"]) {
        if (!windowTop.__wmass["consentData"])
          windowTop.__wmass["consentData"] = {};
        consento = windowTop.__wmass["consentData"];
        if (windowTop["__tcfapi"]) {
          logLog(`TCF v2 CMP detectado`);
          tcfVersion = 2;
          if (preciseTypeOf(cmpCallbackTcf2) === "object") {
            if (!consento["getTCData"]) {
              let setTCFData = (tcData, success) => {
                if (success) {
                  logLog(
                    `TCF v2 generic eventListener ejecutado. Estatus: ${tcData.eventStatus}`
                  );
                  if (
                    (tcData.eventStatus === "tcloaded" ||
                      tcData.eventStatus === "useractioncomplete") &&
                    preciseTypeOf(tcData.tcString) === "string" &&
                    tcData.tcString.length > 0
                  ) {
                    logLog(
                      `TCF v2 generic eventListener tcdataString disponible: ${tcData.tcString}`
                    );
                    consento["getTCData"] = tcData;
                    windowTop["__tcfapi"](
                      "removeEventListener",
                      2,
                      (success) => {
                        if (success) {
                          logLog("TCF v2 generic eventListener event removed");
                        }
                      },
                      tcData.listenerId
                    );
                  }
                }
              };
              windowTop["__tcfapi"]("addEventListener", 2, setTCFData);
            }
            for (let eventName in cmpCallbackTcf2) {
              let tcf2Callback = cmpCallbackTcf2[eventName],
                typeoftcf2Callback = preciseTypeOf(tcf2Callback);
              if (typeoftcf2Callback === "function")
                windowTop["__tcfapi"](eventName, 2, tcf2Callback);
              else
                logError(
                  `tcfversion 2 callback para ${eventName} es de tipo  ${typeoftcf2Callback} se esperaba una funcion`
                );
            }
          } else
            logError(
              "Wemass CMP module required, tcfversion 2 detected but no cmpCallbackTcf2 set"
            );
        } else if (windowTop["__cmp"]) {
          logLog(`TCF v1 CMP detectado`);
          tcfVersion = 1;
          if (preciseTypeOf(cmpCallbackTcf1) === "object") {
            if (!consento["getConsentData"])
              windowTop["__cmp"]("getConsentData", null, (consentData) => {
                consento["getConsentData"] = consentData;
              });
            if (!consento["getVendorConsents"])
              windowTop["__cmp"]("getVendorConsents", null, (consentData) => {
                consento["getVendorConsents"] = consentData;
              });
            for (let eventName in cmpCallbackTcf1) {
              let tcf1Callback = cmpCallbackTcf1[eventName],
                typeoftcf1Callback = preciseTypeOf(tcf1Callback);
              if (typeoftcf1Callback === "function")
                windowTop["__cmp"](eventName, null, tcf1Callback);
              else
                logError(
                  `tcfversion 1 callback para ${eventName} es de tipo  ${typeoftcf1Callback} se esperaba una funcion`
                );
            }
          } else
            logError(
              "Wemass CMP module required, tcfversion 1 detected but no cmpCallbackTcf1 set"
            );
        }
        if (milis != false && preciseTypeOf(milis) === "number")
          cmpTimeout.timer = setTimeout(callback, milis);
      } else if (typeofCallback === "function") callback();
    };
  let init = () => {
      logLog("permisos suficientes obtenidos o no habia CMP. Iniciando");
      initDmp(
        windowTop.document,
        windowTop.permutive,
        permutiveProjectId,
        permutivePublicApiKey,
        permutiveExtraConfig
      );
      if (
        preciseTypeOf(windowTop["__wmass"].bff) === "array" &&
        windowTop["__wmass"].bff.length > 0
      ) {
        //executing the buffered functions
        logInfo("Ejecutando funciones en el buffer");
        for (let bufferedFunction of windowTop["__wmass"].bff) {
          if (preciseTypeOf(bufferedFunction) === "function")
            bufferedFunction();
        }
      }
      if (preciseTypeOf(windowTop["__wmass"].bff) !== "object") {
        //converting the buffer to a object with a push funcion that executes the parameter inmediatly.
        windowTop["__wmass"].bff = {
          push: function (instruction) {
            if (preciseTypeOf(instruction) === "function") instruction();
          },
        };
      }
    },
    purposesCheck = (
      purposesNeeded = {},
      purposesGot = {},
      legitimateInterests = false
    ) => {
      let letsGo = true,
        typeofLegitimateInterests = preciseTypeOf(legitimateInterests);
      for (let pNeed in purposesNeeded) {
        if (purposesGot.hasOwnProperty(pNeed) && purposesGot[pNeed] === true)
          purposesNeeded[pNeed] = purposesGot[pNeed];
        else letsGo = false;
        if (
          letsGo === false &&
          typeofLegitimateInterests === "object" &&
          legitimateInterests[pNeed] === true
        ) {
          //repesca por interes legitimo.
          purposesNeeded[pNeed] = legitimateInterests[pNeed];
          letsGo = true;
        }
      }
      if (letsGo === false)
        logError(`Consentimiento insuficiente. Obtenido:`, purposesNeeded);
      return letsGo;
    },
    cmpCallbackTcf1 = {
      getVendorConsents: (consentData) => {
        try {
          let purposesNeeded = {
              1: false, //Storage and access of information
              2: false, //Personalisation
              3: false, //Ad selection, delivery, reporting
              5: false, //Measurement
            },
            { purposeConsents } = consentData,
            letsGo = purposesCheck(purposesNeeded, purposeConsents);
          if (letsGo === true) {
            init();
          }
        } catch (e) {
          logError(e);
        }
      },
    },
    cmpCallbackTcf2 = {
      addEventListener: (tcData, success) => {
        if (success) {
          let purposesNeeded = {
              1: false, //Store and/or access information on a device
              3: false, //Create a personalised ads profile
              4: false, //Select personalised ads
              7: false, //Measure ad performance
              10: false, //Develop and improve products
            },
            {
              eventStatus,
              listenerId,
              purpose: { consents = {}, legitimateInterests = {} } = {},
            } = tcData;
          logLog(`Evento DMP purposes: ejecutado. Status: ${eventStatus}`);
          if (
            (eventStatus === "tcloaded" ||
              eventStatus === "useractioncomplete") &&
            purposesCheck(purposesNeeded, consents /*, legitimateInterests*/)
          ) {
            //a la espera de confirmacion de aceptar interes legitimo para lanzarse.
            init();
            windowTop["__tcfapi"](
              "removeEventListener",
              2,
              (success) => {
                if (success) {
                  logLog("Evento DMP purposes eliminado");
                }
              },
              listenerId
            );
          }
        }
        // do somenthing
      },
    },
    cmpTimeout = {
      milis: false, // no timeout,esperara hasta que el usuario acepte el cosentimiento.
      callback: init,
    };
  if (!windowTop["__wmass"].bff) windowTop["__wmass"].bff = [];
  setWebCMPData({
    cmpCallbackTcf1,
    cmpCallbackTcf2,
    cmpTimeout,
  });
})();
