const explore = (resourceEnsemble, maxUnique, maxDepth) => {
    return {
        total_instances: 911,
        statements: [
            {
                path: 'nobel:LaureateAward/nobel:year/*',
                label: 'year',
                category: 'datetime',
                format: 'Y',
                unique_values: 113,
                total_values: 911,
                coverage: 100,
                max_value: 2016,
                min_value: 1901
            },
            {
                path: 'nobel:LaureateAward/nobel:field/*',
                label: 'field',
                category: 'text',
                language: 'en',
                coverage: 100,
                unique_values: 151,
                total_values: 1251
            },
            {
                path: 'nobel:LaureateAward/nobel:category/*',
                label: 'category',
                category: 'uri',
                coverage: 100,
                unique_values: 6,
                total_values: 911
            },
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*',
                label: 'gender of Laureate',
                category: 'text',
                coverage: 90,
                unique_values: 2,
                total_values: 885,
                language: 'en'
            },
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/dbpprop:dateOfBirth/*',
                label: 'date of birth of Laureate',
                category: 'datetime',
                format: 'Y-m-d',
                coverage: 80,
                total_values: 883,
                unique_values: 868
            },
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:birthday',
                label: 'date of birth of Laureate',
                category: 'datetime',
                format: 'Y-m-d',
                coverage: 60,
                total_values: 883,
                unique_values: 868
            },
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/dbpprop:dateOfDeath/*',
                label: 'date of death of Laureate',
                category: 'datetime',
                format: 'Y-m-d',
                coverage: 70,
                total_values: 600,
                unique_values: 589

            },
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/dbpedia-owl:birthPlace/dbpedia-owl:City',
                label: 'place of birth of Laureate (city)',
                category: 'geo',
                granularity: 'city',
                coverage: 78,
                total_values: 884,
                unique_values: 602
            },
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/dbpedia-owl:birthPlace/dbpedia-owl:Country',
                label: 'place of birth of Laureate (country)',
                category: 'geo',
                granularity: 'country',
                coverage: 76,
                total_values: 885,
                unique_values: 121
            },
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/dbpedia-owl:deathPlace/dbpedia-owl:City',
                label: 'place of death of Laureate (city)',
                category: 'geo',
                granularity: 'city',
                coverage: 54,
                total_values: 582,
                unique_values: 293
            },
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/dbpedia-owl:deathPlace/dbpedia-owl:Country',
                label: 'place of death of Laureate (country)',
                category: 'geo',
                granularity: 'country',
                coverage: 56,
                total_values: 588,
                unique_values: 52
            },
            {
                path: 'nobel:LaureateAward/nobel:university/dbpedia-owl:University/dbpedia-owl:country/dbpedia-owl:Country',
                label: 'place of university (country)',
                category: 'geo',
                granularity: 'country',
                coverage: 94,
                total_values: 742,
                unique_values: 29
            },
            {
                path: 'nobel:LaureateAward/nobel:university/dbpedia-owl:University/dbpedia-owl:city/dbpedia-owl:City',
                label: 'place of university (city)',
                category: 'geo',
                granularity: 'city',
                coverage: 92,
                total_values: 1009,
                unique_values: 185
            }
        ]
    }
}

const load = (query) => {
    /*
    HeatMap
    SELECT DISTINCT ?prop1 (COUNT(?prop1) as ?countprop1)  ?prop2 (COUNT(?prop2) as ?countprop2) WHERE {
      ?entrypoint rdf:type nobel:LaureateAward .
      ?entrypoint nobel:year ?prop1.
      ?entrypoint nobel:laureate ?y.
      ?y foaf:gender ?prop2.
    }
    category BY ?prop1 ?prop2 */
    return (query === 'Timeline') ? {
      "head": {
        "vars": [ "entrypointlabel" , "prop1" , "prop2" , "prop3" ]
      } ,
      "results": {
        "bindings": [
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1963, Karl Ziegler" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1963" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1920, Léon Victor Auguste Bourgeois" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1920" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1980, Baruj Benacerraf" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1980" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2008, Harald zur Hausen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2008" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1969, Jan Tinbergen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1969" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2007, Gerhard Ertl" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2007" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1946, Hermann Hesse" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1946" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1998, Daniel C. Tsui" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1998" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1936, Eugene Gladstone O'Neill" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1936" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2012, Mo Yan" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2012" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1979, Mother Teresa " } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1979" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1983, Gerard Debreu" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1983" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1949, Walter Rudolf Hess" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1949" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2002, Masatoshi Koshiba" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2002" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1902, Pieter Zeeman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1902" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1925, James Franck" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1925" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1963, Eugene Paul Wigner" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1963" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1982, Sune K. Bergström" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1982" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1926, Aristide Briand" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1926" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1993, Kary B. Mullis" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1993" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1909, Karl Ferdinand Braun" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1909" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1985, Michael S. Brown" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1985" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2003, Clive W.J. Granger" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2003" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2008, Osamu Shimomura" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2008" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1957, Lord (Alexander R.) Todd" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1957" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1952, Archer John Porter Martin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1952" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2013, Alice Munro" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2013" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1994, Kenzaburo Oe" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1994" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2016, Jean-Pierre Sauvage" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2016" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1956, Dickinson W. Richards" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1956" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1979, Georg Wittig" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1979" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1993, Douglass C. North" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1993" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1991, Erwin Neher" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1991" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1998, John A. Pople" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1998" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1927, Heinrich Otto Wieland" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1927" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2014, Malala Yousafzai" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2014" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1922, Niels Henrik David Bohr" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1922" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1974, Eisaku Sato" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1974" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1962, Maurice Hugh Frederick Wilkins" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1962" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1919, Thomas Woodrow Wilson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1919" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1926, Johannes Andreas Grib Fibiger" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1926" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1962, John Cowdery Kendrew" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1962" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2014, Edvard I. Moser" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2014" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2011, Saul Perlmutter" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2011" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1961, Ivo Andric" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1961" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1997, Jody Williams" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1997" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1958, Georges Pire" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1958" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1997, Stanley B. Prusiner" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1997" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2010, Liu Xiaobo" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2010" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1991, Nadine Gordimer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1991" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2006, Roger D. Kornberg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2006" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1974, Paul J. Flory" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1974" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2015, Tomas Lindahl" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2015" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1926, Grazia Deledda" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1926" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1919, Carl Friedrich Georg Spitteler" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1919" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2005, Mohamed ElBaradei" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2005" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1944, Herbert Spencer Gasser" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1944" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1935, Hans Spemann" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1935" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2001, Tim Hunt" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2001" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1968, Robert W. Holley" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1968" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1931, Otto Heinrich Warburg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1931" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2001, George A. Akerlof" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2001" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1915, Sir William Henry Bragg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1915" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2000, Kim Dae-jung" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2000" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1973, Henry A. Kissinger" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1973" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1948, Patrick Maynard Stuart Blackett" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1948" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1918, Fritz Haber" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1918" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1978, Robert Woodrow Wilson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1978" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2007, Leonid Hurwicz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2007" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2013, Arieh Warshel" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2013" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1987, Jean-Marie Lehn" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1987" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1946, James Batcheller Sumner" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1946" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1994, Martin Rodbell" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1994" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1982, Aaron Klug" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1982" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2016, Bob Dylan" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2016" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1964, Nicolay Gennadiyevich Basov" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1964" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1985, Claude Simon" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1985" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1939, Adolf Friedrich Johann Butenandt" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1939" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1931, Friedrich Bergius" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1931" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1950, Philip Showalter Hench" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1950" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2014, Kailash Satyarthi" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2014" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2002, Sydney Brenner" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2002" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1965, François Jacob" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1965" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1988, Jack Steinberger" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1988" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1995, Paul J. Crutzen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1995" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1911, Count Maurice (Mooris) Polidore Marie Bernhard Maeterlinck" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1911" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1924, Willem Einthoven" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1924" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1984, Simon van der Meer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1984" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2011, Leymah Gbowee" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2011" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1908, Fredrik Bajer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1908" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1958, George Wells Beadle" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1958" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1913, Alfred Werner" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1913" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1957, Lester Bowles Pearson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1957" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1938, Enrico Fermi" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1938" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1993, Nelson Mandela" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1993" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1955, Vincent du Vigneaud" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1955" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1972, Leon Neil Cooper" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1972" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1976, Baruch S. Blumberg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1976" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2007, Oliver Smithies" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2007" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1998, José Saramago" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1998" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1995, Martin L. Perl" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1995" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1925, George Bernard Shaw" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1925" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1902, Ronald Ross" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1902" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1974, Albert Claude" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1974" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1944, Joseph Erlanger" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1944" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1980, Lawrence R. Klein" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1980" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1975, Tjalling C. Koopmans" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1975" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2012, Serge Haroche" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2012" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1963, Andrew Fielding Huxley" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1963" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1957, Chen Ning Yang" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1957" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1981, Roger W. Sperry" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1981" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1955, Halldór Kiljan Laxness" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1955" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1952, Edward Mills Purcell" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1952" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1936, Carl David Anderson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1936" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1907, Eduard Buchner" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1907" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1922, Otto Fritz Meyerhof" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1922" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1975, Aage Niels Bohr" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1975" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1986, Elie Wiesel" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1986" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1950, Kurt Alder" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1950" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1977, Ilya Prigogine" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1977" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1934, Arthur Henderson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1934" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1972, William H. Stein" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1972" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1996, William Vickrey" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1996" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1986, James M. Buchanan Jr." } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1986" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1975, Eugenio Montale" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1975" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1967, Miguel Angel Asturias" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1967" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1989, Harold E. Varmus" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1989" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1986, Stanley Cohen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1986" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1959, Emilio Gino Segrè" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1959" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2009, Barack H. Obama" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2009" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2004, Irwin Rose" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2004" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2009, Charles Kuen Kao" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2009" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1912, Nils Gustaf Dalén" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1912" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1922, Francis William Aston" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1922" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1960, Peter Brian Medawar" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1960" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1979, Steven Weinberg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1979" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1902, Christian Matthias Theodor Mommsen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1902" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1974, Sir Martin Ryle" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1974" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1985, Herbert A. Hauptman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1985" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2013, Lars Peter Hansen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2013" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1996, Carlos Filipe Ximenes Belo" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1996" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2016, Juan Manuel Santos" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2016" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1929, Prince Louis-Victor Pierre Raymond de Broglie" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1929" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1912, Alexis Carrel" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1912" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1935, Frédéric Joliot" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1935" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1988, Naguib Mahfouz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1988" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1907, Charles Louis Alphonse Laveran" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1907" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1992, Edwin G. Krebs" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1992" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1968, Lars Onsager" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1968" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2006, Craig C. Mello" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2006" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1979, Sir Arthur Lewis" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1979" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1996, Robert F. Curl Jr." } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1996" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2005, Yves Chauvin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2005" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1990, Elias James Corey" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1990" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2000, Daniel L. McFadden" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2000" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1916, Carl Gustaf Verner von Heidenstam" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1916" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1929, Christiaan Eijkman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1929" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1903, William Randal Cremer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1903" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2000, Zhores I. Alferov" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2000" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1944, Isidor Isaac Rabi" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1944" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1961, Dag Hjalmar Agne Carl Hammarskjöld" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1961" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1969, Ragnar Frisch" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1969" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1950, Ralph Bunche" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1950" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1977, John Hasbrouck van Vleck" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1977" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2013, Peter W. Higgs" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2013" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1928, Sigrid Undset" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1928" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1976, William N. Lipscomb" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1976" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1991, Pierre-Gilles de Gennes" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1991" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2012, Brian K. Kobilka" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2012" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1978, Menachem Begin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1978" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1996, James A. Mirrlees" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1996" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1971, Earl W. Sutherland, Jr." } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1971" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1902, Hendrik Antoon Lorentz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1902" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1905, Robert Koch" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1905" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1967, Manfred Eigen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1967" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1977, James E. Meade" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1977" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1925, Charles Gates Dawes" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1925" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1981, Torsten N. Wiesel" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1981" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1912, Elihu Root" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1912" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1978, Daniel Nathans" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1978" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2008, Toshihide Maskawa" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2008" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1976, Samuel Chao Chung Ting" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1976" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1990, Mikhail Sergeyevich Gorbachev" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1990" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2013, Randy W. Schekman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2013" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1904, Sir William Ramsay" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1904" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1983, Lech Walesa" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1983" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1956, Werner Forssmann" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1956" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1952, Selman Abraham Waksman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1952" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1937, Cecil of Chelwood, Viscount (Lord Edgar Algernon Robert Gascoyne Cecil)" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1937" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2002, Daniel Kahneman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2002" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1947, Gerty Theresa Cori, née Radnitz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1947" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1998, Walter Kohn" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1998" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1970, Sir Bernard Katz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1970" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1926, The (Theodor) Svedberg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1926" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1961, Robert Hofstadter" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1961" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1988, Sir James W. Black" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1988" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2009, Thomas A. Steitz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2009" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2004, Frank Wilczek" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2004" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1974, Gunnar Myrdal" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1974" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1907, Albert Abraham Michelson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1907" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1962, Max Ferdinand Perutz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1962" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2011, Christopher A. Sims" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2011" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1959, Severo Ochoa" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1959" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1973, Leo Esaki" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1973" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2016, David J. Thouless" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2016" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1945, Gabriela Mistral" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1945" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1998, Horst L. Störmer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1998" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1934, Luigi Pirandello" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1934" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1919, Jules Bordet" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1919" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1908, Paul Ehrlich" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1908" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1937, Walter Norman Haworth" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1937" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1978, Mohamed Anwar al-Sadat" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1978" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1906, Joseph John Thomson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1906" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1927, Arthur Holly Compton" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1927" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1917, Henrik Pontoppidan" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1917" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1971, Gerhard Herzberg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1971" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2014, Stefan W. Hell" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2014" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1967, George Wald" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1967" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1987, K. Alexander Müller" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1987" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1908, Rudolf Christoph Eucken" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1908" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2000, Eric R. Kandel" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2000" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1947, Sir Edward Victor Appleton" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1947" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1984, César Milstein" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1984" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1958, Boris Leonidovich Pasternak" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1958" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2009, Elizabeth H. Blackburn" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2009" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2003, Robert F. Engle III" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2003" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2007, Albert Arnold (Al) Gore Jr." } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2007" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1953, George Catlett Marshall" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1953" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1975, David Baltimore" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1975" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1910, Otto Wallach" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1910" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1976, Burton Richter" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1976" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1938, Pearl Buck" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1938" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1969, Murray Gell-Mann" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1969" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1931, Erik Axel Karlfeldt" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1931" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1956, André Frédéric Cournand" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1956" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1979, Herbert C. Brown" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1979" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1993, Robert W. Fogel" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1993" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1939, Gerhard Domagk" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1939" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1973, Karl von Frisch" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1973" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1931, Carl Bosch" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1931" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1903, Marie Curie, née Sklodowska" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1903" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2001, Kofi Annan" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2001" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1921, Albert Einstein" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1921" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1976, Betty Williams" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1976" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2001, Carl E. Wieman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2001" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1956, William Bradford Shockley" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1956" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1984, Carlo Rubbia" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1984" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2014, May-Britt Moser" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2014" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2008, Jean-Marie Gustave Le Clézio" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2008" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2003, Anthony J. Leggett" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2003" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1901, Frédéric Passy" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1901" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1986, Yuan T. Lee" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1986" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1951, Pär Fabian Lagerkvist" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1951" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1972, John Bardeen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1972" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1996, Rolf M. Zinkernagel" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1996" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1954, Linus Carl Pauling" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1954" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2010, Mario Vargas Llosa" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2010" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1997, Dario Fo" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1997" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1933, Erwin Schrödinger" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1933" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1948, Arne Wilhelm Kaurin Tiselius" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1948" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1990, Octavio Paz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1990" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1931, Jane Addams" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1931" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1981, Elias Canetti" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1981" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1994, Clifford G. Shull" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1994" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2002, Jimmy Carter" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2002" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2015, Arthur B. McDonald" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2015" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1924, Wladyslaw Stanislaw Reymont" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1924" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2005, Richard R. Schrock" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2005" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1969, Salvador E. Luria" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1969" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1989, Wolfgang Paul" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1989" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1934, William Parry Murphy" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1934" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1971, Willy Brandt" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1971" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1980, George D. Snell" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1980" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2011, Dan Shechtman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2011" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1906, Theodore Roosevelt" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1906" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1964, Dorothy Crowfoot Hodgkin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1964" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2008, Luc Montagnier" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2008" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1952, Felix Bloch" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1952" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1971, Simon Kuznets" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1971" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1977, Andrew V. Schally" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1977" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1974, George E. Palade" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1974" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1948, Thomas Stearns Eliot" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1948" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1999, Martinus J.G. Veltman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1999" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2010, Richard F. Heck" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2010" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1981, Roald Hoffmann" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1981" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2016, Yoshinori Ohsumi" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2016" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1972, Stanford Moore" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1972" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2012, Alvin E. Roth" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2012" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1985, Franco Modigliani" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1985" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1950, Tadeus Reichstein" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1950" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1903, Pierre Curie" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1903" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1945, Sir Howard Walter Florey" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1945" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1963, J. Hans D. Jensen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1963" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1966, Peyton Rous" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1966" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1994, George A. Olah" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1994" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2000, Alan J. Heeger" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2000" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1911, Wilhelm Wien" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1911" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2004, Richard Axel" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2004" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1912, Paul Sabatier" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1912" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1988, Robert Huber" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1988" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1953, Hermann Staudinger" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1953" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2013, Eugene F. Fama" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2013" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1997, Myron S. Scholes" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1997" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2016, Bernard L. Feringa" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2016" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1980, Walter Gilbert" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1980" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1994, John F. Nash Jr." } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1994" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1972, Heinrich Böll" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1972" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1992, Edmond H. Fischer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1992" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1929, Arthur Harden" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1929" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1924, Karl Manne Georg Siegbahn" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1924" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2012, Shinya Yamanaka" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2012" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2004, Edward C. Prescott" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2004" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1963, Alan Lloyd Hodgkin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1963" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1915, Romain Rolland" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1915" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1986, Gerd Binnig" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1986" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1928, Charles Jules Henri Nicolle" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1928" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2014, Hiroshi Amano" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2014" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2001, Sir Paul M. Nurse" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2001" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1905, Henryk Sienkiewicz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1905" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1982, Kenneth G. Wilson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1982" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1998, David Trimble" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1998" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1960, Albert John Lutuli" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1960" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1936, Victor Franz Hess" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1936" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1998, Louis J. Ignarro" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1998" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2010, Christopher A. Pissarides" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2010" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1975, Vladimir Prelog" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1975" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2002, John B. Fenn" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2002" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1990, William F. Sharpe" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1990" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2005, Thomas C. Schelling" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2005" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1966, Nelly Sachs" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1966" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1936, Otto Loewi" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1936" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1968, Marshall W. Nirenberg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1968" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1932, Edgar Douglas Adrian" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1932" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2000, Jack S. Kilby" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2000" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1974, Seán MacBride" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1974" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1954, Walther Bothe" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1954" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1950, Cecil Frank Powell" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1950" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1921, Frederick Soddy" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1921" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1979, Abdus Salam" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1979" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1997, Claude Cohen-Tannoudji" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1997" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1995, Joseph Rotblat" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1995" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1903, Svante August Arrhenius" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1903" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1995, Christiane Nüsslein-Volhard" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1995" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2015, Angus Deaton" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2015" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1978, Isaac Bashevis Singer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1978" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1965, Sin-Itiro Tomonaga" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1965" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1987, Joseph Brodsky" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1987" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1947, Carl Ferdinand Cori" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1947" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1964, Jean-Paul Sartre" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1964" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1960, Donald Arthur Glaser" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1960" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2005, Theodor W. Hänsch" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2005" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1965, Jacques Monod" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1965" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1921, Christian Lous Lange" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1921" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1989, Thomas R. Cech" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1989" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2009, Venkatraman Ramakrishnan" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2009" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2004, H. David Politzer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2004" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1913, Rabindranath Tagore" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1913" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1983, Barbara McClintock" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1983" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2011, Ralph M. Steinman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2011" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1986, Ernst Ruska" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1986" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2011, Thomas J. Sargent" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2011" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1915, Richard Martin Willstätter" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1915" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1958, Joshua Lederberg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1958" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1978, Arno Allan Penzias" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1978" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1943, Otto Stern" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1943" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1994, Yasser Arafat" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1994" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1972, John Robert Schrieffer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1972" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2007, Peter Grünberg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2007" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2013, Michael Levitt" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2013" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1966, Alfred Kastler" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1966" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1954, John Franklin Enders" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1954" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2010, Robert G. Edwards" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2010" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1926, Jean Baptiste Perrin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1926" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1997, Paul D. Boyer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1997" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1994, Alfred G. Gilman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1994" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1970, Luis F. Leloir" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1970" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1982, George J. Stigler" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1982" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1966, Robert S. Mulliken" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1966" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1904, Ivan Petrovich Pavlov" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1904" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1918, Max Karl Ernst Ludwig Planck" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1918" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2009, Oliver E. Williamson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2009" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1977, Bertil Ohlin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1977" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2005, J. Robin Warren" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2005" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1964, Feodor Lynen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1964" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1978, Werner Arber" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1978" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1911, Alfred Hermann Fried" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1911" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1959, Jaroslav Heyrovsky" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1959" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1957, Albert Camus" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1957" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1966, Charles Brenton Huggins" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1966" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1909, Wilhelm Ostwald" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1909" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1937, George Paget Thomson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1937" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1923, John James Rickard Macleod" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1923" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1946, John Raleigh Mott" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1946" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1975, Leo James Rainwater" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1975" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2013, James E. Rothman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2013" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1989, The 14th Dalai Lama (Tenzin Gyatso) " } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1989" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1936, Carlos Saavedra Lamas" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1936" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1973, Geoffrey Wilkinson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1973" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1988, Maurice Allais" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1988" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1969, Samuel Beckett" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1969" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1963, Giorgos Seferis" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1963" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1927, Ferdinand Buisson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1927" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1990, E. Donnall Thomas" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1990" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1987, Susumu Tonegawa" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1987" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2004, Wangari Muta Maathai" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2004" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2009, George E. Smith" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2009" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1982, John R. Vane" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1982" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1909, Paul Henri Benjamin Balluet d'Estournelles de Constant, Baron de Constant de Rebecque" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1909" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1981, Nicolaas Bloembergen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1981" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1986, Dudley R. Herschbach" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1986" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1932, Werner Karl Heisenberg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1932" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1914, Robert Bárány" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1914" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1980, Czeslaw Milosz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1980" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1936, Petrus (Peter) Josephus Wilhelmus Debye" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1936" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1969, Odd Hassel" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1969" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1993, Phillip A. Sharp" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1993" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2002, Raymond Davis Jr." } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2002" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2001, Joseph E. Stiglitz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2001" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1992, Rudolph A. Marcus" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1992" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1907, Rudyard Kipling" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1907" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2011, Adam G. Riess" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2011" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1930, Karl Landsteiner" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1930" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1905, Baroness Bertha Sophie Felicita von Suttner, née Countess Kinsky von Chinic und Tettau" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1905" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1970, Paul A. Samuelson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1970" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1952, Albert Schweitzer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1952" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1974, Christian de Duve" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1974" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1970, Hannes Olof Gösta Alfvén" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1970" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1951, Glenn Theodore Seaborg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1951" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1993, Toni Morrison" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1993" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2006, Muhammad Yunus" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2006" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1930, Sinclair Lewis" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1930" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1996, Douglas D. Osheroff" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1996" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2015, Aziz Sancar" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2015" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1993, Russell A. Hulse" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1993" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1921, Anatole France" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1921" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2015, William C. Campbell" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2015" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1980, Adolfo Pérez Esquivel" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1980" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1934, Harold Clayton Urey" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1934" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1972, Rodney R. Porter" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1972" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1938, Corneille Jean François Heymans" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1938" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1903, Antoine Henri Becquerel" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1903" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1945, Ernst Boris Chain" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1945" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1979, Theodore W. Schultz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1979" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1962, James Dewey Watson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1962" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2001, Wolfgang Ketterle" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2001" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1955, Polykarp Kusch" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1955" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1979, Godfrey N. Hounsfield" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1979" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2007, Roger B. Myerson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2007" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2003, Vitaly L. Ginzburg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2003" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2008, Roger Y. Tsien" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2008" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1954, Ernest Miller Hemingway" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1954" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1988, Johann Deisenhofer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1988" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1977, Sir Nevill Francis Mott" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1977" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2013, François Englert" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2013" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1992, Rigoberta Menchú Tum" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1992" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1947, Sir Robert Robinson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1947" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1943, George de Hevesy" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1943" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1930, Lars Olof Jonathan (Nathan) Söderblom" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1930" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2002, Imre Kertész" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2002" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1948, Paul Hermann Müller" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1948" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2002, John E. Sulston" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2002" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1970, Julius Axelrod" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1970" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1928, Adolf Otto Reinhold Windaus" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1928" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1962, Lev Davidovich Landau" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1962" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2001, Leland H. Hartwell" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2001" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1989, Hans G. Dehmelt" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1989" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2004, Avram Hershko" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2004" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2009, Herta Müller" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2009" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1975, Leonid Vitaliyevich Kantorovich" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1975" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1909, Guglielmo Marconi" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1909" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1963, Giulio Natta" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1963" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1998, John Hume" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1998" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1956, Nikolay Nikolaevich Semenov" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1956" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1977, Roger Guillemin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1977" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1999, Gerardus 't Hooft" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1999" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1947, André Paul Guillaume Gide" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1947" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2016, J. Michael Kosterlitz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2016" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2010, Dale T. Mortensen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2010" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1937, Roger Martin du Gard" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1937" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2010, Konstantin Novoselov" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2010" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1996, David M. Lee" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1996" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1922, Archibald Vivian Hill" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1922" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1964, Charles Hard Townes" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1964" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1984, Jaroslav Seifert" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1984" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1938, Richard Kuhn" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1938" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2005, Robert J. Aumann" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2005" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2014, Patrick Modiano" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2014" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1932, Sir Charles Scott Sherrington" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1932" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1968, Har Gobind Khorana" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1968" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1988, Melvin Schwartz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1988" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1910, Paul Johann Ludwig Heyse" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1910" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1958, Pavel Alekseyevich Cherenkov" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1958" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2000, Herbert Kroemer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2000" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1985, Joseph L. Goldstein" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1985" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1949, Hideki Yukawa" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1949" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1908, Klas Pontus Arnoldson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1908" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2003, Shirin Ebadi" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2003" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1960, Saint-John Perse" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1960" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1902, Charles Albert Gobat" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1902" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1975, Howard Martin Temin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1975" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2007, Sir Martin J. Evans" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2007" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1997, Robert C. Merton" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1997" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1984, Robert Bruce Merrifield" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1984" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1980, Paul Berg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1980" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1977, Vicente Aleixandre" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1977" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1994, John C. Harsanyi" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1994" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1971, Pablo Neruda" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1971" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1973, Nikolaas Tinbergen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1973" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1943, Edward Adelbert Doisy" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1943" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1932, Irving Langmuir" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1932" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1901, Emil Adolf von Behring" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1901" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1905, Philipp Eduard Anton von Lenard" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1905" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1923, Robert Andrews Millikan" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1923" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1921, Karl Hjalmar Branting" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1921" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2001, K. Barry Sharpless" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2001" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1914, Max von Laue" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1914" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1956, Walter Houser Brattain" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1956" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1985, Klaus von Klitzing" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1985" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2014, Isamu Akasaki" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2014" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1904, José Echegaray y Eizaguirre" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1904" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1998, Robert F. Furchgott" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1998" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1987, Donald J. Cram" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1987" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1945, Artturi Ilmari Virtanen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1945" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2010, Peter A. Diamond" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2010" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1999, Günter Grass" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1999" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1950, Otto Paul Hermann Diels" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1950" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2016, Bengt Holmström" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2016" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1933, Sir Norman Angell (Ralph Lane)" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1933" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1983, William Golding" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1983" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1992, Gary S. Becker" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1992" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2006, George F. Smoot" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2006" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1996, Richard E. Smalley" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1996" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2009, Elinor Ostrom" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2009" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1990, Richard E. Taylor" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1990" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1936, Sir Henry Hallett Dale" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1936" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2009, Jack W. Szostak" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2009" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1973, Le Duc Tho " } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1973" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1907, Louis Renault" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1907" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1958, Frederick Sanger" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1958" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2011, Ellen Johnson Sirleaf" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2011" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1957, Daniel Bovet" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1957" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1953, Frits Zernike" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1953" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2014, John O'Keefe" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2014" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1955, Axel Hugo Theodor Theorell" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1955" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1997, Steven Chu" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1997" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1950, Earl (Bertrand Arthur William) Russell" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1950" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2010, Akira Suzuki" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2010" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1911, Allvar Gullstrand" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1911" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1983, Henry Taube" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1983" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1973, Ernst Otto Fischer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1973" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1982, Alfonso García Robles" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1982" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1987, Robert M. Solow" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1987" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1906, Santiago Ramón y Cajal" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1906" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1967, George Porter" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1967" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1962, John Steinbeck" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1962" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1926, Gustav Stresemann" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1926" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1934, George Richards Minot" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1934" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2000, Hideki Shirakawa" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2000" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1982, Bengt I. Samuelsson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1982" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2000, Paul Greengard" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2000" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2011, Jules A. Hoffmann" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2011" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1980, Val Logsdon Fitch" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1980" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1914, Theodore William Richards" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1914" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1949, Lord (John) Boyd Orr of Brechin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1949" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1993, Frederik Willem de Klerk" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1993" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1906, Henri Moissan" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1906" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1974, Antony Hewish" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1974" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1999, Robert A. Mundell" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1999" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2013, Robert J. Shiller" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2013" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1996, José Ramos-Horta" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1996" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1965, Richard P. Feynman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1965" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1927, Henri Bergson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1927" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1953, Fritz Albert Lipmann" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1953" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1981, Kenichi Fukui" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1981" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1995, Robert E. Lucas Jr." } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1995" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1974, Harry Martinson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1974" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1993, Richard J. Roberts" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1993" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1917, Charles Glover Barkla" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1917" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1930, Hans Fischer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1930" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1989, J. Michael Bishop" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1989" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1958, Igor Yevgenyevich Tamm" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1958" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2005, Barry J. Marshall" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2005" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1964, Konrad Bloch" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1964" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1987, J. Georg Bednorz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1987" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1960, Sir Frank Macfarlane Burnet" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1960" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1929, Sir Frederick Gowland Hopkins" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1929" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2014, Eric Betzig" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2014" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1983, William Alfred Fowler" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1983" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1901, Sully Prudhomme" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1901" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1958, Il´ja Mikhailovich Frank" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1958" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1973, Brian David Josephson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1973" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1937, Clinton Joseph Davisson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1937" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1901, Jean Henry Dunant" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1901" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1923, Frederick Grant Banting" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1923" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1928, Owen Willans Richardson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1928" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1910, Albrecht Kossel" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1910" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1978, Peter D. Mitchell" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1978" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1951, Max Theiler" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1951" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1992, Georges Charpak" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1992" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2002, Kurt Wüthrich" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2002" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1920, Knut Pedersen Hamsun" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1920" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2006, Andrew Z. Fire" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2006" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1968, Yasunari Kawabata" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1968" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1995, F. Sherwood Rowland" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1995" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1969, Alfred D. Hershey" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1969" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1934, George Hoyt Whipple" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1934" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1973, Wassily Leontief" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1973" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1923, Fritz Pregl" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1923" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1979, Allan M. Cormack" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1979" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1951, Ernest Thomas Sinton Walton" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1951" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1909, Auguste Marie François Beernaert" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1909" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1980, James Watson Cronin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1980" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2007, Eric S. Maskin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2007" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1953, Sir Winston Leonard Spencer Churchill" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1953" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1944, Johannes Vilhelm Jensen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1944" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1998, Robert B. Laughlin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1998" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1933, Ivan Alekseyevich Bunin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1933" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1984, Desmond Mpilo Tutu" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1984" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2012, Robert J. Lefkowitz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2012" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1990, Merton H. Miller" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1990" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1947, Bernardo Alberto Houssay" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1947" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1901, Wilhelm Conrad Röntgen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1901" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2002, H. Robert Horvitz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2002" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1966, Shmuel Yosef Agnon" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1966" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1961, Rudolf Ludwig Mössbauer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1961" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2005, Robert H. Grubbs" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2005" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1925, Sir Austen Chamberlain" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1925" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1991, Richard R. Ernst" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1991" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2009, Ada E. Yonath" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2009" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2004, Aaron Ciechanover" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2004" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1908, Gabriel Lippmann" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1908" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1984, Georges J.F. Köhler" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1984" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1954, Max Born" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1954" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2008, Paul Krugman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2008" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2003, Roderick MacKinnon" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2003" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2008, Makoto Kobayashi" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2008" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1945, Wolfgang Pauli" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1945" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1956, Sir Cyril Norman Hinshelwood" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1956" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1994, Yitzhak Rabin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1994" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1951, Edwin Mattison McMillan" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1951" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1992, Derek Walcott" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1992" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2003, Sir Peter Mansfield" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2003" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2016, F. Duncan M. Haldane" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2016" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1968, Luis Walter Alvarez" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1968" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1954, Frederick Chapman Robbins" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1954" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1995, Frederick Reines" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1995" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2015, Paul Modrich" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2015" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1997, Jens C. Skou" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1997" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1972, Christian B. Anfinsen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1972" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1925, Richard Adolf Zsigmondy" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1925" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1920, Charles Edouard Guillaume" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1920" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1978, Herbert A. Simon" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1978" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1972, Kenneth J. Arrow" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1972" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2005, John L. Hall" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2005" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1989, Sidney Altman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1989" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1981, David H. Hubel" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1981" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1978, Hamilton O. Smith" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1978" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1913, Henri La Fontaine" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1913" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1961, Melvin Calvin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1961" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1959, Salvatore Quasimodo" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1959" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1902, Élie Ducommun" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1902" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1952, François Mauriac" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1952" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2000, Arvid Carlsson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2000" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1996, Peter C. Doherty" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1996" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1911, Marie Curie, née Sklodowska" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1911" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1977, Philip Warren Anderson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1977" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2013, Thomas C. Südhof" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2013" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1991, Aung San Suu Kyi " } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1991" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2015, Takaaki Kajita" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2015" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1990, Harry M. Markowitz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1990" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1917, Karl Adolph Gjellerup" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1917" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1970, Ulf von Euler" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1970" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1929, Frank Billings Kellogg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1929" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1967, Haldan Keffer Hartline" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1967" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2001, Ryoji Noyori" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2001" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1913, Heike Kamerlingh Onnes" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1913" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1970, Norman E. Borlaug" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1970" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1981, Kai M. Siegbahn" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1981" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1911, Tobias Michael Carel Asser" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1911" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2007, Doris Lessing" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2007" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1986, John C. Polanyi" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1986" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1944, Otto Hahn" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1944" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1933, Paul Adrien Maurice Dirac" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1933" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2016, Oliver Hart" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2016" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1920, Schack August Steenberg Krogh" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1920" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1982, Gabriel García Márquez" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1982" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1937, Paul Karrer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1937" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1950, Edward Calvin Kendall" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1950" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2002, Riccardo Giacconi" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2002" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1946, Hermann Joseph Muller" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1946" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2014, William E. Moerner" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2014" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1990, Henry W. Kendall" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1990" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1988, Leon M. Lederman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1988" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1993, Michael Smith" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1993" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1909, Selma Ottilia Lovisa Lagerlöf" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1909" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1907, Ernesto Teodoro Moneta" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1907" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2011, Tomas Tranströmer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2011" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1962, Linus Carl Pauling" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1962" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1912, Victor Grignard" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1912" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1975, Renato Dulbecco" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1975" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1971, Dennis Gabor" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1971" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1952, Richard Laurence Millington Synge" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1952" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1996, Wislawa Szymborska" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1996" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2007, Mario R. Capecchi" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2007" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1994, Bertram N. Brockhouse" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1994" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2015, Youyou Tu" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2015" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1923, William Butler Yeats" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1923" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1982, Alva Myrdal" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1982" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1973, Konrad Lorenz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1973" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1943, Henrik Carl Peter Dam" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1943" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1999, Ahmed H. Zewail" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1999" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1904, Lord Rayleigh (John William Strutt)" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1904" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2012, Sir John B. Gurdon" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2012" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1975, Andrei Dmitrievich Sakharov" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1975" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2004, Finn E. Kydland" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2004" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1963, Sir John Carew Eccles" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1963" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2001, William S. Knowles" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2001" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1956, John Bardeen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1956" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1906, Giosuè Carducci" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1906" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1980, Jean Dausset" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1980" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2008, Françoise Barré-Sinoussi" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2008" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1935, James Chadwick" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1935" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1905, Johann Friedrich Wilhelm Adolf von Baeyer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1905" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2006, Orhan Pamuk" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2006" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1949, William Francis Giauque" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1949" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1989, Camilo José Cela" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1989" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1931, Nicholas Murray Butler" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1931" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1984, Richard Stone" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1984" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1974, Eyvind Johnson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1974" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1991, Ronald H. Coase" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1991" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1949, Antonio Caetano de Abreu Freire Egas Moniz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1949" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1929, Hans Karl August Simon von Euler-Chelpin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1929" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1988, George H. Hitchings" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1988" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1963, Maria Goeppert Mayer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1963" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2001, Eric A. Cornell" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2001" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1990, Jerome I. Friedman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1990" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2009, Carol W. Greider" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2009" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1910, Johannes Diderik van der Waals" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1910" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1920, Walther Hermann Nernst" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1920" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1959, Arthur Kornberg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1959" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1979, Sheldon Lee Glashow" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1979" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1983, Subramanyan Chandrasekhar" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1983" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1973, Ivar Giaever" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1973" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1977, Rosalyn Yalow" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1977" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1949, William Faulkner" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1949" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1999, Günter Blobel" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1999" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1946, Wendell Meredith Stanley" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1946" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2016, Sir J. Fraser Stoddart" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2016" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1995, Edward B. Lewis" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1995" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1927, Charles Thomson Rees Wilson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1927" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2010, Ei-ichi Negishi" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2010" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1909, Emil Theodor Kocher" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1909" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1964, Aleksandr Mikhailovich Prokhorov" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1964" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1986, Wole Soyinka" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1986" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1939, Leopold Ruzicka" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1939" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1991, Bert Sakmann" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1991" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1906, Camillo Golgi" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1906" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1967, Ronald George Wreyford Norrish" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1967" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2005, Harold Pinter" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2005" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1995, Mario J. Molina" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1995" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2014, Jean Tirole" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2014" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1965, André Lwoff" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1965" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1933, Thomas Hunt Morgan" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1933" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1969, Max Delbrück" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1969" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1989, Norman F. Ramsey" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1989" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2000, Alan G. MacDiarmid" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2000" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1912, Gerhart Johann Robert Hauptmann" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1912" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1927, Julius Wagner-Jauregg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1927" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1951, Sir John Douglas Cockcroft" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1951" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2004, Linda B. Buck" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2004" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2011, Brian P. Schmidt" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2011" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1959, Philip J. Noel-Baker" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1959" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1939, Ernest Orlando Lawrence" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1939" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1976, D. Carleton Gajdusek" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1976" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2007, Albert Fert" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2007" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1998, Amartya Sen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1998" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2006, Edmund S. Phelps" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2006" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1975, John Warcup Cornforth" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1975" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1980, Frederick Sanger" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1980" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1979, Odysseus Elytis" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1979" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2012, David J. Wineland" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2012" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1994, Reinhard Selten" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1994" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1973, Patrick White" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1973" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1945, Sir Alexander Fleming" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1945" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1903, Niels Ryberg Finsen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1903" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1976, Milton Friedman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1976" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1988, Gertrude B. Elion" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1988" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1922, Fridtjof Nansen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1922" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2001, A. Michael Spence" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2001" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1957, Tsung-Dao (T.D.) Lee" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1957" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1986, Heinrich Rohrer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1986" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2014, Shuji Nakamura" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2014" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2008, Yoichiro Nambu" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2008" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2003, Paul C. Lauterbur" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2003" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1946, Emily Greene Balch" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1946" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1987, Charles J. Pedersen" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1987" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1998, Ferid Murad" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1998" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1946, John Howard Northrop" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1946" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1902, Hermann Emil Fischer" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1902" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1935, Carl von Ossietzky" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1935" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2002, Koichi Tanaka" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2002" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1997, John E. Walker" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1997" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1986, Rita Levi-Montalcini" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1986" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2004, David J. Gross" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2004" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2009, Willard S. Boyle" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2009" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1972, John R. Hicks" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1972" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1962, Francis Harry Compton Crick" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1962" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1960, Willard Frank Libby" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1960" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2011, Tawakkol Karman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2011" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1964, Martin Luther King Jr." } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1964" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1958, Edward Lawrie Tatum" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1958" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2000, James J. Heckman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2000" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1904, Frédéric Mistral" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1904" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1939, Frans Eemil Sillanpää" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1939" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1997, William D. Phillips" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1997" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1932, John Galsworthy" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1932" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1913, Charles Robert Richet" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1913" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2012, Lloyd S. Shapley" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2012" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1935, Irène Joliot-Curie" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1935" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1976, Mairead Corrigan" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1976" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1989, Trygve Haavelmo" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1989" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1925, Gustav Ludwig Hertz" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1925" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1908, Ilya Ilyich Mechnikov" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1908" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1969, Derek H. R. Barton" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1969" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1981, James Tobin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1981" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1965, Mikhail Aleksandrovich Sholokhov" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1965" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1927, Ludwig Quidde" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1927" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1967, Ragnar Granit" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1967" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2000, Gao Xingjian" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2000" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1984, Niels K. Jerne" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1984" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1946, Percy Williams Bridgman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1946" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 2008, Martti Ahtisaari" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2008" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1956, Juan Ramón Jiménez" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1956" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2003, Peter Agre" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2003" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1981, Arthur Leonard Schawlow" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1981" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1978, Pyotr Leonidovich Kapitsa" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1978" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1951, Léon Jouhaux" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1951" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1994, Shimon Peres" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1994" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1945, Cordell Hull" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1945" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2013, Martin Karplus" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2013" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1908, Ernest Rutherford" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1908" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1975, Ben Roy Mottelson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1975" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2003, John M. Coetzee" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2003" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1987, Oscar Arias Sánchez" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1987" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1996, Robert C. Richardson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1996" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1967, Hans Albrecht Bethe" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1967" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2015, Svetlana Alexievich" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2015" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1929, Thomas Mann" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1929" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1954, Thomas Huckle Weller" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1954" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2010, Andre Geim" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2010" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1976, Saul Bellow" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1976" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1972, Gerald M. Edelman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1972" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1937, Albert von Szent-Györgyi Nagyrápolt" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1937" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2001, Sir Vidiadhar Surajprasad Naipaul" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2001" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1919, Johannes Stark" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1919" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1990, Joseph E. Murray" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1990" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1965, Robert Burns Woodward" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1965" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1959, Owen Chamberlain" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1959" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 2004, Elfriede Jelinek" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2004" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2005, Roy J. Glauber" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2005" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1988, Hartmut Michel" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1988" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1955, Willis Eugene Lamb" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1955" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1961, Georg von Békésy" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1961" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2011, Bruce A. Beutler" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2011" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 2008, Martin Chalfie" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2008" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2003, Alexei A. Abrikosov" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2003" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1903, Bjørnstjerne Martinus Bjørnson" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1903" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1901, Jacobus Henricus van 't Hoff" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1901" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1995, Eric F. Wieschaus" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1995" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1970, Louis Eugène Félix Néel" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1970" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1985, Jerome Karle" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1985" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1995, Seamus Heaney" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1995" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1930, Sir Chandrasekhara Venkata Raman" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1930" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1965, Julian Schwinger" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1965" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 1953, Hans Adolf Krebs" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1953" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1993, Joseph H. Taylor Jr." } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1993" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physiology or Medicine 2015, Satoshi &#332;mura" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2015" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physiology or Medicine" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 2002, Vernon L. Smith" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2002" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1922, Jacinto Benavente" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1922" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 2006, John C. Mather" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2006" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Literature 1970, Aleksandr Isayevich Solzhenitsyn" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1970" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Literature" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Chemistry 1996, Sir Harold W. Kroto" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1996" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Chemistry" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Physics 1915, William Lawrence Bragg" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1915" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Physics" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Peace 1968, René Cassin" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1968" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Peace" }
          } ,
          {
            "entrypointlabel": { "type": "literal" , "value": "Economic Sciences 1974, Friedrich August von Hayek" } ,
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1974" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "prop3": { "type": "literal" , "value": "Economic Sciences" }
          }
        ]
      }
    } : {
      "head": {
        "vars": [ "prop1" , "countprop1" , "prop2" , "countprop2" ]
      } ,
      "results": {
        "bindings": [
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1963" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1945" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1991" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1957" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1982" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1922" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1980" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1902" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1993" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2008" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1972" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1930" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1910" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "4" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "4" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1937" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1947" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2015" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2000" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "13" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "13" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1965" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1956" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1992" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2009" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1909" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1946" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1983" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1981" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1986" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1931" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1921" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1973" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "12" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "12" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1920" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1903" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1979" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1929" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2007" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1911" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1938" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "3" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "3" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1964" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1999" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2015" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2002" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "13" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "13" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1947" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1955" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2008" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1993" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1978" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1924" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "3" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "3" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1984" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1932" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1970" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1985" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1982" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1908" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1939" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1945" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1963" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1991" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2010" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2016" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1911" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1938" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1948" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "4" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "4" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1954" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2001" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "14" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "14" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1964" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1979" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1923" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1994" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "12" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "12" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2007" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1903" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1986" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1971" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1931" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1901" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1983" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1962" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2009" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1992" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1946" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1909" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1968" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1995" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1906" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1953" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1928" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1976" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2004" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1933" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2014" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2012" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1961" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1926" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1935" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1952" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1917" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "3" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "3" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1997" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1966" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1987" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1914" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "3" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "3" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1996" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "12" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "12" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1907" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1977" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2003" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2013" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1934" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1925" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2011" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1951" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1915" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "4" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "4" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1916" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1905" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1969" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1988" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1960" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1943" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "4" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "4" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1997" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1966" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2006" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1935" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "4" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "4" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1974" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "12" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "12" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1926" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1950" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2014" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1928" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "3" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "3" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2004" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "3" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "3" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1976" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1912" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1959" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1995" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1904" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1989" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "10" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1919" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "4" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "4" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1905" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "4" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "4" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1944" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1988" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1967" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "8" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1998" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "12" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "12" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2005" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "12" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "12" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1936" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1975" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "12" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "12" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2011" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "3" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "3" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2013" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1949" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "6" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2003" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1927" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "7" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1996" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1958" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "9" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1977" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" } ,
            "prop2": { "type": "literal" , "value": "female" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1913" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "5" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1990" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "11" }
          } ,
          {
            "prop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "1918" } ,
            "countprop1": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2" } ,
            "prop2": { "type": "literal" , "value": "male" } ,
            "countprop2": { "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "type": "typed-literal" , "value": "2" }
          }
        ]
      } }
}

