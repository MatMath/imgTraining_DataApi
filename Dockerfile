# NOTE: If it have been forever since you used Docker, Do: "docker-machine start" Because docker will answer you but is not running.
# also try: eval "$(docker-machine env default)" if it keep asking: Cannot connect to the Docker daemon. Is the docker daemon running on this host?
FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 8010
CMD [ "npm", "start" ]


# docker build -t matmath/node-postgres-api .
# docker run -d -e "GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID" -e "GOOGLE_CLIENT_SECRET=GOOGLE_CLIENT_SECRET" -p 49160:8010 matmath/node-postgres-api
# docker ps
# Find the Machine ip: docker-machine ip
# Go to the machine: http://192.168.99.100:49160/
# Something will break here, but will be detached so look in the logs to understand what happened.
# Stop everything:
# - $docker ps --> Will give the image ID,
# - $docker rmi <image id>
