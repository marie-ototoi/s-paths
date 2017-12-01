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
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        'dbpedia-owl': 'http://dbpedia.org/ontology/'
    }
    const totalQuery = queryLib.makeTotalQuery(entrypoint, constraints)
    const options = {
        entrypoint,
        constraints,
        endpoint,
        prefixes,
        maxLevel: 3,
        maxUnique: 100
    }
    let total
    queryLib.getData(endpoint, totalQuery, prefixes)
        .then(totalcount => {
            total = Number(totalcount.results.bindings[0].total.value)
            return getStatsLevel([{ path: entrypoint, previousPath: entrypoint, level: 0, category: 'entrypoint' }], 1, total, options)
        })
        .then(props => {
            console.log('toto', props)
        })
        .catch((err) => {
            console.log('Error retrieving stats', err)
        })
})
const getStatsLevel = (categorizedProps, level, total, options) => {
    const { entrypoint, constraints, endpoint, prefixes, maxLevel, maxUnique } = options
    let newCategorizedProps = []
    const queriedProps = categorizedProps.filter(prop => {
        return (prop.level === level - 1 && 
            (prop.category === 'entrypoint' || 
            (prop.category === 'uri' && prop.unique > maxUnique)))
    })
    const checkExistingProps = categorizedProps.map(p => p.path)
    return Promise.all(
        queriedProps.map(prop => {
            // console.log(level, prop.path, queryLib.makePropsQuery(prop.path, constraints, level))
            return queryLib.getData(endpoint, queryLib.makePropsQuery(prop.path, constraints, level), prefixes)
        })
    )
        .then(propsLists => {
            propsLists.forEach((props, index) => {
                let filteredCategorizedProps = props.results.bindings.map(prop => {
                    // console.log(prop, queriedProps[index].previousPath)
                    return queryLib.defineGroup(prop, queriedProps[index].path, level, prefixes)
                }).filter(prop => (prop.category !== 'ignore') && !checkExistingProps.includes(prop.path))
                newCategorizedProps.push(...filteredCategorizedProps)
            })
            // console.log('easy', newCategorizedProps)
            return queryLib.getStats(newCategorizedProps, endpoint, constraints, prefixes)
        })
        .then(stats => {
            // console.log(stats)
            // console.log('salut', level, maxLevel)
            const returnProps = [
                ...categorizedProps,
                ...queryLib.mergeStatsWithProps(newCategorizedProps, stats, total)
            ]
            console.log(returnProps)
            if (level < maxLevel) {
                return getStatsLevel(returnProps, level + 1, total, options) 
            } else {
                return new Promise(resolve => resolve(returnProps))
            }
            // console.log(categorizedProps)
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
