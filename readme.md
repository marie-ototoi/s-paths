# Read me!

## Installation

```bash
$ npm install
```

## Usage

```bash
$ npm start
```

In a production environment, you need to build assets before running the server.

```bash
$ npm run build
```

## Databases

### MongoDB

[MongoDB](https://mongodb.com/) must be installed and running.

To install on your platform, follow [official MongoDB guide](https://docs.mongodb.com/manual/administration/install-community/).  
Don't forget to create MongoDB path on your system.

```bash
$ mkdir -p /data/db
$ mongod
```

The path to MongoDb database must be set in .env file (see .env.example file)

### virtuoso

sparql endpoint can be distant: in `/src/reducers/dataset.js` set:

* **`endpoint`**: `'http://bnf.lri.fr:8890/sparql'`
* **`defaultGraph`**:
  * `'http://data01.bnf.fr'` (1%)
  * `'http://data10.bnf.fr'` (10%)
  * `'http://data.bnf.fr'` (full dataset)

## Tests

```bash
$ npm test
```

## Reducers

* **config**: computed possible configurations of the views, derived from the stats in the dataset + the views configuration
* **data**: json-ld final data when loaded
* **dataset**: definition of the data to visualize: entrypoint config, options and stats
* **display**: settings + calculated scaled values
* **selections**: elements selected by the user on a screen

## Many thanks to

* **Léo**
* **Logilab**, especially Adrien and Tanguy
* **BnF**, particularly Aude, Raphaëlle and Sébastien
* **Browserstack**, for supporting opensource and thus granting us a free open source licence

