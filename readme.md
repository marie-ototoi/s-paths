# Read me!

This is a fork of https://gitlab.inria.fr/mdestand/s-paths/-/wikis/S-Paths

## Installation

Install Docker

## Databases

### Allow sparql update through endpoint in Virtuoso :

1. Grant update rights
   Access Virtuoso 192.168.99.100:8890, login to the conductor (local access codes should be dba/dba.
   Go to System Admin > User Accounts, edit SPARQL user, and select SPARQL_UPDATE as Primary Role.
   Save changes.

2. Enable CORS
   Go to Web Application Server > Virtual Domains and Directories, click on the first directory pic in the left column to unfold content, edit /sparql line, fill Cross-Origin Resource Sharing field with a \*, and save changes.

### Load data in Virtuoso :

#### Simple way

Access Virtuoso 192.168.99.100:8890, login to the conductor (local access codes should be dba/dba) and use ISQL pop up in the left menu to create graphs

```
> SPARQL CREATE GRAPH <http://default>;
> SPARQL CREATE GRAPH <http://secondary>;
```

Then use the top menu `Linked Data > Quad Store Upload` to upload files (available in our data repo)

### Interact with mongo

Once the containers are up and running (see below), get the id of your mongo container

```bash
$ docker container ls
```

And use it to start a mongo console (replace 61a76db18ade with your container id)

```bash
$ docker exec -it 61a76db18ade bash
$ mongo
```

You can now interact with mongo

```
> use discover
> db.resources.find()
```

## Development

```bash
$ docker-compose -f docker-compose-dev.yml up
```

This will run 3 containers :

- the app on port `80` : custom image derived from [node:16](https://hub.docker.com/_/node/)
- mongo on port `27017` : [jessie 3.6](https://hub.docker.com/_/mongo/)
- virtuoso on port `8890` : [tenforce/virtuoso:1.3.1-virtuoso7.2.2](https://hub.docker.com/r/openlink/virtuoso_opensource/)

It will also mount a local volume that can be used for bulk uploads.

## Tests

```bash
$ npm test
```

## Reducers

- **config**: computed possible configurations of the views, derived from the stats in the dataset + the views configuration
- **data**: json-ld final data when loaded
- **dataset**: definition of the data to visualize: entrypoint config, options and stats
- **display**: settings + calculated scaled values
- **selections**: elements selected by the user on a screen
