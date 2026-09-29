#!/bin/bash
# Verification round 2: mobile + tablet + tooltip + clean console.
set -u
cd /home/z/my-project

setsid bash -c 'exec bun run dev >> dev.log 2>&1' < /dev/null &
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 || echo 000)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "server ready ($code)"

AB="agent-browser"
$AB open http://localhost:3000
$AB console --clear >/dev/null
$AB errors --clear >/dev/null

echo "=== mobile 390x844 ==="
$AB set viewport 390 844
$AB open http://localhost:3000
$AB wait 6800
$AB screenshot scripts/motion/m_hero1.png
$AB wait 800
$AB screenshot scripts/motion/m_hero2.png
$AB eval "var i=document.querySelectorAll('.social-icon'); 'icons:'+i.length+' sizes:'+Array.from(i).map(function(a){return Math.round(a.getBoundingClientRect().width)}).join(',')"

echo "=== tablet 820x1180 ==="
$AB set viewport 820 1180
$AB open http://localhost:3000
$AB wait 6800
$AB screenshot scripts/motion/t_hero.png

echo "=== desktop tooltip hover ==="
$AB set viewport 1440 900
$AB open http://localhost:3000
$AB wait 6800
$AB find first ".social-icon" hover
$AB wait 400
$AB screenshot scripts/motion/d_tooltip.png

echo "=== clean console check (desktop, post-load) ==="
$AB errors
echo "--- console (filtered) ---"
$AB console | grep -iv "react devtools\|hmr\|fast refresh" | head -12
echo "--- hydration errors? ---"
$AB console | grep -ci "hydration\|mismatch" || echo 0

echo "DONE"
pkill -f "next dev" 2>/dev/null
