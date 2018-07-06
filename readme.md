# Read me!

## Installation

```bash
$ ENV=dev docker-compose up --build
```

## Usage

```bash
$ ENV=dev docker-compose up
```

This will run 3 containers : 
- the app on port `80` : custom image derived from [node:9.11-jessie](https://hub.docker.com/_/node/)
- mongo on port `27017` : [jessie 3.6](https://hub.docker.com/_/mongo/)
- virtuoso on port `8890` : [tenforce/virtuoso:1.3.1-virtuoso7.2.2](https://hub.docker.com/r/tenforce/virtuoso/)


```bash
$ ENV=prod docker-compose up
```

## Databases

You might have to shut down your local Virtuoso and Mongo
since the instances in Docker containers are exposed on the default ports


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

* **Léo, Silvio**
* **Logilab**: Adrien, Tanguy, Luc & co
* **BnF**: Aude, Raphaëlle and Sébastien & co
* **Staff** = technical support team @ LRI: Laurent & co
* **Browserstack**, for supporting opensource and thus granting us a free open source licence

