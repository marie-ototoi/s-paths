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

const load = () => {
    return {
        "head": {
          "vars": [ "entrypoint" ]
        } ,
        "results": {
          "bindings": [
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/226" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/479" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/463" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/415" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/857" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/472" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/661" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/850" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/604" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/156" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/598" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/933" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/535" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/680" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/345" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/788" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/3" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/29" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/77" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/421" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/485" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/276" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/13" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/428" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/806" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/863" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/219" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/212" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/952" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/654" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/1003" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/359" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/251" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/693" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/440" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/289" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/182" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/974" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/26" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/528" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/371" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/478" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/314" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/225" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/965" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/910" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/619" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/560" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/512" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/453" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/895" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/651" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/840" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/244" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/987" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/589" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/582" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/832" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/336" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/327" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/771" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/384" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/320" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/778" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/19" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/762" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/525" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/52" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/175" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/111" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/854" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/951" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/266" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/202" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/447" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/257" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/1009" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/81" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/645" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/197" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/188" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/349" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/973" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/784" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/377" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/133" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/279" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/575" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/313" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/124" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/518" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/916" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/469" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/361" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/172" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/511" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/45" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/550" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/216" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/94" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/405" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/847" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/658" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/146" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/588" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/292" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/399" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/335" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/677" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/670" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/929" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/374" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/67" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/418" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/613" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/58" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/42" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/165" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/310" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/101" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/543" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/209" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/248" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/494" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/241" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/699" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/683" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/635" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/626" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/437" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/430" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/71" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/879" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/815" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/872" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/16" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/178" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/367" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/114" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/565" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/99" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/260" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/955" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/557" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/1006" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/35" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/304" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/191" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/648" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/298" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/443" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/234" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/837" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/676" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/282" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/828" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/273" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/768" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/579" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/317" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/462" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/759" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/48" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/515" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/660" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/506" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/108" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/948" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/591" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/247" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/140" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/932" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/534" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/698" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/393" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/2" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/295" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/231" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/673" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/484" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/420" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/475" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/411" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/862" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/503" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/105" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/547" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/945" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/162" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/540" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/358" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/351" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/497" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/793" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/342" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/288" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/390" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/181" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/74" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/433" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/876" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/812" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/667" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/10" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/224" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/919" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/364" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/96" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/1000" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/603" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/155" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/597" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/307" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/300" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/194" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/533" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/9" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/32" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/581" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/831" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/238" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/970" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/383" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/130" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/572" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/761" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/51" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/427" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/616" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/869" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/805" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/853" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/509" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/402" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/168" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/104" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/844" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/600" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/89" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/594" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/357" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/250" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/692" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/332" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/396" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/187" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/6" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/783" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/25" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/530" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/774" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/64" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/123" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/964" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/866" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/802" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/459" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/263" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/609" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/93" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/452" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/215" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/894" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/657" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/38" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/206" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/650" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/491" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/641" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/145" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/796" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/986" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/587" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/830" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/389" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/136" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/326" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/524" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/417" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/913" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/465" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/228" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/859" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/57" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/663" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/408" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/852" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/401" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/606" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/158" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/891" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/256" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/999" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/240" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/935" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/537" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/682" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/348" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/5" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/339" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/79" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/380" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/278" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/765" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/15" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/808" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/171" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/269" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/556" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/214" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/954" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/701" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/1005" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/253" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/695" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/631" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/442" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/184" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/28" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/928" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/821" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/373" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/578" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/127" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/316" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/967" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/758" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/569" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/120" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/562" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/514" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/41" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/455" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/898" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/246" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/790" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/689" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/834" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/625" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/329" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/386" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/322" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/764" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/527" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/61" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/54" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/177" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/113" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/152" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/555" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/161" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/449" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/992" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/638" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/83" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/647" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/341" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/622" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/73" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/827" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/379" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/481" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/272" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/875" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/811" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/577" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/424" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/909" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/126" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/918" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/174" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/363" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/110" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/47" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/552" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/95" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/849" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/950" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/86" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/354" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/888" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/31" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/285" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/446" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/237" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/679" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/230" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/294" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/22" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/881" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/672" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/824" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/376" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/410" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/474" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/221" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/615" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/755" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/167" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/44" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/312" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/502" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/103" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/944" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/546" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/496" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/243" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/685" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/628" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/621" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/487" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/439" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/432" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/817" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/874" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/423" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/471" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/117" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/262" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/559" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/37" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/306" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/640" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/193" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/236" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/445" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/787" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/780" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/275" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/571" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/912" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/319" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/464" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/662" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/508" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/400" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/90" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/211" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/653" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/843" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/593" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/149" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/989" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/142" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/584" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/982" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/934" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/536" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/190" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/395" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/331" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/4" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/338" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/675" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/370" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/773" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/520" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/63" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/477" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/414" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/856" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/801" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/865" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/612" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/268" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/107" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/947" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/549" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/205" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/542" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/199" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/490" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/795" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/344" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/786" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/392" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/183" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/76" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/770" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/135" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/814" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/878" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/669" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/12" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/227" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/561" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/218" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/407" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/157" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/605" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/1002" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/897" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/599" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/890" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/148" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/309" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/80" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/644" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/196" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/833" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/972" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/321" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/385" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/132" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/574" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/69" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/763" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/429" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/53" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/468" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/807" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/618" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/461" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/510" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/404" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/846" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/700" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/259" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/252" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/637" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/694" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/630" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/398" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/334" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/189" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/291" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/8" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/27" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/480" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/777" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/18" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/66" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/125" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/966" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/568" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/454" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/265" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/201" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/896" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/659" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/208" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/1008" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/493" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/643" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/691" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/839" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/284" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/880" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/139" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/328" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/871" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/526" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/467" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/220" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/915" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/517" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/360" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/59" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/963" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/754" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/151" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/608" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/893" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/303" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/258" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/991" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/242" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/539" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/684" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/297" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/233" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/620" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/486" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/325" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/767" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/422" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/760" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/908" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/116" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/173" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/505" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/551" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/164" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/100" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/703" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/956" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/558" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/85" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/590" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/353" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/499" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/255" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/697" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/634" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/444" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/21" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/186" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/436" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/70" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/823" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/375" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/129" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/366" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/318" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/969" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/122" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/564" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/753" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/98" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/43" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/458" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/311" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/34" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/302" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/249" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/350" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/141" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/792" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/583" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/836" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/627" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/281" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/388" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/324" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/666" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/179" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/413" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/56" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/470" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/115" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/855" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/611" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/602" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/154" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/596" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/541" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/931" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/532" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/688" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/343" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/1" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/785" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/624" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/75" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/829" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/483" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/274" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/877" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/813" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/11" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/426" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/60" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/868" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/804" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/861" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/49" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/217" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/554" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/210" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/652" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/799" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/1001" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/88" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/356" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/147" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/988" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/287" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/239" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/180" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/24" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/674" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/665" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/826" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/271" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/419" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/412" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/476" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/223" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/617" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/460" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/610" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/757" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/451" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/169" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/106" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/946" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/548" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/985" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/687" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/580" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/391" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/489" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/382" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/776" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/17" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/523" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/119" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/473" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/851" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/264" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/200" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/39" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/1007" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/308" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/642" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/195" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/347" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/789" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/340" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/782" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/971" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/138" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/131" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/277" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/573" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/466" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/914" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/516" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/170" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/403" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/92" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/213" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/656" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/845" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/144" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/984" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/586" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/538" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/397" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/333" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/290" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/7" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/927" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/529" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/820" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/372" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/775" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/522" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/65" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/570" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/416" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/858" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/40" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/163" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/842" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/207" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/649" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/492" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/681" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/633" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/690" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/346" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/185" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/435" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/78" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/772" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/137" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/870" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/14" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/176" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/365" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/112" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/121" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/563" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/97" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/409" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/953" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/607" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/457" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/204" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/1004" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/448" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/33" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/892" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/301" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/82" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/646" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/198" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/441" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/296" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/232" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/835" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/280" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/975" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/378" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/323" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/387" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/134" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/766" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/576" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/315" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/55" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/809" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/911" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/513" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/46" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/504" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/406" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/848" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/702" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/841" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/498" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/245" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/254" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/639" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/930" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/696" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/632" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/337" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/293" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/671" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/434" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/482" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/779" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/68" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/128" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/968" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/860" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/798" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/545" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/501" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/267" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/456" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/203" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/160" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/495" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/791" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/286" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/431" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/810" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/873" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/664" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/369" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/222" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/917" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/519" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/362" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/756" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/567" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/601" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/153" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/595" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/305" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/936" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/192" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/531" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/686" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/30" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/299" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/235" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/678" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/623" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/488" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/381" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/769" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/425" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/50" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/867" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/614" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/803" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/118" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/109" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/507" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/553" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/500" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/949" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/166" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/102" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/797" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/544" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/150" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/87" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/990" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/592" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/355" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/889" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/636" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/394" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/330" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/781" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/23" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/438" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/229" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/72" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/816" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/825" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/270" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/62" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/368" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/907" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/864" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/800" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/566" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/159" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/450" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/91" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/261" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/655" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/36" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/84" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/352" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/143" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/983" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/794" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/585" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/838" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/629" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/283" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/20" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/521" }
            } ,
            {
              "entrypoint": { "type": "uri" , "value": "http://data.nobelprize.org/resource/laureateaward/668" }
            }
          ]
        }
      }
}
exports.explore = explore
exports.load = load
