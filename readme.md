# Read me!
## install
`npm install`
`npm run build`
to be done at least once before running devserver
## dev servers
`npm run devserver`
launches webpack dev on http://localhost:3000/, watches and rebuild
`npm run server`
launches API server on http://localhost:5000/
`npm start`
runs both at the same time (but running them separately enables separate logs)
## databases
### mongo 
mongo must be installed and running 
`brew install mongodb
mkdir -p /data/db
mongod`
### virtuoso
sparql endpoint can be distant
in /src/reducers/dataset.js
set 
endpoint: 'http://bnf.lri.fr:8890/sparql'
defaultGraph: 'http://data01.bnf.fr' (1%) or 'http://data10.bnf.fr' (10%) or 'http://data.bnf.fr' (full dataset)
## tests
`npm run test`
## reducers
config: computed possible configurations of the views, derived from the stats in the dataset + the views configuration
data: json-ld final data when loaded
dataset: definition of the data to visualize: entrypoint config, options and stats
display: settings + calculated scaled values
selections: elements selected by the user on a screen
## thanks
to Browserstack for supporting opensource and thus granting us a free open source licence