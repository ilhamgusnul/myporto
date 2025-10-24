#!/bin/bash

echo "==================================="
echo "🔍 Checking Environment Variables"
echo "==================================="
echo ""

# Function to check if env var is set
check_env() {
    local var_name=$1
    local var_value="${!var_name}"
    
    if [ -z "$var_value" ]; then
        echo "❌ $var_name: NOT SET"
        return 1
    else
        # Show first 20 chars only for security
        local preview="${var_value:0:20}..."
        echo "✅ $var_name: SET ($preview)"
        return 0
    fi
}

# Required variables
echo "📋 Required Environment Variables:"
echo ""

all_set=true

check_env "NEXT_PUBLIC_SUPABASE_URL" || all_set=false
check_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" || all_set=false
check_env "SUPABASE_SERVICE_ROLE_KEY" || all_set=false
check_env "NEXTAUTH_SECRET" || all_set=false
check_env "NEXTAUTH_URL" || all_set=false

echo ""
echo "==================================="

if [ "$all_set" = true ]; then
    echo "✅ All environment variables are set!"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm run build"
    echo "2. Run: npm run dev"
    echo "3. Test login at http://localhost:3000/login"
else
    echo "⚠️  Some environment variables are missing!"
    echo ""
    echo "Please create .env file with:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=https://fmwvuxlnaifkphzaxypo.supabase.co"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
    echo "SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
    echo "NEXTAUTH_SECRET=\$(openssl rand -base64 32)"
    echo "NEXTAUTH_URL=http://localhost:3000"
fi

echo "==================================="
