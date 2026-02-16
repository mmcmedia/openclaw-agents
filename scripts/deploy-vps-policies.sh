#!/bin/bash
# Deploy policy updates to VPS agents
# Usage: ./deploy-vps-policies.sh

SSH_HOST="root@76.13.108.6"
AGENTS=("dev" "sage" "scout" "milo" "ally" "pixel")

echo "📤 Deploying policy updates to VPS agents..."
echo ""

for agent in "${AGENTS[@]}"; do
  echo "Updating $agent..."
  
  # Copy policy to agent's SESSION_STATE.md
  if [ -f "/Users/mmcassistant/clawd/templates/vps-agent-policies/${agent}-policy-update.md" ]; then
    ssh $SSH_HOST "cat >> /home/openclaw/agents/$agent/SESSION_STATE.md" < "/Users/mmcassistant/clawd/templates/vps-agent-policies/${agent}-policy-update.md"
    echo "  ✅ $agent updated"
  else
    echo "  ⚠️  $agent: no specific policy, using generic"
    ssh $SSH_HOST "echo '# New Policy: Direct Communication' >> /home/openclaw/agents/$agent/SESSION_STATE.md"
    ssh $SSH_HOST "echo 'You can now message Maria: ./notify-maria.sh \"message\"' >> /home/openclaw/agents/$agent/SESSION_STATE.md"
  fi
done

echo ""
echo "🎉 All VPS agents updated!"
echo "Agents will see new policies on next heartbeat."
