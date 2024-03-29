import types from '../constants/ActionTypes'

let initialState = {
  endpoint: process.env.ENDPOINT || 'http://localhost:8890/sparql',
  localEndpoint: process.env.LOCAL_ENDPOINT || 'http://localhost:8890/sparql',
  entrypoint: '',
  graphs: [],
  resourceGraph: null,
  constraints: '',
  labels: [],
  maxLevel: 5,
  ignoreList: ['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'],
  resources: [],
  rankPropFactors: {
    category: 1,
    definition: 4,
    level: 3,
    coverage: 8,
    customProps: 8,
  },
  rankMatchFactors: {
    view: 6,
    propsNumber: 3,
    propsAverage: 5,
  },
  prefixes: {},
  stats: [],
  propertyPreferences: {},
  prefixcc: true,
}

if (process.env.APP_NAME === 'bnf') {
  initialState = {
    ...initialState,
    graphs: ['http://bnf.ilda.fr'],
    prefixes: {
      ark: 'http://data.bnf.fr/ark:/',
      bnf: 'http://data.bnf.fr/ontology/bnf-onto/',
      'bnf-roles': 'http://data.bnf.fr/vocabulary/roles/',
      dcterms: 'http://purl.org/dc/terms/',
      d2r: 'http://sites.wiwiss.fu-berlin.de/suhl/bizer/d2r-server/config.rdf#',
      dbpedia: 'http://dbpedia.org/resource/',
      'dbpedia-owl': 'http://dbpedia.org/ontology/',
      dbpprop: 'http://dbpedia.loc/property/',
      foaf: 'http://xmlns.com/foaf/0.1/',
      freebase: 'http://rdf.freebase.com/ns/',
      map: 'http://data.nobelprize.org/resource/#',
      meta: 'http://www4.wiwiss.fu-berlin.de/bizer/d2r-server/metadata#',
      owl: 'http://www.w3.org/2002/07/owl#',
      'owl-time': 'http://www.w3.org/TR/owl-time/',
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
      'loc-countries': 'http://id.loc.gov/vocabulary/countries/',
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
      umbel: 'http://umbel.org/umbel/rc/',
    },
  }
} else if (process.env.APP_NAME === 'amd') {
  initialState = {
    ...initialState,
    graphs: ['http://amd.ilda.fr', 'http://amd.alignments.ilda.fr'],
    prefixes: {
      ore: 'http://www.openarchives.org/ore/terms/',
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      ens: 'http://www.europeana.eu/schemas/edm/',
      ahm: 'http://purl.org/collections/nl/am/',
    },
  }
} else if (process.env.APP_NAME === 'rism') {
  initialState = {
    ...initialState,
    graphs: ['http://rism.ilda.fr', 'http://types.rism.ilda.fr'],
    prefixes: {
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      rdagr1: 'http://rdvocab.info/Elements/',
      cc: 'https://creativecommons.org/ns#',
      mo: 'http://purl.org/ontology/mo/',
      geonames: 'http://www.geonames.org/ontology#',
      owl: 'http://www.w3.org/2002/07/owl#',
      dcmitype: 'http://purl.org/dc/dcmitype/',
      skos: 'http://www.w3.org/2004/02/skos/core#',
      bsbmo: 'http://bsb-muenchen.de/ont/bsbMusicOntology#',
      frbr: 'http://purl.org/vocab/frbr/core#',
      dct: 'http://purl.org/dc/terms/',
      marcrel: 'http://id.loc.gov/vocabulary/relators/',
      bibo: 'http://purl.org/ontology/bibo/',
      daia: 'http://uri.gbv.de/ontology/daia/',
      gnd: 'http://d-nb.info/standards/elementset/gnd#',
      isbd: 'http://iflastandards.info/ns/isbd/elements/',
      foaf: 'http://xmlns.com/foaf/0.1/',
      dc: 'http://purl.org/dc/elements/1.1/',
    },
  }
} else if (process.env.APP_NAME === 'eli') {
  initialState = {
    ...initialState,
    graphs: ['http://legilux.ilda.fr', 'http://legilux.voc.ilda.fr'],
    prefixes: {
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      eli: 'http://data.europa.eu/eli/ontology#',
      'legilux-resource': 'http://data.legilux.public.lu/resource/authority/',
      'legilux-eli': 'http://data.legilux.public.lu/eli/',
    },
  }
} else if (process.env.APP_NAME === 'lri') {
  initialState = {
    ...initialState,
    graphs: ['http://lri.ilda.fr'],
  }
} else if (process.env.APP_NAME === 'mdb') {
  initialState = {
    ...initialState,
    graphs: ['http://mdb.ilda.fr'],
  }
} else if (process.env.APP_NAME === 'peel') {
  initialState = {
    ...initialState,
    graphs: ['http://peel.ilda.fr'],
    prefixes: {
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      mo: 'http://purl.org/ontology/mo/',
      dcterms: 'http://purl.org/dc/terms/',
      foaf: 'http://xmlns.com/foaf/0.1/',
      dc: 'http://purl.org/dc/elements/1.1/',
    },
  }
} else if (process.env.APP_NAME === 'besdui') {
  initialState = {
    ...initialState,
    graphs: ['urn:bsbm'],
    prefixes: {
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      xsd: 'http://www.w3.org/2001/XMLSchema#',
      dcterms: 'http://purl.org/dc/terms/',
      foaf: 'http://xmlns.com/foaf/0.1/',
      dc: 'http://purl.org/dc/elements/1.1/',
      rev: 'http://purl.org/stuff/rev#',
      bsbm: 'http://www4.wiwiss.fu-berlin.de/bizer/bsbm/v01/vocabulary/',
      'bsbm-inst': 'http://www4.wiwiss.fu-berlin.de/bizer/bsbm/v01/instances/',
    },
  }
} else if (process.env.APP_NAME === 'nobel') {
  initialState = {
    ...initialState,
    graphs: ['http://nobel.ilda.fr', 'http://dbpedianobel.ilda.fr'],
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
      nobel: 'http://data.nobelprize.org/terms/',
      nobelR: 'http://data.nobelprize.org/resource/',
      nobelprizes: 'http://nobelprize.org/nobel_prizes/',
      owl: 'http://www.w3.org/2002/07/owl#',
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      skos: 'http://www.w3.org/2004/02/skos/core#',
    },
    propertyPreferences: {
      'dbpedia-owl:Award/nobel:year/*': 1,
      'dbpedia-owl:Award/nobel:category/*/rdfs:label/*': 0.9,
      'nobel:Laureate/nobel:nobelPrize/*/nobel:year/*': 1,
      'nobel:Laureate/dbpprop:dateOfBirth/*': 0.9,
      'nobel:Laureate/foaf:name/*': 0.7,
      'nobel:Laureate/foaf:gender/*': 0.8,
      'nobel:Laureate/nobel:laureateAward/*/nobel:category/*/rdfs:label/*': 1,
    },
  }
} else {
  initialState = {
    ...initialState,
    graphs: ['http://default'],
    prefixes: {
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      skos: 'http://www.w3.org/2004/02/skos/core#',
    },
    propertyPreferences: {},
  }
}

