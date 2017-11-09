const explore = (resourceEnsemble, maxUnique, maxDepth) => {
    return {
        total_instances: 911,
        statements: [
            {
                path: 'nobel:LaureateAward/nobel:year/*',
                label: 'year',
                group: 'datetime',
                format: 'Y',
                unique_values: 113,
                total_values: 911,
                max_value: 2016,
                min_value: 1901
            },
            {
                path: 'nobel:LaureateAward/nobel:field/*',
                label: 'field',
                group: 'text',
                language: 'en',
                unique_values: 151,
                total_values: 1251
            },
            {
                path: 'nobel:LaureateAward/nobel:category/*',
                label: 'category',
                group: 'uri',
                unique_values: 6,
                total_values: 911
            },
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*',
                label: 'gender of Laureate',
                group: 'text',
                unique_values: 2,
                total_values: 885,
                language: 'en'
            },
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/dbpprop:dateOfBirth/*',
                label: 'date of birth of Laureate',
                group: 'datetime',
                format: 'Y-m-d',
                total_values: 883,
                unique_values: 868,
                max_value: 1997,
                min_value: 1817
            },
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:birthday',
                label: 'date of birth of Laureate',
                group: 'datetime',
                format: 'Y-m-d',
                total_values: 883,
                unique_values: 868,
                max_value: 1997,
                min_value: 1817
            },
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/dbpprop:dateOfDeath/*',
                label: 'date of death of Laureate',
                group: 'datetime',
                format: 'Y-m-d',
                total_values: 600,
                unique_values: 589,
                max_value: 2017,
                min_value: 1903
            },
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/dbpedia-owl:birthPlace/dbpedia-owl:City',
                label: 'place of birth of Laureate (city)',
                group: 'geo',
                granularity: 'city',
                total_values: 884,
                unique_values: 602
            },
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/dbpedia-owl:birthPlace/dbpedia-owl:Country',
                label: 'place of birth of Laureate (country)',
                group: 'geo',
                granularity: 'country',
                total_values: 885,
                unique_values: 121
            },
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/dbpedia-owl:deathPlace/dbpedia-owl:City',
                label: 'place of death of Laureate (city)',
                group: 'geo',
                granularity: 'city',
                total_values: 582,
                unique_values: 293
            },
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/dbpedia-owl:deathPlace/dbpedia-owl:Country',
                label: 'place of death of Laureate (country)',
                group: 'geo',
                granularity: 'country',
                total_values: 588,
                unique_values: 52
            },
            {
                path: 'nobel:LaureateAward/nobel:university/dbpedia-owl:University/dbpedia-owl:country/dbpedia-owl:Country',
                label: 'place of university (country)',
                group: 'geo',
                granularity: 'country',
                total_values: 742,
                unique_values: 29
            },
            {
                path: 'nobel:LaureateAward/nobel:university/dbpedia-owl:University/dbpedia-owl:city/dbpedia-owl:City',
                label: 'place of university (city)',
                group: 'geo',
                granularity: 'city',
                total_values: 1009,
                unique_values: 185
            }
        ]
    }
}

const load = (propertyList = []) => {
    /*SELECT DISTINCT ?prop1 (COUNT(?prop1) as ?countprop1)  ?prop2 (COUNT(?prop2) as ?countprop2) WHERE { 
      ?entrypoint rdf:type nobel:LaureateAward .
      ?entrypoint nobel:year ?prop1.
      ?entrypoint nobel:laureate ?y.
      ?y foaf:gender ?prop2.
    }
    GROUP BY ?prop1 ?prop2*/
    return {
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
      }
    }
}
exports.explore = explore
exports.load = load
