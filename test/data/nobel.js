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


exports.explore = explore
