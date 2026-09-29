#!/bin/bash
set -u
cd /home/z/my-project
setsid bash -c 'exec bun run dev >> dev.log 2>&1' < /dev/null &
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 || echo 000)
  [ "$code" = "200" ] && break
  sleep 1
done
AB="agent-browser"
$AB set viewport 1440 900
$AB open http://localhost:3000
$AB console --clear >/dev/null; $AB errors --clear >/dev/null
$AB wait 8500
echo "--- page errors ---"; $AB errors
echo "--- console (filtered) ---"; $AB console | grep -iv "react devtools\|hmr\|fast refresh" | head -8
echo "--- hydration count ---"; $AB console | grep -ci "hydration" || true
pkill -f "next dev" 2>/dev/null
echo FINAL_DONE
