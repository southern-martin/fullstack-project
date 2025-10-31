#!/bin/bash

echo "🔐 Adding JWT Plugin to Seller Service Routes..."
echo ""

# Add JWT plugin to sellers-list-v2 route
echo "Adding JWT plugin to sellers-list-v2..."
curl -s -X POST http://localhost:8001/routes/sellers-list-v2/plugins \
  -d "name=jwt" \
  -d "config.key_claim_name=sub" \
  -d "config.header_names=Authorization" | jq '.'

echo ""
echo "Adding JWT plugin to sellers-create-v2..."
curl -s -X POST http://localhost:8001/routes/sellers-create-v2/plugins \
  -d "name=jwt" \
  -d "config.key_claim_name=sub" \
  -d "config.header_names=Authorization" | jq '.'

echo ""
echo "✅ JWT plugins configured for seller service routes!"
echo ""
echo "Testing JWT configuration..."
curl -s http://localhost:8001/routes/sellers-list-v2/plugins | jq '.data[] | {name: .name, route: .route.id}'
