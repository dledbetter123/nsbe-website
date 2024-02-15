#!/bin/bash
cd frontend

echo "Building NSBE website..."
npm run build

echo "Going to the build directory..."

cd build

echo "Deploying to S3 bucket..."
aws s3 sync . s3://www.nsbeumbc.com --delete

# echo "Invalidating CloudFront cache..."
# aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

echo "Deployment completed successfully."