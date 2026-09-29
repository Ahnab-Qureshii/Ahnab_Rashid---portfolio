#!/bin/bash
# One-shot verification: start dev server, run browser checks, kill server.
set -u
cd /home/z/my-project

setsid bash -c 'exec bun run dev >> dev.log 2>&1' < /dev/null &
SRV=$!

# wait for readiness
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 || echo 000)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "server ready ($code)"

AB="agent-browser"

echo "=== desktop 1440x900: full flow ==="
$AB set viewport 1440 900
$AB open http://localhost:3000
$AB wait 6800
$AB screenshot scripts/motion/v_hero.png
$AB eval "Array.from(document.styleSheets).some(s=>{try{return Array.from(s.cssRules).some(r=>r.selectorText && r.selectorText.includes('social-tip'))}catch(e){return false}})" && echo "SOCIAL_CSS_OK"

# catch the full hello gesture (starts ~1.1s after reveal; f1 shows ~1.6-2.2s in)
$AB wait 900
$AB screenshot scripts/motion/v_gesture_wave.png
$AB wait 500
$AB screenshot scripts/motion/v_gesture_heart.png
$AB wait 900
$AB screenshot scripts/motion/v_gesture_done.png

echo "=== social links ==="
$AB snapshot -i -c | grep -E "LinkedIn|Email|voice introduction"

echo "=== tooltip on hover ==="
$AB find role link click --name "Ahnab Rashid on LinkedIn" 2>/dev/null || true
$AB find first ".social-icon" hover
$AB wait 350
$AB screenshot scripts/motion/v_tooltip.png

echo "=== voice chip + short gesture + captions ==="
$AB find first "button" click
$AB wait 800
$AB screenshot scripts/motion/v_speaking.png
$AB wait 1500
$AB screenshot scripts/motion/v_speaking2.png

echo "=== console + errors ==="
$AB errors
$AB console | grep -iv "download the react devtools\|hmr" | head -10

echo "=== tablet 820x1180 ==="
$AB set viewport 820 1180
$AB reload
$AB wait 6800
$AB screenshot scripts/motion/v_tablet.png

echo "=== mobile 390x844 ==="
$AB set viewport 390 844
$AB reload
$AB wait 6800
$AB screenshot scripts/motion/v_mobile.png
$AB wait 900
$AB screenshot scripts/motion/v_mobile2.png

echo "=== mobile icons tap targets ==="
$AB snapshot -i -c | grep -E "LinkedIn|Email" || true

kill $SRV 2>/dev/null
pkill -f "next dev" 2>/dev/null
echo "DONE"
