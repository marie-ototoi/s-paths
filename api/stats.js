import express from 'express'
import promiseSettle from 'promise-settle'
import queryLib from '../src/lib/queryLib'
const router = express.Router()

router.get('/:class', (req, res) => {
    // req.params.class
    getStats({ entrypoint: req.params.class })
        .then(props => {
            console.log('GET !!!!!!!!!!!!!!!!!!!!!!!!!', req.params.options, props)
            res.json(props)
        })
        .catch((err) => {
            console.log('Error retrieving stats', err)
        })
})
router.post('/:class', (req, res) => {
    getStats({ entrypoint: req.params.class, ...req.body })
        .then(props => {
            console.log('POST !!!!!!!!!!!!!!!!!!!!!!!!!', props)
            res.json(props)
        })
        .catch((err) => {
            console.log('Error retrieving stats', err)
        })
})
const getStats = (opt) => {
    const ignore = opt.ignoreList ? [...opt.ignoreList] : []
    const options = {
        entrypoint: opt.entrypoint,
        constraints: opt.constraints || '',
        /* defaultGraph: opt.defaultGraph || 'http://localhost:8890/data10', */
        endpoint: 'http://wilda.lri.fr:3030/nobel/sparql', // 'http://wilda.lri.fr:3030/nobel/sparql', // 'http://localhost:8890/sparql'
        ignoreList: [...ignore, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'],
        maxLevel: opt.maxLevel || 4,
        maxUnique: opt.maxUnique || 100,
        maxChar: opt.maxChar || 55,
        prefixes: opt.prefixes || {
            dcterms: 'http://purl.org/dc/terms/',
            d2r: 'http://sites.wiwiss.fu-berlin.de/suhl/bizer/d2r-server/config.rdf#',
            dbpedia: 'http://dbpedia.org/resource/',
            'dbpedia-owl': 'http://dbpedia.org/ontology/',
            dbpprop: 'http://dbpedia.org/property/',
            foaf: 'http://xmlns.com/foaf/0.1/',
            freebase: 'http://rdf.freebase.com/ns/',
            map: 'http://data.nobelprize.org/resource/#',
            meta: 'http://www4.wiwiss.fu-berlin.de/bizer/d2r-server/metadata#',
            nobel: 'http://data.nobelprize.org/terms/',
            owl: 'http://www.w3.org/2002/07/owl#',
            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
            skos: 'http://www.w3.org/2004/02/skos/core#',
            viaf: 'http://viaf.org/viaf/',
            xsd: 'http://www.w3.org/2001/XMLSchema#',
            yago: 'http://yago-knowledge.org/resource/',
            bio: 'http://vocab.org/bio/0.1/', // BnF
            bibo: 'http://purl.org/ontology/bibo/',
            'dcmi-box': 'http://dublincore.org/documents/dcmi-box',
            dcmitype: 'http://purl.org/dc/dcmitype/',
            'frbr-rda': 'http://rdvocab.info/uri/schema/FRBRentitiesRDA/',
            geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
            geonames: 'http://www.geonames.org/ontology#',
            ign: 'http://data.ign.fr/ontology/topo.owl#',
            insee: 'http://rdf.insee.fr/geo',
            isni: 'http://isni.org/ontology#',
            marcrel: 'http://id.loc.gov/vocabulary/relators',
            mo: 'http://musicontology.com/',
            ore: 'http://www.openarchives.org/ore/terms/',
            rdagroup1elements: 'http://rdvocab.info/Elements/',
            rdagroup2elements: 'http://rdvocab.info/ElementsGr2/',
            rdarelationships: 'http://rdvocab.info/RDARelationshipsWEMI',
            schemaorg: 'http://schema.org/'
        }
    }
    const totalQuery = queryLib.makeTotalQuery(options.entrypoint, options.constraints, options.defaultGraph)
    // console.log(totalQuery)
    let total
    return queryLib.getData(options.endpoint, totalQuery, options.prefixes)
        .then(totalcount => {
            // console.log(totalcount)
            total = Number(totalcount.results.bindings[0].total.value)
            const entryProp = [{ path: options.entrypoint, previousPath: options.entrypoint, level: 0, category: 'entrypoint' }]
            if (total === 0) {
                return new Promise(resolve => resolve([]))
            } else {
                return getStatsLevel(entryProp, 1, total, options)
            }
        })
        .then(props => {
            return new Promise(resolve => resolve({ total_instances: total, statements: props }))
        })
}
const getStatsLevel = (categorizedProps, level, total, options) => {
    const { entrypoint, constraints, endpoint, prefixes, maxLevel, maxUnique, maxChar, defaultGraph } = options
    let newCategorizedProps = []
    const queriedProps = categorizedProps.filter(prop => {
        return (prop.level === level - 1 &&
            (prop.category === 'entrypoint' ||
            (prop.category === 'uri' && prop.unique > maxUnique)))
    })
    const checkExistingProps = categorizedProps.map(p => p.property)
    return promiseSettle(
        queriedProps.map(prop => {
            let propsQuery = queryLib.makePropsQuery(prop.path, constraints, level, defaultGraph)
            // console.log('////////', propsQuery)
            return queryLib.getData(endpoint, propsQuery, prefixes)
        })
    )
        .then(propsLists => {
            // console.log('||||||||||||||||', level, propsLists)
            propsLists.forEach((props, index) => {
                if (props.isFulfilled()) {
                    props = props.value()
                    let filteredCategorizedProps = props.results.bindings.map(prop => {
                        // console.log('??????', level, { ...prop })
                        return queryLib.defineGroup(prop, queriedProps[index].path, level, options)
                    }).filter(prop => {
                        return (prop.category !== 'ignore') &&
                        !checkExistingProps.includes(prop.property) &&
                        !(prop.avgcharlength > maxChar)
                    })
                    newCategorizedProps.push(...filteredCategorizedProps)
                }
            })
            // console.log('[[[[[[[[[[[[[[', newCategorizedProps.length, newCategorizedProps)
            if (newCategorizedProps.length > 0) {
                return promiseSettle(newCategorizedProps.map(prop => {
                    let propQuery = queryLib.makePropQuery(prop, constraints, defaultGraph)
                    // console.log('[[[[[[[[[[[[[[', propQuery)
                    return queryLib.getData(endpoint, propQuery, prefixes)
                }))
            } else {
                return new Promise(resolve => resolve([]))
            }
        })
        .then(stats => {
            // console.log('@@@@@@@@@@@@@', level, stats)
            const returnProps = [
                ...categorizedProps,
                ...queryLib.mergeStatsWithProps(newCategorizedProps, stats, total)
            ]
            // console.log(returnProps)
            if (level < maxLevel && stats.length > 0) {
                return getStatsLevel(returnProps, level + 1, total, options)
            } else {
                return new Promise(resolve => resolve(returnProps))
            }
        })
        .catch((err) => {
            console.log('Error retrieving stats', err)
        })
}
router.post('/:class', (req, res) => {
    console.log("c'est parti")
})

router.post('/:class/:constraint', (req, res) => {
    // for later, store preprocessing in the data base
})

export default router
