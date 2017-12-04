import express from 'express'
import queryLib from '../src/lib/queryLib'
const router = express.Router()
const endpoint = 'http://localhost:8890/sparql' // 'http://wilda.lri.fr:3030/nobel/sparql'

router.get('/:class', (req, res) => {
    console.log("c'est parti", req.params)
    const constraints = ''
    const entrypoint = req.params.class
    const defaultGraph = 'http://localhost:8890/nobel'
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
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        'dbpedia-owl': 'http://dbpedia.org/ontology/'
    }
    const ignoreList = ['https://www.w3.org/1999/02/22-rdf-syntax-ns#type']
    const totalQuery = queryLib.makeTotalQuery(entrypoint, constraints, defaultGraph)
    const options = {
        entrypoint,
        defaultGraph,
        constraints,
        endpoint,
        prefixes,
        ignoreList,
        maxLevel: 4,
        maxUnique: 100,
        maxChar: 55
    }
    let total
    queryLib.getData(endpoint, totalQuery, prefixes)
        .then(totalcount => {
            total = Number(totalcount.results.bindings[0].total.value)
            const entryProp = [{ path: entrypoint, previousPath: entrypoint, level: 0, category: 'entrypoint' }]
            return getStatsLevel(entryProp, 1, total, options)
        })
        .then(props => {
            console.log('bravo toto !!!!!!!!!!!!!!!!!!!!!!!!!', props)
            res.json(props)
        })
        .catch((err) => {
            console.log('Error retrieving stats', err)
        })
})
const getStatsLevel = (categorizedProps, level, total, options) => {
    const { entrypoint, constraints, endpoint, prefixes, maxLevel, maxUnique, maxChar, defaultGraph } = options
    let newCategorizedProps = []
    const queriedProps = categorizedProps.filter(prop => {
        return (prop.level === level - 1 && 
            (prop.category === 'entrypoint' || 
            (prop.category === 'uri' && prop.unique > maxUnique)))
    })
    const checkExistingProps = categorizedProps.map(p => p.property)
    return Promise.all(
        queriedProps.map(prop => {
            let propsQuery = queryLib.makePropsQuery(prop.path, constraints, level, defaultGraph)
            // console.log('////////', propsQuery)
            return queryLib.getData(endpoint, propsQuery, prefixes)
        })
    )
        .then(propsLists => {
            //console.log('||||||||||||||||', level, propsLists.map(prop => prop.results.bindings))
            propsLists.forEach((props, index) => {
               
                let filteredCategorizedProps = props.results.bindings.map(prop => {
                    console.log('??????', level, { ...prop })
                    return queryLib.defineGroup(prop, queriedProps[index].path, level, options)
                }).filter(prop => {
                    return (prop.category !== 'ignore') &&
                    !checkExistingProps.includes(prop.property) &&
                    !(prop.avgcharlength > maxChar)
                })
                newCategorizedProps.push(...filteredCategorizedProps)
            })
            // console.log('[[[[[[[[[[[[[[', newCategorizedProps.length, newCategorizedProps)
            if (newCategorizedProps.length > 0) {
                return Promise.all(newCategorizedProps.map(prop => {
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
            if (level < maxLevel) {
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
