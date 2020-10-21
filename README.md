# Implementación común de permutive #

El objetivo de este repositorio es englobar, dar informacion de uso y transparencia de ejecucion a los diferentes equipos de implementacion acerca de la implementacion comun de permutive.

Asi mismo se delega la ejecucion de cualquier proceso de datos a la obtencion de consentimiento del usuario. Al no ser el DMP un vendor que realice procesamiento perse, sino que simplemente da la herramienta de procesamiento para ser usada por terceros, la forma elegida es preguntar por los propositos para los que el usuario ha dado consentimiento. 

Dependiendo de la version de implementacion:

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

El contenido del archivo sin personalizar de  __URLWemassService__ se encuentra en /src/index.js

## Metodos #
Todos los metodos wemass están pensados para ejecutarse tras un buffer (__wmass.bff), el cual es inicializado manualmente, por lo que la posibilidad de errores será minimizada.

Existe una excepcion a esto, el metodo *getSegments*, el cual será inicializado manualmente en una version basica ya que los segmentos son almacenados en localStorage, y potencialmente podrian ser utilizados antes de que el motor del DMP sea inicializado.
### Inicializacion ##
Este paso ha de ejecutarse antes de poder usar ningun otro metodo y debe de ser ejecutado en el objeto window superior de la pagina. Cuanto mas arriba en el propio codigo fuente de la página, mejor.
```html
<script async src="__URLWemassService__"></script>
<script>
    window.__wmass = window.__wmass || {};
    window.__wmass.bff = window.__wmass.bff || [];
    window.__wmass.getSegments = window.__wmass.getSegments || function(){ 
        let psegs=[];
        try  {
            pSegs = JSON.parse(window.localStorage._papns || '[]').slice(0, 250).map(String);
        } catch (e) {
            pSegs = []
        }
        return {segments:pSegs};
    };
</script>
```
## DMP Methods
### Sending page Data ##
Estos son los atributos que se han de pasar al DMP, en caso de que alguno de ellos no se pueda rellenar se ha de pasar un string vacio.

En caso de que se quiera añadir un nuevo parametro se ha de avisar a wemass por adelantado.

Los nombres de las propiedades son case-sensitive.

Este codigo ha de ser ejecutado en el objeto window superior de la pagina.
```html
<script>
__wmass.bff.push(function () {
    /*Si se dispone de algun tipo de identificador del usuario cuando se carga la página se deberia ejecutar este codigo Ver la seccion de Sending identities to DMP para mas informacion.
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
### Sending identities to DMP ###
Este codigo es el que se encarga de enviar los identificadores disponibles para el usuario. Identify requiere un array de objetos siendo la propiedad id el id del usuario en si mismo y tag el identificador legible para la gestion en el DMP. Se deben tener en cuenta los siguientes puntos:
* Si el identificador se encuentra disponible cuando carga la pagina, se ha de ejecutar antes de la llamada a __wmass.dmp.addon.
* En las páginas donde el identificador no está disponible, se puede obviar todo el codigo.
* Cuando un usuario se identifique, se debe llamar a identify con el valor correspondiente.
* Una  vez que un identicador está mapeado a un usuario, esta relacion no es reversible (este problema se veria por ejemplo si dos usuarios tuvieran como id el valor _undefined_), por lo que se ha de asegurar que solo se llama a este método cuando el id es correcto.
* No se ha de usar valores que permitan identificacion personal del usuario (PII) como direccion, Email sin encriptar, id publico de perfil, etc...
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
Este paso es especialmente necesario en Safari debido a las restricciones de  ITP.

### Sending data after page load (Events) ##
### Getting Segment List ##
```javascript 
let segmentList= __wmass.getSegments();
```
getSements devolverá un objeto con 1 o varias atributos  con diferentes grupos de segmentos. Cada propiedad contendrá un array de strings con la informacion.
Por ahora solamente devolverá
```javascript
{segments:["lista","de","segmentos"]}
```
### Passing Segment list to Appnexus ##
En appnexus los segmentos se han de pasar dentro del parametro keywords como se puede ver en el ejemplo.
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
## Changelog
13/10/2020 :  release of PoF version