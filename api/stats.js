import express from 'express'
import queryLib from '../src/lib/queryLib'
const router = express.Router()
const endpoint = 'http://wilda.lri.fr:3030/nobel/sparql'

router.get('/:class', (req, res) => {
    console.log("c'est parti", req.params)
    res.send("c'est parti")
    const constraints = ''
    const entrypoint = req.params.class
    const prefixes = {
        nobel: 'http://data.nobelprize.org/terms/',
        foaf: 'http://xmlns.com/foaf/0.1/',
        'dbpedia-owl': 'http://dbpedia.org/ontology/',
        yago: 'http://yago-knowledge.org/resource/',
        viaf: 'http://viaf.org/viaf/',
        meta: 'http://www4.wiwiss.fu-berlin.de/bizer/d2r-server/metadata#',
        dcterms: 'http://purl.org/dc/terms/',
        d2r: 'http://sites.wiwiss.fu-berlin.de/suhl/bizer/d2r-server/config.rdf#',
        dbpedia: 'http://dbpedia.org/resource/',
        owl: 'http://www.w3.org/2002/07/owl#',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        map: 'http://data.nobelprize.org/resource/#',
        freebase: 'http://rdf.freebase.com/ns/',
        dbpprop: 'http://dbpedia.org/property/',
        skos: 'http://www.w3.org/2004/02/skos/core#',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#'
    }
    const mainQuery = queryLib.makePropsQuery(entrypoint, constraints, 1)
    queryLib.getData(endpoint, mainQuery, prefixes)
        .then(props => {
            console.log(props.results.bindings[0])
            const groupedProps = props.results.bindings.map(prop => {
                return queryLib.defineGroup(prop, entrypoint, 1, prefixes)
            }).filter(prop => (prop.group !== 'ignore'))
            return Promise.all(groupedProps.map(prop => {
                let propQuery = queryLib.makePropQuery(prop.path, constraints)
                return queryLib.getData(endpoint, propQuery, prefixes)
            }))
        })
        .then(props => {
            console.log(props[0].results.bindings)
        })

    /* Promise.all([
        Day.getFirstDay(),
        Day.getLastDay(),
        CalendarStream.getCalendars()
    ])
    .then(([dateStart, dateEnd, calendars]) => {
        res.render('config', {
            title: 'Planning CIFRE - Configuration',
            dateStart: dateStart[0]._id,
            dateEnd: dateEnd[0]._id,
            calendarUrls: JSON.stringify(calendars.map(calendar => calendar.url))
        })
        res.end()
    })
    .catch((err) => {
        req.flash('error', 'Error while getting the data ' + err)
        res.render('config', {title: 'Planning CIFRE - Configuration'})
    }) */
})
router.post('/:class', (req, res) => {
    console.log("c'est parti")
})

router.post('/:class/:constraint', (req, res) => {
    // for later, store preprocessing in the data base
})

export default router
