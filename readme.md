# Read me!

## Installation

1. Install Docker and Virtualbox

2. Create a local virtual machine named 'local' with Virtualbox
```bash
$ docker-machine create --driver=virtualbox local
```

3. Switch to the virtual machine's docker:
```bash
$ eval $(docker-machine env local)  
```

To later get back to your computer's docker :
```bash
$ eval $(docker-machine env -u)  
```

To check which docker is active :
```bash
$ docker-machine ls  
```

4. Get the ip of your virtual machine
```bash
$ docker-machine ip local
```

5. Init the Swarm with this ip. 
```bash
docker swarm init --advertise-addr 192.168.99.100
```

6. Configure port forwarding on your virtual machine to enable sockets and debugger for development
https://stackoverflow.com/questions/35372399/connect-to-docker-machine-using-localhost


## Databases

### Load data in Virtuoso :

#### Simple way

Access Virtuoso 192.168.99.100:8890, login to the conductor (local access codes should be dba/dba) and use ISQL pop up in the left menu to create graphs
```
> SPARQL CREATE GRAPH <http://nobel.ilda.fr>;
> SPARQL CREATE GRAPH <http://nobeladdon.ilda.fr>;
> SPARQL CREATE GRAPH <http://geonames.ilda.fr>;
```

Then use the top menu `Linked Data > Quad Store Upload` to upload files 

#### Advanced procedure (for big files and / or bulk upload)

##### MAC 
Once the containers are up and running (see below), copy files to upload in the dump folder, it is mapped to the containers' /usr/local/virtuoso-opensource/share/virtuoso/vad folder in the docker-compose file.
```
- ./dump:/opt/virtuoso-opensource/vad
```

##### LINUX
Once the containers are up and running (see below), connect to the VM 
```
- docker-machine ssh local
```
and copy files to upload in the /home/docker/dumps folder, it is mapped to the containers' /usr/local/virtuoso-opensource/share/virtuoso/vad folder in the docker-compose file.
```
- /home/docker/dumps:/opt/virtuoso-opensource/vad
```

##### BOTH
Then get the id of your virtuoso container
```bash
$ eval $(docker-machine env local) 
$ docker container ls
```

And use it to start an isql console (replace 93211349efc4 with your container id)
```bash
$ docker exec -it 93211349efc4 bash
$ /opt/virtuoso-opensource/bin/isql 1111 dba dba
```

You can now use bulk upload (leave the full directory path as below, it is mapped to your dump folder)

```
> SPARQL CREATE GRAPH <http://geonames.ilda.fr>;
> ld_dir_all('/opt/virtuoso-opensource/vad', '%.nt', 'http://geonames.ilda.fr');
> select * from DB.DBA.load_list;
> rdf_loader_run();
> DELETE FROM DB.DBA.load_list;
```

### Interact with mongo

Once the containers are up and running (see below), get the id of your mongo container

```bash
$ eval $(docker-machine env local) 
$ docker container ls
```

And use it to start a mongo console  (replace 61a76db18ade with your container id)
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

Switch to you local machine's docker (when needed)
Note: If you don't the containers will run and be accessible on localhost, but the swarm won't be available, so you might have network problems, since the swarm is needed to have a local network config similar to the production's one. 

```bash
$ docker-compose -f docker-compose-dev.yml up
```

This will run 3 containers : 
- the app on port `80` : custom image derived from [node:9.11-jessie](https://hub.docker.com/_/node/)
- mongo on port `27017` : [jessie 3.6](https://hub.docker.com/_/mongo/)
- virtuoso on port `8890` : [tenforce/virtuoso:1.3.1-virtuoso7.2.2](https://hub.docker.com/r/openlink/virtuoso_opensource/)

It will also mount a local volume that can be used for bulk uploads.


## Simulate deployment on your local machine

First commit the version to deploy to git master branch. 
When tests are passed (step 1 in CI) and the new image is built and published to Gitlab registry (step 2 in CI)

```bash
$ docker stack deploy semanticStack --compose-file docker-compose.yml --with-registry-auth
```


## Deploy

Commit to master (if you have not already done it to simulate deployment).
When tests are passed (step 1 in CI) and the new image is built and published to Gitlab registry (step 2 in CI), activate Step 3 (deployment) manually.

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


## Authors
* **Marie Destandau**
* **Emmanuel Pietriga**
* **Caroline Appert**


## Many thanks to

* **Léo, Silvio, Dylan**
* **Logilab**: Adrien, Tanguy, Luc & co
* **BnF**: Aude, Raphaëlle and Sébastien & co
* **Staff** = technical support team @ LRI: Laurent & co
* **Browserstack**, for supporting opensource and thus granting us a free open source licence

