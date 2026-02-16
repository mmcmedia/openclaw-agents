#!/bin/bash
# Schedule Valentine's Day FB posts for Hello Hayley via GetLate API

API_KEY="sk_52fd95a70291f65e90e233eafd833932dc515604bb0645fe4700086b7f4ba40e"
BASE_URL="https://getlate.dev/api/v1"
HELLO_HAYLEY_PROFILE="692b40c56ed16dcf439c39d8"
HELLO_HAYLEY_FB_ACCOUNT="692b984df43160a0bc9998dd"

# Image paths
IMG1="/Users/mmcassistant/.clawdbot/media/inbound/a5fcc581-1574-49d8-80ea-f05bc942e7fe.jpg"
IMG2="/Users/mmcassistant/.clawdbot/media/inbound/62ac8b70-127d-443a-8ce0-251326be0216.jpg"
IMG3="/Users/mmcassistant/.clawdbot/media/inbound/2c9c7489-b2aa-4123-b476-fdf8eb5083e5.jpg"
IMG4="/Users/mmcassistant/.clawdbot/media/inbound/9a9b8d66-eb9a-4235-9372-973d01182c42.jpg"
IMG5="/Users/mmcassistant/.clawdbot/media/inbound/a05eeacf-f257-4d45-ab53-e89cbf3390f5.jpg"

# Captions (Nicole Gates style - short with question)
CAPTION1="Swapping out throw pillows is my favorite way to decorate for Valentine's Day 💕 What's your go-to seasonal swap?"
CAPTION2="A few roses and a heart wreath instantly make the entryway feel like Valentine's Day 🌹 Do you decorate your entry?"
CAPTION3="A decorated ladder is such an easy way to switch up seasonal decor! What's your favorite Valentine's piece?"
CAPTION4="Nothing says cozy Valentine's vibes like candles and fresh flowers 💕 Do you decorate your mantel?"
CAPTION5="Tulips are my favorite for Valentine's tablescapes! 🌷 What flowers do you love for Valentine's Day?"

# Function to get presigned URL and upload image
upload_image() {
    local filepath=$1
    local filename=$(basename "$filepath")
    
    echo "Getting presigned URL for $filename..."
    
    # Get presigned URL
    response=$(curl -s -X POST "$BASE_URL/media/presign" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"filename\": \"$filename\", \"contentType\": \"image/jpeg\"}")
    
    uploadUrl=$(echo "$response" | jq -r '.uploadUrl')
    publicUrl=$(echo "$response" | jq -r '.publicUrl')
    
    if [ "$uploadUrl" == "null" ] || [ -z "$uploadUrl" ]; then
        echo "Error getting presigned URL: $response"
        return 1
    fi
    
    echo "Uploading $filename..."
    
    # Upload file
    curl -s -X PUT "$uploadUrl" \
        -H "Content-Type: image/jpeg" \
        --data-binary "@$filepath"
    
    echo "$publicUrl"
}

# Function to create a scheduled post
create_post() {
    local content=$1
    local imageUrl=$2
    local scheduleTime=$3
    
    echo "Creating post scheduled for $scheduleTime..."
    
    response=$(curl -s -X POST "$BASE_URL/posts" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        -d "{
            \"content\": \"$content\",
            \"mediaItems\": [{\"type\": \"image\", \"url\": \"$imageUrl\"}],
            \"platforms\": [{
                \"platform\": \"facebook\",
                \"accountId\": \"$HELLO_HAYLEY_FB_ACCOUNT\"
            }],
            \"scheduledFor\": \"$scheduleTime\",
            \"timezone\": \"America/Denver\"
        }")
    
    echo "$response" | jq -r '.id // .error // .'
}

# Function to create group post with multiple images
create_group_post() {
    local content=$1
    local scheduleTime=$2
    shift 2
    local imageUrls=("$@")
    
    # Build mediaItems array
    mediaItems="["
    first=true
    for url in "${imageUrls[@]}"; do
        if [ "$first" = true ]; then
            first=false
        else
            mediaItems+=","
        fi
        mediaItems+="{\"type\": \"image\", \"url\": \"$url\"}"
    done
    mediaItems+="]"
    
    echo "Creating group post with ${#imageUrls[@]} images scheduled for $scheduleTime..."
    
    response=$(curl -s -X POST "$BASE_URL/posts" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        -d "{
            \"content\": \"$content\",
            \"mediaItems\": $mediaItems,
            \"platforms\": [{
                \"platform\": \"facebook\",
                \"accountId\": \"$HELLO_HAYLEY_FB_ACCOUNT\"
            }],
            \"scheduledFor\": \"$scheduleTime\",
            \"timezone\": \"America/Denver\"
        }")
    
    echo "$response" | jq -r '.id // .error // .'
}

echo "=== Starting Valentine's Day FB Post Scheduling ==="
echo ""

# Upload all images
echo "=== Uploading Images ==="
URL1=$(upload_image "$IMG1")
echo "Image 1 URL: $URL1"

URL2=$(upload_image "$IMG2")
echo "Image 2 URL: $URL2"

URL3=$(upload_image "$IMG3")
echo "Image 3 URL: $URL3"

URL4=$(upload_image "$IMG4")
echo "Image 4 URL: $URL4"

URL5=$(upload_image "$IMG5")
echo "Image 5 URL: $URL5"

echo ""
echo "=== Creating Individual Posts (Today, Jan 31) ==="

# Schedule times for today (Jan 31, 2026) - spread throughout evening
# Current time is ~3:15 PM MST, so schedule from 4 PM onwards
create_post "$CAPTION1" "$URL1" "2026-01-31T16:00:00"
create_post "$CAPTION2" "$URL2" "2026-01-31T17:30:00"
create_post "$CAPTION3" "$URL3" "2026-01-31T19:00:00"
create_post "$CAPTION4" "$URL4" "2026-01-31T20:30:00"
create_post "$CAPTION5" "$URL5" "2026-01-31T22:00:00"

echo ""
echo "=== Creating Group Post (Monday, Feb 3) ==="

GROUP_CAPTION="Farmhouse Valentine's Day decor inspo! 💕🌷 Which one is your favorite? Drop a number below! 1️⃣ Cozy bedroom corner 2️⃣ Entry table 3️⃣ Decorated ladder 4️⃣ Mantel styling 5️⃣ Table centerpiece"

create_group_post "$GROUP_CAPTION" "2026-02-03T10:00:00" "$URL1" "$URL2" "$URL3" "$URL4" "$URL5"

echo ""
echo "=== Done! ==="
