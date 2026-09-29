#!/bin/bash
# Verification: the cinematic WELCOME moment (light + type reveal + presenter sync).
set -u
cd /home/z/my-project

setsid bash -c 'exec bun run dev >> dev.log 2>&1' < /dev/null &
for i in $(seq 1 40); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 || echo 000)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "server ready ($code)"
tail -5 dev.log

AB="agent-browser"

echo "=== desktop 1440x900: the welcome sequence ==="
$AB set viewport 1440 900
$AB open http://localhost:3000
$AB wait 2500
$AB errors --clear >/dev/null
$AB console --clear >/dev/null
$AB click body   # skip the HELLO intro — reveal starts now (t0)
$AB wait 1600    # t0+1.6s: light beginning to fall
$AB screenshot scripts/motion/w_1_light.png
$AB wait 1600    # t0+3.2s: Welcome in, caps arriving, her hand rising
$AB screenshot scripts/motion/w_2_words.png
$AB wait 2000    # t0+5.2s: content staggering in, mid-gesture
$AB screenshot scripts/motion/w_3_content.png
$AB wait 2300    # t0+7.5s: settled
$AB screenshot scripts/motion/w_4_settled.png

echo "--- geometry checks (desktop) ---"
$AB eval "var w=document.querySelector('.welcome'); var s=document.querySelector('.welcome-script'); var r=s.getBoundingClientRect(); var chip=document.querySelector('#home button'); var c=chip.getBoundingClientRect(); JSON.stringify({welcomeText:[Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)], scriptFont:getComputedStyle(s).fontFamily.slice(0,30), chipBottom:Math.round(c.bottom), vh:window.innerHeight, fits:c.bottom<window.innerHeight, lightOpacity:getComputedStyle(document.querySelector('.welcome-light-inner')).opacity})"

echo "=== laptop 1280x720: vertical fit ==="
$AB set viewport 1280 720
$AB open http://localhost:3000
$AB wait 2200
$AB click body
$AB wait 8000
$AB screenshot scripts/motion/w_5_laptop.png
$AB eval "var chip=document.querySelector('#home button'); var c=chip.getBoundingClientRect(); var soc=document.querySelector('.social-icon'); JSON.stringify({chipBottom:Math.round(c.bottom), vh:window.innerHeight, fits:c.bottom<window.innerHeight})"

echo "=== mobile 390x844: the moment + fit ==="
$AB set viewport 390 844
$AB open http://localhost:3000
$AB wait 2500
$AB click body
$AB wait 3400    # welcome words arriving
$AB screenshot scripts/motion/w_6_mobile_words.png
$AB wait 4200
$AB screenshot scripts/motion/w_7_mobile_settled.png
$AB eval "var chip=document.querySelector('#home button'); var c=chip.getBoundingClientRect(); JSON.stringify({chipBottom:Math.round(c.bottom), vh:window.innerHeight, fits:c.bottom<window.innerHeight})"

echo "=== console + errors ==="
$AB console
$AB errors
echo "VERIFY_DONE"
