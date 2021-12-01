# Indice <!-- omit in toc -->
- [Implementación común de permutive](#implementación-común-de-permutive)
  - [Consentimiento](#consentimiento)
  - [Multiples Integraciones](#multiples-integraciones)
  - [Métodos](#métodos)
  - [Esquemas de validación](#esquemas-de-validación)
- [Inicialización](#inicialización)
  - [Codigo **Single**](#codigo-single)
  - [Codigo **Multi**](#codigo-multi)
- [Enviando atributos de la página al DMP](#enviando-atributos-de-la-página-al-dmp)
- [Enviando identidades al DMP](#enviando-identidades-al-dmp)
- [Scroll infinito](#scroll-infinito)
- [Obteniendo la lista de segmentos](#obteniendo-la-lista-de-segmentos)
- [Activando los segmentos](#activando-los-segmentos)
  - [Enviando los segmentos a **Appnexus**](#enviando-los-segmentos-a-appnexus)
    - [Codigo **Single**](#codigo-single-1)
    - [Codigo **Multi**](#codigo-multi-1)
  - [Enviando los segmentos a **SmartAdserver**](#enviando-los-segmentos-a-smartadserver)
    - [Codigo **Single**](#codigo-single-2)
    - [Codigo **Multi**](#codigo-multi-2)
  - [Enviando los segmentos a **RichAudience**](#enviando-los-segmentos-a-richaudience)
    - [Codigo **Single**](#codigo-single-3)
    - [Codigo **Multi**](#codigo-multi-3)
- [Otras posibilidades](#otras-posibilidades)
  - [Obteniendo status de segmentos individuales](#obteniendo-status-de-segmentos-individuales)
  - [Listar todos los segmentos con callback](#listar-todos-los-segmentos-con-callback)
  - [Interacciones o eventos y disparadores](#interacciones-o-eventos-y-disparadores)
- [Changelog](#changelog)

# Implementación común de permutive #

El objetivo de este repositorio es englobar, dar información de uso y transparencia de ejecución a los diferentes equipos de implementación acerca de la implementación común de permutive en entorno web **no AMP**.
>:warning: Para estar al tanto de las ultimas actualizaciones considera suscribirte al repositorio

## Consentimiento
Se delega la ejecución de cualquier proceso de datos a la obtención de consentimiento del usuario. 

Al no ser el DMP un vendor que realice procesamiento *per se*, sino que simplemente da la herramienta de procesamiento para ser usada por terceros, la forma elegida es preguntar por los propósitos para los que el usuario ha dado consentimiento. 

Dependiendo de la versión de implementación:

TCF v2
```
    "1": Store and/or access information on a device
    "3": Create a personalised ads profile
    "4": Select personalised ads
    "7": Measure ad performance
    "10": Develop and improve products
```
TCF v1
```
    "1": Storage and access of information
    "2": Personalisation
    "3": Ad selection, delivery, reporting
    "5": Measurement
```

El contenido del archivo sin personalizar de *\_\_URLWemassService__* se encuentra en */src/index.js*.

## Multiples Integraciones
En la mayor parte de las implementaciones, se ha de utilizar la implementacion single.
**En el caso de que en la pagina haya multiples instancias de permutive, habra que usar los ejemplos de codigo indicados como multi.**

## Métodos 
Todos los métodos wemass están pensados para ejecutarse tras un buffer (*__wmass.bff*), el cual es inicializado manualmente, por lo que la posibilidad de errores será minimizada.

Existe una excepción a esto, el método *getSegments*, el cual será inicializado manualmente en una versión básica ya que los segmentos son almacenados en localStorage, y potencialmente podría ser utilizados antes de que el motor del DMP sea inicializado.

## Esquemas de validación

El DMP usa un esquema de validación para conjuntos de propiedad-valor y eventos.

Si se incluye una propiedad o nombre de evento no declarados (estos valores son *case-sensitive*), o un valor no apropiado para el esquema, esto será rechazado con un error 400.

Para añadir o modificar estos valores, por favor contacta con wemass.

# Inicialización

Este paso ha de ejecutarse antes de poder usar ningún otro método y debe de ser ejecutado en el objeto *window* superior de la página. Cuanto más arriba en el propio código fuente de la página, mejor.
## Codigo **Single**
```html
<script>
    window.__wmass = window.__wmass || {};
    window.__wmass.bff = window.__wmass.bff || [];
    window.__wmass.getSegments = window.__wmass.getSegments || function(){ 
        let pSegs=[];
        try  {
            pSegs = JSON.parse(window.localStorage._papns || '[]').slice(0, 250).map(String);
        } catch (e) {
            pSegs = []
        }
        return {permutive:pSegs};
    };
</script>
<script async src="__URLWemassService__"></script>
```

## Codigo **Multi**
Los segmentos no se extraen de la propiedad _pnaps como siempre sino de una entrada tras el namespace de wemass
```html
<script>
    window.__wmass = window.__wmass || {};
    window.__wmass.bff = window.__wmass.bff || [];
    window.__wmass.getSegments = window.__wmass.getSegments || function(){ 
        let pSegs=[];
        try  {
            pSegs = JSON.parse(window.localStorage["{NAMESPACE}/_papns"] || '[]').slice(0, 250).map(String);
        } catch (e) {
            pSegs = []
        }
        return {permutive:pSegs};
    };
</script>
<script async src="__URLWemassService__"></script>
```
>:warning: Wemass hará llegar el código correcto. No usar este código en producción.

# Enviando atributos de la página al DMP
Estos son los atributos que se han de pasar al DMP, en caso de que alguno de ellos no se pueda rellenar se ha de pasar un string vacío.
Este código ha de lanzarse lo antes posible en la ejecución, idealmente justo después de la inicialización. Hay que tener en cuenta los siguientes puntos:
* Los nombres de las propiedades son *case-sensitive*.
* Este código ha de ser ejecutado en el objeto window superior de la página. 
* Los datos de tipo fecha esperan una fecha de tipo ISO (yyyy-mm-ddThh:mm:ss.milisZ)

>:warning: Importante: aqui aplican los [Esquemas de validación](#esquemas-de-validación)

```html
<script>
__wmass.bff.push(function () {
    /*Si se dispone de algún tipo de identificador del usuario cuando se carga la página se debería ejecutar este código Ver la sección de #enviando-atributos-de-la-página-al-dmp para más información.
    if (USER_ID_AVAILABLE) { 
        __wmass.dmp.identify([
            {
                id: '<USER_ID>', 
                tag: '<ID_TAG>'
            }
        ]);
    }*/
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
});
</script>
```
# Enviando identidades al DMP
Este código es el que se encarga de enviar los identificadores disponibles para el usuario. *Identify* requiere un array de objetos, cada uno de estos objetos requiere las propiedades: 
* **id**: el id del usuario en sí mismo.
* **tag**: el identificador legible para la gestión en el DMP.

Se debe tener en cuenta los siguientes puntos:
* Si el identificador se encuentra disponible cuando carga la página, se de llamar a *Identify* antes de la ejecución de *__wmass.dmp.addon*. Tal y como se ve en el ejemplo de _Enviando atributos de la página_.
* En las páginas donde el identificador no está disponible, se puede obviar esta instrucción.
* Cuando un usuario se identifique, se debe llamar a *identify* con el valor correspondiente no es necesario llamar a *addon*. 
* Una vez que un identificador está mapeado a un usuario, esta relación no es reversible (este problema se vería por ejemplo si dos usuarios tuvieran como id el valor _undefined_), por lo que se ha de asegurar que **solo se ha de llamar a este método cuando se dispone de un id**.
* No se ha de usar valores que permitan identificación personal del usuario (PII) como dirección, Email sin encriptar, id público de perfil, etc...

>:warning: Importante: aqui aplican los [Esquemas de validación](#esquemas-de-validación)

>:warning: Este paso es especialmente necesario en Safari debido a las restricciones de ITP respecto al uso de localStorage.

```javascript
__wmass.bff.push(function () {
    if (USER_ID_AVAILABLE) {
        __wmass.dmp.identify([
            {
                id: '<USER_ID>',
                tag: '<ID_TAG>'
            }
        ]);
    }
    //__wmass.dmp.addon('web', {... });
});
```

# Scroll infinito
En aquellas páginas con scroll infinito se ha de llamar a la función *addon* sin pasar los atributos de usuario (a no ser que estos hayan cambiado).

>:warning: Importante: aqui aplican los [Esquemas de validación](#esquemas-de-validación)

```javascript
__wmass.bff.push(function () {
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
        }
    });
});
```
# Obteniendo la lista de segmentos
```javascript 
let segmentList= __wmass.getSegments();
```
*getSements* devolverá un objeto con 1 o varios atributos con diferentes grupos de segmentos. Cada propiedad contendrá un array de strings con la información.

Por ahora solamente devolverá
```javascript
{segments:["lista","de","segmentos"]}
```
Es importante para obtener los segmentos usar la función *__wmass.getSegments()* ya que, aunque se inicializa con una funcionalidad estática en el setUp del DMP. Una vez que se inicializa el mismo, su funcionalidad podría cambiar.

# Activando los segmentos
 
Se han de pasar los datos de los segmentos de permutive a los SSP de wemass que permiten este valor. Mas abajo hay ejemplos de envío de datos.

## Enviando los segmentos a **Appnexus**
> :warning: **Este código es un ejemplo**: adaptar para cada necesidad

En Appnexus los segmentos se han de pasar dentro del parámetro *keywords* como se puede ver en el ejemplo.

El parámetro admite un objeto cuyas propiedades tienen un array de strings. La función *__wmass.getSegments()* devolverá los valores listos para usar.
### Codigo **Single**
```javascript
let 
    wemassDataSegments=__wmass.getSegments(),
    adUnits = [{
        code: 'your prebid AdUnit code here',
        mediaTypes: {
            banner: {
                sizes: [ [300, 250], [300, 600] ]
            }
        },
        bids: [{
            bidder: 'appnexus',
            params: {
                placementId: 13144370,
                keywords: wemassDataSegments
            }
        }]
    }];
pbjs.addAdUnits(adUnits);
```
### Codigo **Multi**
En el caso de que se quiera enviar los segmentos de permutive a wemass para dar servicio a campañas que administremos, se ha de incluir en la propiedad de keywords una nueva propiedad con los segmentos del publisher. De lo contrario usar el ejemplo single.
```javascript
let wemassDataSegments=__wmass.getSegments();
wemassDataSegments["permutive<PUBLISHER>"]=["pubSegment1","pubSegment2","pubSegment..."];
let adUnits = [{
        code: 'your prebid AdUnit code here',
        mediaTypes: {
            banner: {
                sizes: [ [300, 250], [300, 600] ]
            }
        },
        bids: [{
            bidder: 'appnexus',
            params: {
                placementId: 13144370,
                keywords: wemassDataSegments
            }
        }]
    }];
pbjs.addAdUnits(adUnits);
```


## Enviando los segmentos a **SmartAdserver**
> :warning: **Este código es un ejemplo**: adaptar para cada necesidad

En SmartAdserver los segmentos se han de pasar dentro del parámetro *target*, pero han de ser transformados ya que el parámetro solo admite un string con el formato **"target1=segment1,segment2;target2=segment3,segment4"**

Si ya existiera un *target* establecido, se debería concatenar al mismo separando por un ;

Aquí un ejemplo de transformación:
### Codigo **Single**
```javascript
let 
    wemassDataSegments=__wmass.getSegments(),
    wemassDataItems=Object.keys(wemassDataSegments).map((target)=>{
        return `${target}=${wemassDataSegments[target].join()}`
    }),
    adUnits = [{
        code: 'your prebid AdUnit code here',
        mediaTypes: {
            banner: {
                sizes: [ [300, 250], [300, 600] ]
            }
        },
        bids: [{
            bidder: 'smartadserver',
            params: {
                domain: "//prg.smartadserver.com",
                formatId: "78109",
                pageId: "1078608",
                siteId: "293313",
                target: wemassDataItems.join(";")
            }
        }]
    }];
pbjs.addAdUnits(adUnits);
```
### Codigo **Multi**
En el caso de que se quiera enviar los segmentos de permutive a wemass para dar servicio a campañas que administremos, se ha de incluir en la propiedad de keywords una nueva propiedad con los segmentos del publisher. De lo contrario usar el ejemplo single.
```javascript
let 
    wemassDataSegments=__wmass.getSegments();
wemassDataSegments["permutive<PUBLISHER>"]=["pubSegment1","pubSegment2","pubSegment..."];
let
    wemassDataItems=Object.keys(wemassDataSegments).map((target)=>{
        return `${target}=${wemassDataSegments[target].join()}`
    }),
    adUnits = [{
        code: 'your prebid AdUnit code here',
        mediaTypes: {
            banner: {
                sizes: [ [300, 250], [300, 600] ]
            }
        },
        bids: [{
            bidder: 'smartadserver',
            params: {
                domain: "//prg.smartadserver.com",
                formatId: "78109",
                pageId: "1078608",
                siteId: "293313",
                target: wemassDataItems.join(";")
            }
        }]
    }];
pbjs.addAdUnits(adUnits);
```

## Enviando los segmentos a **RichAudience**
> :warning: **Este código es un ejemplo**: adaptar para cada necesidad

En Richaudience los segmentos se han de pasar dentro del parámetro *keywords*, pero han de ser transformados ya que el parámetro solo admite un string con el formato **"keyword1=segment1;keyword1=segment2;keyword2=segment3;keyword2=segment4"**

Si ya existiera un *keyword* establecido, se debe añadir otra vez un par de *keyword=segment* ;

Aquí un ejemplo de transformación:
### Codigo **Single**
```javascript
let 
    wemassDataSegments=__wmass.getSegments(),
    wemassDataItems=Object.keys(wemassDataSegments).map((keyword)=>{
        let raSegments = [];
        wemassDataSegments[keyword].map((keyvalue)=>{
            raSegments.push(`${keyword}=${keyvalue}`)
        });
        return raSegments.join(";");
    }),
    adUnits = [{
        code: 'your prebid AdUnit code here',
        mediaTypes: {
            banner: {
                sizes: [ [300, 250], [300, 600] ]
            }
        },
        bids: [{
            bidder: 'richaudience',
            params: {
                pid:"ADb1f40rmo",
                supplyType:"site",
                bidfloor:0.40,
                keywords: wemassDataItems.join(";")
            }
        }]
    }];
pbjs.addAdUnits(adUnits);
```
### Codigo **Multi**
En el caso de que se quiera enviar los segmentos de permutive a wemass para dar servicio a campañas que administremos, se ha de incluir en la propiedad de keywords una nueva propiedad con los segmentos del publisher. De lo contrario usar el ejemplo single.
```javascript
let 
    wemassDataSegments=__wmass.getSegments();
wemassDataSegments["permutive<PUBLISHER>"]=["pubSegment1","pubSegment2","pubSegment..."];
let
    wemassDataItems=Object.keys(wemassDataSegments).map((keyword)=>{
        return wemassDataSegments[keyword].map((keyvalue)=>{
            return `${keyword}=${keyvalue}`
        })
    }),
    adUnits = [{
        code: 'your prebid AdUnit code here',
        mediaTypes: {
            banner: {
                sizes: [ [300, 250], [300, 600] ]
            }
        },
        bids: [{
            bidder: 'richaudience',
            params: {
                pid:"ADb1f40rmo",
                supplyType:"site",
                bidfloor:0.40,
                keywords: wemassDataItems.join(";")
            }
        }]
    }];
pbjs.addAdUnits(adUnits);
```
# Otras posibilidades
Se incluyen aquí otras posibilidades que permite el DMP, para más detalles sobre implementación y uso contacte con wemass.
## Obteniendo status de segmentos individuales
Se puede preguntar por el estado de inclusión de un segmento predefinido para realizar alguna acción en la página
```javascript
__wmass.bff.push(function () {
    __wmass.dmp.segment(idEvento, function(result) {
        if (result) {
            // El usuario pertenece al segmento indicado
        } 
    });
});
```
## Listar todos los segmentos con callback
```javascript
__wmass.bff.push(function () {
    __wmass.dmp.segments(callback);
});
```
Callback recibirá un objeto con los segmentos a los que pertenece el usuario
>:warning: Debido a la inmediatez de la ejecución de prebid es mejor, para enviar los segmentos a los SSP usar la funcion estatica *__wmass.getSegments()*

## Interacciones o eventos y disparadores
Es posible hacer seguimiento de acciones que realice el usuario en tiempo real, por ejemplo, rellenando una encuesta, usando la funcion *track*.
```javascript
__wmass.bff.push(function () {
    __wmass.dmp.track('CustomEventName', {dataItem:true}, opciones);
});
```

### Disparadores <!-- omit in toc -->

Es posible asociar *callbacks* a interacciones cuando un usuario es incluido en un segmento a través de un Evento.
```javascript
__wmass.bff.push(function () {
    __wmass.dmp.trigger(idEvento, "result", function(obj){
        if(obj.result)
        //realizar acciones necesarias
    });
});
``` 

>:warning: Importante: aqui aplican los [Esquemas de validación](#esquemas-de-validación)

# Changelog
01/12/2021 : Incluidos ejemplos multi.

29/10/2020 : Incluido índice. Añadidas otras opciones.

28/10/2020 : Añadido setup para scroll infinito. Incluido ejemplo de SmartAdserver. Modificaciones por claridad.

13/10/2020 : Prueba de concepto
