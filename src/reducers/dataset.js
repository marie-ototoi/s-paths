import types from '../constants/ActionTypes'

const initialState = {
    endpoint: process.env.ENDPOINT || 'http://s-paths.lri.fr:8890/sparql',
    localEndpoint: process.env.LOCAL_ENDPOINT || 'http://virtuoso:8890/sparql',
    entrypoint: '',
    graphs: ['http://bnf.ilda.fr'],
    resourceGraph: null,
    constraints: '',
    labels: [],
    maxLevel:6,
    ignoreList: ['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'],
    resources: [],
    prefixes: {
        dcterms: 'http://purl.org/dc/terms/',
        d2r: 'http://sites.wiwiss.fu-berlin.de/suhl/bizer/d2r-server/config.rdf#',
        dbpedia: 'http://dbpedia.org/resource/',
        'dbpedia-owl': 'http://dbpedia.org/ontology/',
        dbpprop: 'http://dbpedia.org/property/',
        foaf: 'http://xmlns.com/foaf/0.1/',
        freebase: 'http://rdf.freebase.com/ns/',
        map: 'http://data.nobelprize.org/resource/#',
        meta: 'http://www4.wiwiss.fu-berlin.de/bizer/d2r-server/metadata#',
        nobel_t: 'http://data.nobelprize.org/terms/',
        nobel_r: 'http://data.nobelprize.org/resource/',
        nobelprizes: 'http://nobelprize.org/nobel_prizes/',
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
        insee: 'http://rdf.insee.fr/def/geo#',
        isni: 'http://isni.org/ontology#',
        marcrel: 'http://id.loc.gov/vocabulary/relators/',
        mo: 'http://musicontology.com/',
        ore: 'http://www.openarchives.org/ore/terms/',
        rdagroup1elements: 'http://rdvocab.info/Elements/',
        rdagroup2elements: 'http://rdvocab.info/ElementsGr2/',
        rdarelationships: 'http://rdvocab.info/RDARelationshipsWEMI/',
        schemaorg: 'http://schema.org/',
        blt: 'http://www.bl.uk/schemas/bibliographic/blterms#', // t-mus
        event: 'http://purl.org/NET/c4dm/event.owl#',
        frbr: 'http://purl.org/vocab/frbr/core#',
        sim: 'http://purl.org/ontology/similarity/',
        slickm: 'http://slickmem.data.t-mus.org/',
        slickmem: 'http://slickmem.data.t-mus.org/terms/',
        umbel: 'http://umbel.org/umbel/rc/'
    },
    stats: []
}

const dataset = (state = initialState, action) => {
    switch (action.type) {
    case types.INIT:
        return {
            ...state
        }
    case types.SET_STATS:
    case types.SET_CONFIGS:
        return {
            ...state,
            labels: action.labels || state.labels,
            constraints: action.constraints || state.constraints,
            stats: action.stats || state.stats,
            prefixes: action.prefixes || state.prefixes,
            entrypoint: action.entrypoint || state.entrypoint,
            resourceGraph: action.resourceGraph || state.resourceGraph
        }
    case types.SET_RESOURCES:
        return {
            ...state,
            resources: action.resources,
            stats: action.stats || state.stats,
            labels: action.labels || state.labels,
            entrypoint: action.entrypoint,
            prefixes: action.prefixes || state.prefixes,
            constraints: action.constraints || state.constraints,
            resourceGraph: action.resourceGraph || state.resourceGraph
        }
    case types.SET_DATA:
        return {
            ...state
        }
    default:
        return state
    }
}

export default dataset