const dataset = (state = initialState, action) => {
  let newState
  switch (action.type) {
    case types.INIT:
      return {
        ...state,
      }
    case types.SET_STATS:
    case types.SET_CONFIGS:
      return {
        ...state,
        labels: action.labels || state.labels,
        constraints:
          action.constraints || action.constraints === '' ? action.constraints : state.constraints,
        stats: action.stats || state.stats,
        prefixes: action.prefixes || state.prefixes,
        entrypoint: action.entrypoint || state.entrypoint,
        resourceGraph: action.resourceGraph || state.resourceGraph,
      }
    case types.SET_RESOURCES:
      return {
        ...state,
        resources: action.resources,
        stats: action.stats || state.stats,
        labels: action.labels || state.labels,
        entrypoint: action.entrypoint,
        prefixes: action.prefixes || state.prefixes,
        constraints:
          action.constraints || action.constraints === '' ? action.constraints : state.constraints,
        resourceGraph: action.resourceGraph || state.resourceGraph,
        graphs: action.graphs,
      }
    case types.SAVE_RANKFACTOR:
      newState = { ...state }
      newState[action.group][action.name] = action.value
      return newState
    case types.SAVE_GRAPHS:
      return {
        ...state,
        graphs: action.graphs,
      }
    case types.SET_DATA:
      return {
        ...state,
      }
    default:
      return state
  }
}

export default dataset
