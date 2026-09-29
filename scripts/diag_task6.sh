#!/bin/bash
# Task 6 diagnostics: CSS rules present? media query? audio seek behavior? rAF loop?
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
$AB wait 4000
$AB click body
$AB wait 800

echo "--- 1. CSS rules present? ---"
$AB eval "var found={blink:[],nod:[],frame:[],media:[]}; for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) { if (r.selectorText && r.selectorText.includes('blink-layer')) found.blink.push(r.cssText.slice(0,80)); if (r.selectorText && r.selectorText.includes('hero-content')) found.frame.push(r.selectorText); if (r.media) found.media.push(r.media.mediaText+':'+[...r.cssRules].filter(x=>x.selectorText&&x.selectorText.includes('hero-content')).length); if (r.selectorText && r.selectorText.includes('hero-frame')) found.frame.push('direct:'+r.selectorText); } } catch(e){} } JSON.stringify(found)"

echo "--- 2. computed blink / gaze / h1 at 720p sim ---"
$AB eval "var b=document.querySelector('.blink-layer'); var h1=document.querySelector('#home h1'); JSON.stringify({blinkAnim:getComputedStyle(b).animationName, blinkOp:getComputedStyle(b).opacity, h1Now:getComputedStyle(h1).fontSize, mq720:matchMedia('(min-width:1024px) and (max-height:760px)').matches, vh:innerHeight})"

echo "--- 3. audio state + seek behavior ---"
$AB eval "var a=document.querySelector('#home audio'); JSON.stringify({paused:a.paused, t:a.currentTime, ready:a.readyState, dur:a.duration})"
$AB eval "var a=document.querySelector('#home audio'); a.currentTime=12.5; JSON.stringify({readBack:a.currentTime})"
$AB wait 700
$AB eval "var a=document.querySelector('#home audio'); var g=document.querySelector('.gaze-layer'); JSON.stringify({tAfter700:a.currentTime, gaze:getComputedStyle(g).opacity})"

echo "--- 4. pause first, then seek (rAF stopped) ---"
$AB eval "var a=document.querySelector('#home audio'); a.pause(); 'paused'"
$AB wait 300
$AB eval "var a=document.querySelector('#home audio'); a.currentTime=12.5; a.dispatchEvent(new Event('timeupdate')); JSON.stringify({t:a.currentTime})"
$AB wait 500
$AB eval "var a=document.querySelector('#home audio'); var g=document.querySelector('.gaze-layer'); JSON.stringify({t:a.currentTime, gaze:getComputedStyle(g).opacity, caption:(document.querySelector('[aria-live]')||{}).textContent})"

echo "--- 5. errors ---"
$AB errors
echo "DIAG_DONE"
