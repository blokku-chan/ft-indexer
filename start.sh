#!/bin/sh

# Run database migrations
sqd migration:generate

# Start the application
sqd serve & sqd process