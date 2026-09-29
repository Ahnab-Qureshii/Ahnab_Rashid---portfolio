#!/bin/bash
# Task 6 verification: NEW hero image + living portrait (gaze/mouth/blink/nod)
# + full-composition contain framing + dark-wall typography.
set -u
cd /home/z/my-project

setsid bash -c 'exec bun run dev >> dev.log 2>&1' < /dev/null &
for i in $(seq 1 40); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 || echo 000)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "server ready ($code)"
tail -3 dev.log

AB="agent-browser"

echo "=== desktop 1440x900: full flow ==="
$AB set viewport 1440 900
$AB open http://localhost:3000
$AB wait 2600
$AB errors --clear >/dev/null
$AB console --clear >/dev/null
$AB screenshot scripts/motion/n_0_hello.png
$AB click body
$AB wait 1200
$AB eval "var a=document.querySelector('#home audio'); JSON.stringify({paused:a.paused, t:a.currentTime, playErr:null})"
# headless has no media clock — drive the cue engine by seeks + timeupdate
$AB eval "var a=document.querySelector('#home audio'); a.currentTime=0.8; a.dispatchEvent(new Event('timeupdate')); 'seek-salam'"
$AB wait 900
$AB screenshot scripts/motion/n_1_salam.png
$AB eval "var g=document.querySelector('.gaze-layer'); JSON.stringify({gazeOpacity:getComputedStyle(g).opacity})"
$AB eval "var a=document.querySelector('#home audio'); a.currentTime=3.1; a.dispatchEvent(new Event('timeupdate')); 'seek-welcome'"
$AB wait 1700
$AB screenshot scripts/motion/n_2_welcome.png
$AB eval "var a=document.querySelector('#home audio'); a.currentTime=6.0; a.dispatchEvent(new Event('timeupdate')); 'seek-name'"
$AB wait 900
$AB screenshot scripts/motion/n_3_name.png
$AB eval "var a=document.querySelector('#home audio'); a.currentTime=12.5; a.dispatchEvent(new Event('timeupdate')); 'seek-intro'"
$AB wait 900
$AB screenshot scripts/motion/n_4_intro_laptopgaze.png
$AB eval "var g=document.querySelector('.gaze-layer'); var m=document.querySelector('.mouth-layer'); JSON.stringify({gazeOpacity:getComputedStyle(g).opacity, mouthStyle:m.style.opacity})"
$AB eval "var a=document.querySelector('#home audio'); a.currentTime=22.0; a.dispatchEvent(new Event('timeupdate')); 'seek-show'"
$AB wait 900
$AB screenshot scripts/motion/n_5_show.png
$AB eval "var g=document.querySelector('.gaze-layer'); JSON.stringify({gazeOpacity:getComputedStyle(g).opacity})"
$AB eval "var a=document.querySelector('#home audio'); a.dispatchEvent(new Event('ended')); 'ended'"
$AB wait 2300
$AB screenshot scripts/motion/n_6_settled.png

echo "--- geometry: full composition + fit (desktop) ---"
$AB eval "var f=document.querySelector('.hero-frame'); var r=f.getBoundingClientRect(); var chip=document.querySelector('#home button'); var c=chip.getBoundingClientRect(); JSON.stringify({frameW:Math.round(r.width), frameH:Math.round(r.height), ratio:(r.width/r.height).toFixed(4), expect:1.3333, frameTop:Math.round(r.top), frameBottom:Math.round(r.bottom), vh:window.innerHeight, fullHeightCovered:Math.abs(r.height-window.innerHeight)<2, chipBottom:Math.round(c.bottom), chipFits:c.bottom<window.innerHeight, ambient:!!document.querySelector('.hero-ambient')})"
$AB eval "var b=document.querySelector('.blink-layer'); JSON.stringify({blinkAnim:getComputedStyle(b).animationName})"

echo "=== 720p: vertical fit ==="
$AB set viewport 1280 720
$AB open http://localhost:3000
$AB wait 2400
$AB click body
$AB wait 6000
$AB screenshot scripts/motion/n_7_laptop720.png
$AB eval "var f=document.querySelector('.hero-frame'); var r=f.getBoundingClientRect(); var chip=document.querySelector('#home button'); var c=chip.getBoundingClientRect(); var h1=document.querySelector('#home h1'); JSON.stringify({frameH:Math.round(r.height), frameW:Math.round(r.width), vh:window.innerHeight, chipBottom:Math.round(c.bottom), chipFits:c.bottom<window.innerHeight, h1Size:getComputedStyle(h1).fontSize})"

echo "=== mobile 390x844 ==="
$AB set viewport 390 844
$AB open http://localhost:3000
$AB wait 2500
$AB click body
$AB wait 1600
$AB eval "var a=document.querySelector('#home audio'); a.currentTime=3.1; a.dispatchEvent(new Event('timeupdate')); 'welcome'"
$AB wait 1400
$AB screenshot scripts/motion/n_8_mobile_welcome.png
$AB wait 5200
$AB screenshot scripts/motion/n_9_mobile_settled.png
$AB eval "var f=document.querySelector('.hero-frame'); var r=f.getBoundingClientRect(); var chip=document.querySelector('#home button'); var c=chip.getBoundingClientRect(); JSON.stringify({frameW:Math.round(r.width), frameH:Math.round(r.height), ratio:(r.width/r.height).toFixed(3), chipBottom:Math.round(c.bottom), vh:window.innerHeight, chipFits:c.bottom<window.innerHeight})"

echo "=== console + errors ==="
$AB console
$AB errors
echo "VERIFY_DONE"
