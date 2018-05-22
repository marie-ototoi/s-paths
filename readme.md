# Read me!

## Installation

* Install local dependencies:
  ```bash
  $ npm install
  ```

* Build assets: (to be done at least once before running `devserver`)
  ```bash
  $ npm run build
  ```

## Usage

```bash
$ npm start
```

Launches the Webpack Dev Server and the API server.

### Advanced

To take control over the two parts of the process, you can run them separately:

* Run webpack dev on http://localhost:3000/, watches and rebuild
  ```bash
  $ npm run devserver
  ```

* Run API server on http://localhost:5000/
  ```bash
  $ npm run server
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

## Thanks

to Browserstack for supporting opensource and thus granting us a free open source licence
