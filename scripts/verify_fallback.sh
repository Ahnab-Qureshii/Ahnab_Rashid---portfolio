#!/bin/bash
set -u
cd /home/z/my-project
setsid bash -c 'exec bun run dev >> dev.log 2>&1' < /dev/null &
for i in $(seq 1 40); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 || echo 000)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "server ready ($code)"
AB="agent-browser"
$AB set viewport 1440 900
$AB open http://localhost:3000
$AB wait 3000
$AB click body
$AB wait 11000
$AB screenshot scripts/motion/n_10_fallback_reveal.png
$AB eval "var chip=document.querySelector('#home button'); var c=chip.getBoundingClientRect(); var g=document.querySelector('.gaze-layer'); JSON.stringify({chipVisible:chip&&getComputedStyle(chip.closest('.rv')).opacity, chipBottom:Math.round(c.bottom), gaze:getComputedStyle(g).opacity, vh:innerHeight})"
$AB console
$AB errors
echo "FALLBACK_DONE"