const loadEmpty = (propertyList = []) => {
    return {
        'head': {
            'vars': [ 'prop1', 'countprop1', 'prop2', 'countprop2' ]
        },
        'results': {
            'bindings': []
        }
    }
}
const loadError = (propertyList = []) => {
    return {
        'head': {
            'vars': [ 'prop1', 'countprop1', 'prop2', 'countprop2' ]
        },
        'results': {
            'bindings': [
                {
                    'prop1': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '1963' },
                    'countprop1': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '1' },
                    'prop2': { 'type': 'literal', 'value': 'female' },
                    'countprop2': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '1' }
                },
                {
                    'prop1': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '1945' },
                    'countprop1': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '6' },
                    // 'prop2': { 'type': 'literal', 'value': 'male' }, prop2 missing error
                    'countprop2': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '6' }
                },
                {
                    'prop1': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '1991' },
                    'countprop1': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '5' },
                    'prop2': { 'type': 'literal', 'value': 'male' },
                    'countprop2': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '5' }
                },
                {
                    // 'prop1': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '1957' }, prop1 missing error
                    'countprop1': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '6' },
                    'prop2': { 'type': 'literal', 'value': 'male' },
                    'countprop2': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '6' }
                },
                {
                    'prop1': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '1982' },
                    'countprop1': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '8' },
                    'prop2': { 'type': 'literal', 'value': '5' }, // value error
                    'countprop2': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '8' }
                },
                {
                    'prop1': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': 'noData' }, // value error
                    'countprop1': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '6' },
                    'prop2': { 'type': 'literal', 'value': 'male' },
                    'countprop2': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '6' }
                },
                {
                    'prop1': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '1980' },
                    'countprop1': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '11' },
                    'prop2': { 'type': 'literal', 'value': 'male' },
                    'countprop2': { 'datatype': 'http://www.w3.org/2001/XMLSchema#integer', 'type': 'typed-literal', 'value': '11' }
                }
            ]
        }
    }
}

exports.explore = explore
exports.load = load
exports.loadEmpty = loadEmpty
exports.loadError = loadError
