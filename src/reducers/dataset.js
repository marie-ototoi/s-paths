import * as types from '../constants/ActionTypes'

const initialState = {
    endpoint: 'http://wilda.lri.fr:3030/nobel/sparql', //'http://localhost:8890/sparql', //    'http://slickmem.data.t-mus.org/sparql'
    entrypoint: 'http://data.nobelprize.org/terms/LaureateAward', //'http://xmlns.com/foaf/0.1/Document', //'foaf:Document', // 'nobel:Laureate',  //  'nobel:LaureateAward',
    defaultGraph: null, // 'http://localhost:8890/data10',
    constraints: '',  // '?entrypoint <http://data.nobelprize.org/terms/year> ?year . filter (?year > 1980)',
    forceUpdate: false,
    maxLevel: 4,
    prefixes: {
        dcterms: 'http://purl.org/dc/terms/',
        /*d2r: 'http://sites.wiwiss.fu-berlin.de/suhl/bizer/d2r-server/config.rdf#',
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
        insee: 'http://rdf.insee.fr/def/geo#',
        isni: 'http://isni.org/ontology#',
        marcrel: 'http://id.loc.gov/vocabulary/relators/',
        mo: 'http://musicontology.com/',
        ore: 'http://www.openarchives.org/ore/terms/',
        rdagroup1elements: 'http://rdvocab.info/Elements/',
        rdagroup2elements: 'http://rdvocab.info/ElementsGr2/',
        rdarelationships: 'http://rdvocab.info/RDARelationshipsWEMI',
        schemaorg: 'http://schema.org/',
        blt: 'http://www.bl.uk/schemas/bibliographic/blterms#', // t-mus
        event: 'http://purl.org/NET/c4dm/event.owl#',
        frbr: 'http://purl.org/vocab/frbr/core#',
        sim: 'http://purl.org/ontology/similarity/',
        slickm: 'http://slickmem.data.t-mus.org/',
        slickmem: 'http://slickmem.data.t-mus.org/terms/'*/
    },
    status: 'off',
    stats: []
}

const initialConfig = { properties: [], score: 0 }

const dataset = (state = initialState, action) => {
    switch (action.type) {
    case types.INIT:
        return {
            ...state
        }
    case types.SET_PREFIXED_ENTRYPOINT:
        return {
            ...state,
            entrypoint: action.entrypoint,
            prefixes: action.prefixes
        }
    case types.SET_STATS:
        return {
            ...state,
            stats: action.stats
        }
    case types.SET_CONFIGS:
        return {
            ...state
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
