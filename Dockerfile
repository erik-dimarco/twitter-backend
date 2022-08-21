FROM node:12.6.0-buster as base

# Load the application code
RUN mkdir -p /app
WORKDIR /app
ADD . /app

# Install dependencies
RUN yarn install

FROM base as build
RUN yarn build

FROM build as release

# Start 'er up
CMD ["yarn", "start"]
