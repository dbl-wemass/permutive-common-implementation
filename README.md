# Implementación común de permutive #

El objetivo de este repositorio es dar informacion de uso y transparencia de ejecucion a los diferentes equipos de implementacion acerca de la implementacion comun de permutive.

El contenido del archivo __URLWemassService__ se encuentra en /src/index.js

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
Estos son los atributos que se han de pasar al dmp, en caso de que alguno de ellos no se pueda rellenar se ha de pasar un string vacio.
En caso de que se quiera añadir un nuevo parametro se ha de avisar a wemass por adelantado.
Los nombres de las propiedades son case-sensitive.
Este codigo ha de ser ejecutado en el objeto window superior de la pagina.
```javascript
<script>
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
### Sending data after page load (Events) ##
### Getting Segment List ##
```javascript 
let segmentList= __wmass.getSegments();
```
getSements devolverá un objeto con 1 o varias atributos  con diferentes grupos de segmentos. Cada propiedad contendrá un array de strings con la informacion.
Por ahora solamente devolverá
```javascript
{permutive:["lista","de","segmentos"]}
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