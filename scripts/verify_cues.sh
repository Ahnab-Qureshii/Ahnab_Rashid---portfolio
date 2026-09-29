#!/bin/bash
# Cue-by-cue verification: seek the audio element to each sentence's
# start — timeupdate fires and drives the exact production code path
# (advanceStage + gesture + caption). Deterministic in headless.
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
SEEK='var a=document.querySelector("audio"); a.muted=true; a.currentTime=__T__; a.play().catch(function(e){}); "seeked to __T__"'

echo "=== desktop 1440x900: cue-by-cue ==="
$AB set viewport 1440 900
$AB open http://localhost:3000
$AB wait 2500
$AB click body >/dev/null          # trusted click = activation + skip intro
$AB wait 900

echo "--- cue 1: salam (0.5s) ---"
$AB eval "${SEEK/__T__/0.5}" >/dev/null
$AB wait 900
$AB screenshot scripts/motion/c_1_salam.png
$AB eval "JSON.stringify({stage0:document.querySelectorAll('.rv')[0].classList.contains('rv-in'), speakingInd:!!document.querySelector('.speaking-ind'), gOn:Array.from(document.querySelectorAll('.gesture-frame')).findIndex(function(x){return x.classList.contains('g-on')}), caption:document.querySelector('[aria-live]').textContent.trim().slice(0,20)})"

echo "--- cue 2: welcome (3.0s) ---"
$AB eval "${SEEK/__T__/3.0}" >/dev/null
$AB wait 1500
$AB screenshot scripts/motion/c_2_welcome.png
$AB eval "JSON.stringify({welcomeLive:document.querySelector('.welcome').classList.contains('welcome-live'), wordOp:(+getComputedStyle(document.querySelector('.welcome-script')).opacity).toFixed(2), gOn:Array.from(document.querySelectorAll('.gesture-frame')).findIndex(function(x){return x.classList.contains('g-on')}), caption:document.querySelector('[aria-live]').textContent.trim().slice(0,26)})"

echo "--- cue 3: name (6.0s) ---"
$AB eval "${SEEK/__T__/6.0}" >/dev/null
$AB wait 1400
$AB screenshot scripts/motion/c_3_name.png
$AB eval "JSON.stringify({nameIn:document.querySelectorAll('.rv')[1].classList.contains('rv-in'), introIn:document.querySelectorAll('.rv')[2].classList.contains('rv-in'), gOn:Array.from(document.querySelectorAll('.gesture-frame')).findIndex(function(x){return x.classList.contains('g-on')}), caption:document.querySelector('[aria-live]').textContent.trim().slice(0,18)})"

echo "--- cue 4: intro (11s) — stillness, no gesture ---"
$AB eval "${SEEK/__T__/11}" >/dev/null
$AB wait 1200
$AB screenshot scripts/motion/c_4_intro.png
$AB eval "JSON.stringify({introIn:document.querySelectorAll('.rv')[2].classList.contains('rv-in'), factsIn:document.querySelectorAll('.rv')[3].classList.contains('rv-in'), anyGesture:Array.from(document.querySelectorAll('.gesture-frame')).some(function(x){return x.classList.contains('g-on')}), caption:document.querySelector('[aria-live]').textContent.trim().slice(0,26)})"

echo "--- cue 5: show (22s) ---"
$AB eval "${SEEK/__T__/22}" >/dev/null
$AB wait 1300
$AB screenshot scripts/motion/c_5_show.png
$AB eval "JSON.stringify({ctaIn:document.querySelectorAll('.rv')[4].classList.contains('rv-in'), socialsIn:document.querySelectorAll('.rv')[5].classList.contains('rv-in'), chipIn:document.querySelectorAll('.rv')[6].classList.contains('rv-in'), gOn:Array.from(document.querySelectorAll('.gesture-frame')).findIndex(function(x){return x.classList.contains('g-on')}), caption:document.querySelector('[aria-live]').textContent.trim().slice(0,26)})"

echo "--- end (23.9s) — settles to rest ---"
$AB eval "${SEEK/__T__/23.9}" >/dev/null
$AB wait 900
$AB screenshot scripts/motion/c_6_settled.png
$AB eval "JSON.stringify({anyGesture:Array.from(document.querySelectorAll('.gesture-frame')).some(function(x){return x.classList.contains('g-on')}), speakingInd:!!document.querySelector('.speaking-ind'), socials:document.querySelectorAll('.social-icon').length, chipBottom:Math.round(document.querySelector('#home button').getBoundingClientRect().bottom)})"

echo "=== mobile 390x844: welcome overlay + face ==="
$AB set viewport 390 844
$AB open http://localhost:3000
$AB wait 2500
$AB click body >/dev/null
$AB wait 900
$AB eval "${SEEK/__T__/3.0}" >/dev/null
$AB wait 1500
$AB screenshot scripts/motion/c_7_mobile_welcome.png
$AB eval "${SEEK/__T__/6.0}" >/dev/null
$AB wait 1300
$AB screenshot scripts/motion/c_8_mobile_name.png
$AB eval "JSON.stringify({welcomeRect:(function(r){return [Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)]})(document.querySelector('.welcome').getBoundingClientRect()), chipBottom:Math.round(document.querySelector('#home button').getBoundingClientRect().bottom), fits:document.querySelector('#home button').getBoundingClientRect().bottom<844})"

$AB errors
echo "CUE_VERIFY_DONE"
