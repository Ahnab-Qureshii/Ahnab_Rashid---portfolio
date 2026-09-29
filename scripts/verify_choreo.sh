#!/bin/bash
# Verify the SPEECH-driven choreography by unmuting the audio clock:
# muted playback is allowed in headless Chromium, so timeupdate fires
# and every cue/gesture/reveal runs exactly as with real audio.
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
START='var a=document.querySelector("audio"); a.muted=true; a.play().then(function(){"playing"}).catch(function(e){String(e)}); "started"'

echo "=== desktop 1440x900: choreography driven by the audio clock ==="
$AB set viewport 1440 900
$AB open http://localhost:3000
$AB wait 2500                    # intro on screen
$AB click body >/dev/null
$AB wait 200
$AB eval 'var a=document.querySelector("audio"); a.muted=true; a.play().catch(function(e){window.__pe=e.name}); "started"'
$AB wait 800                     # salam + welcoming lift
$AB screenshot scripts/motion/v_1_salam.png
$AB eval "JSON.stringify({ct:+document.querySelector('audio').currentTime.toFixed(2), speaking:!!document.querySelector('.speaking-ind'), gOn:Array.from(document.querySelectorAll('.gesture-frame')).findIndex(function(x){return x.classList.contains('g-on')}), eyebrow:document.querySelectorAll('.rv')[0].classList.contains('rv-in')})"
$AB wait 2600                    # ~3.4s: welcome cue + light
$AB screenshot scripts/motion/v_2_welcome.png
$AB wait 3400                    # ~6.8s: name cue + hand toward heart
$AB screenshot scripts/motion/v_3_name.png
$AB eval "JSON.stringify({ct:+document.querySelector('audio').currentTime.toFixed(2), nameIn:document.querySelectorAll('.rv')[1].classList.contains('rv-in'), introIn:document.querySelectorAll('.rv')[2].classList.contains('rv-in')})"
$AB wait 5200                    # ~12s: intro sentence, stillness
$AB screenshot scripts/motion/v_4_intro.png
$AB wait 10300                   # ~22.4s: show cue + CTAs/socials
$AB screenshot scripts/motion/v_5_show.png
$AB eval "JSON.stringify({ct:+document.querySelector('audio').currentTime.toFixed(2), ctaIn:document.querySelectorAll('.rv')[3].classList.contains('rv-in'), chipIn:document.querySelectorAll('.rv')[6] ? document.querySelectorAll('.rv')[6].classList.contains('rv-in') : 'n/a'})"
$AB wait 2600                    # ended
$AB screenshot scripts/motion/v_6_settled.png
$AB eval "JSON.stringify({ct:+document.querySelector('audio').currentTime.toFixed(2), paused:document.querySelector('audio').paused, anyGestureOn:Array.from(document.querySelectorAll('.gesture-frame')).some(function(x){return x.classList.contains('g-on')}), chipBottom:Math.round(document.querySelector('#home button').getBoundingClientRect().bottom)})"

echo "=== mobile 390x844: same choreography, face stays clear ==="
$AB set viewport 390 844
$AB open http://localhost:3000
$AB wait 7500
$AB click body >/dev/null
$AB wait 200
$AB eval 'var a=document.querySelector("audio"); a.muted=true; a.play().catch(function(e){window.__pe=e.name}); "started"'
$AB wait 3400                    # welcome moment
$AB screenshot scripts/motion/v_7_mobile_welcome.png
$AB wait 3400                    # name cue
$AB screenshot scripts/motion/v_8_mobile_name.png
$AB eval "JSON.stringify({welcomeRect:(function(r){return [Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)]})(document.querySelector('.welcome').getBoundingClientRect()), chipBottom:Math.round(document.querySelector('#home button').getBoundingClientRect().bottom), fits:document.querySelector('#home button').getBoundingClientRect().bottom<844})"

echo "=== console + errors ==="
$AB console | tail -4
$AB errors
echo "CHOREO_VERIFY_DONE"
