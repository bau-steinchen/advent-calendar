FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port to get requests
EXPOSE 8080

# Set start command
CMD [ "npm", "start" ]