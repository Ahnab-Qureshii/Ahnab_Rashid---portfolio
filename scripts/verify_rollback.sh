#!/bin/bash
# Verification: Home page rolled back to pre-welcome state; HELLO intro untouched.
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
$AB wait 2200
$AB screenshot scripts/motion/rb_1_hello.png      # 1. HELLO intro intact?
$AB errors --clear >/dev/null
$AB console --clear >/dev/null
$AB click body                                    # step inside
$AB wait 7000                                     # original timeline: content settles ~2s
$AB screenshot scripts/motion/rb_2_home.png       # 2-6. original Home restored?

echo "--- rollback assertions ---"
$AB eval "JSON.stringify({ welcome: !!document.querySelector('.welcome'), light: !!document.querySelector('.welcome-light'), glow: !!document.querySelector('.welcome-glow'), mote: !!document.querySelector('.mote'), scriptFont: !!document.querySelector('.font-script'), gestureLayers: document.querySelectorAll('.gesture-frame').length, socials: document.querySelectorAll('.social-icon').length, voiceChip: !!document.querySelector('#home button'), nameSize: getComputedStyle(document.querySelector('h1')).fontSize, eyebrowDelay: getComputedStyle(document.querySelector('h1')).transitionDelay })"
$AB console
$AB errors
echo "ROLLBACK_VERIFY_DONE"
