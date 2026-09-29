#!/bin/bash
# Verification: speech-driven presentation (salam → welcome moment → name →
# intro → show), gestures synced to the voice, niqab intact, no face overlap.
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

echo "=== desktop 1440x900: the spoken introduction ==="
$AB set viewport 1440 900
$AB open http://localhost:3000
$AB wait 2500
$AB errors --clear >/dev/null
$AB console --clear >/dev/null
$AB click body            # step inside — voice starts ~0.7s later
$AB wait 2200             # salam + hello lift
$AB screenshot scripts/motion/s_1_salam.png
$AB wait 1600             # ~3.8s: "Welcome to my portfolio." + light
$AB screenshot scripts/motion/s_2_welcome.png
$AB wait 2600             # ~6.4s: "I'm Ahnab Rashid." + hand to heart
$AB screenshot scripts/motion/s_3_name.png
$AB wait 5000             # ~11.4s: intro line + stillness
$AB screenshot scripts/motion/s_4_intro.png
$AB wait 11000            # ~22.4s: "Let me show you..." + content
$AB screenshot scripts/motion/s_5_show.png
$AB wait 3500             # ended: settled
$AB screenshot scripts/motion/s_6_settled.png

echo "--- geometry + state checks ---"
$AB eval "var g=document.querySelectorAll('.gesture-frame'); var on=Array.from(g).findIndex(function(x){return x.classList.contains('g-on')}); var chip=document.querySelector('#home button').getBoundingClientRect(); var h1=document.querySelector('h1').getBoundingClientRect(); var w=document.querySelector('.welcome-script').getBoundingClientRect(); JSON.stringify({gestureLayers:g.length, layers:'3 (show reuses welcome)', chipBottom:Math.round(chip.bottom), fits:chip.bottom<900, nameVisible:getComputedStyle(document.querySelector('h1')).opacity, welcomeLeft:Math.round(w.left), welcomeTop:Math.round(w.top)})"

echo "=== mobile 390x844: welcome overlay must NOT cover her face ==="
$AB set viewport 390 844
$AB open http://localhost:3000
$AB wait 2500
$AB click body
$AB wait 4200             # welcome moment
$AB screenshot scripts/motion/s_7_mobile_welcome.png
$AB wait 2400             # name cue
$AB screenshot scripts/motion/s_8_mobile_name.png
$AB eval "var w=document.querySelector('.welcome').getBoundingClientRect(); var chip=document.querySelector('#home button').getBoundingClientRect(); JSON.stringify({welcome:[Math.round(w.left),Math.round(w.top),Math.round(w.right),Math.round(w.bottom)], chipBottom:Math.round(chip.bottom), fits:chip.bottom<844})"

echo "=== console + errors ==="
$AB console | tail -6
$AB errors
echo "SPEECH_VERIFY_DONE"
