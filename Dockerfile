FROM node:15 as base

# Load the application code
RUN mkdir -p /app
WORKDIR /app
ADD . /app

# Install dependencies
RUN yarn install

# Start 'er up
CMD ["yarn", "start"]
