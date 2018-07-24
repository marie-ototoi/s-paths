# Read me!

## Installation

1. Install Docker and VirtualEnv

2. Create a local virtual machine named 'local' with VirtualEnv
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

You might have to shut down your local Virtuoso and Mongo
since the instances in Docker containers are exposed on the default ports


## Development

Switch to you local machine's docker (when needed)
Note: If you don't the containers will run and be accessible on localhost, but the swarm won't be available, so you might have network problems, since the swarm is needed to have a local network config similar to the production's one. 

```bash
$ docker-compose -f docker-compose-dev.yml up
```

This will run 3 containers : 
- the app on port `80` : custom image derived from [node:9.11-jessie](https://hub.docker.com/_/node/)
- mongo on port `27017` : [jessie 3.6](https://hub.docker.com/_/mongo/)
- virtuoso on port `8890` : [tenforce/virtuoso:1.3.1-virtuoso7.2.2](https://hub.docker.com/r/tenforce/virtuoso/)


## Simulate deployment on your local machine

First commit the version to deploy to git master branch. 
When tests are passed (step 1 in CI) and the new image is built and published to Gitlab registry (step 2 in CI)

```bash
$ docker stack deploy semanticStack --compose-file docker-compose.yml --with-registry-auth
```


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

