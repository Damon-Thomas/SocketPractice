# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.12.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production


WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN npm ci --omit=dev

# Copy the rest of the source files into the image.
COPY . .

# Create a data directory for the database and set permissions
RUN mkdir -p /usr/src/app/data && chown -R node:node /usr/src/app/data

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 8888

# Run the application.
CMD npm start
