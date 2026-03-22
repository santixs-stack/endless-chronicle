#!/bin/bash
# ═══════════════════════════════════════════
#  ICON DOWNLOADER — The Endless Chronicle
#  Run from: ~/Downloads/endless-chronicle
#  Downloads all icons needed for archetype
#  and genre selection screens.
# ═══════════════════════════════════════════

BASE="public/icons/icons/ffffff/transparent/1x1"
CDN="https://game-icons.net/icons/ffffff/transparent/1x1"

mkdir -p "$BASE/lorc" "$BASE/delapouite"

download() {
  local path="$1"
  local file="$BASE/$path.svg"
  if [ -f "$file" ]; then
    echo "  skip: $path"
  else
    echo "  get:  $path"
    curl -sf "$CDN/$path.svg" -o "$file" || echo "  FAIL: $path"
  fi
}

echo "=== Downloading all game icons ==="

# ── Genre picker icons ──────────────────────
download lorc/broadsword
download lorc/rocket
download lorc/anchor
download lorc/ghost
download lorc/law-star
download lorc/radioactive
download lorc/android-mask
download lorc/zeus-sword
download lorc/fairy
download lorc/throwing-star
download lorc/roman-shield

# ── Archetype icons — Fantasy ──────────────
download lorc/broadsword
download lorc/wizard-staff
download lorc/plain-dagger
download lorc/high-shot
download delapouite/caduceus
download lorc/holy-grail
download delapouite/banjo
download lorc/fluffy-trefoil

# ── Archetype icons — Space ───────────────
download lorc/ray-gun
download lorc/gear-hammer
download delapouite/laptop
download lorc/rocket
download delapouite/medal-skull
download lorc/domino-mask
download lorc/alien-skull

# ── Archetype icons — Ocean ───────────────
download lorc/cutlass
download lorc/tentacle
download lorc/swap-bag
download lorc/compass
download lorc/anchor
download delapouite/coins
download lorc/mermaid

# ── Archetype icons — Horror ──────────────
download lorc/stake
download lorc/pentacle
download lorc/magnifying-glass
download delapouite/footprint
download lorc/third-eye
download delapouite/all-seeing-eye
download lorc/werewolf

# ── Archetype icons — Western ─────────────
download delapouite/revolver
download lorc/herbs
download lorc/cowboy-holster
download lorc/card-play
download lorc/boot-stomp

# ── Archetype icons — Post-Apocalyptic ────
download lorc/spiked-bat
download lorc/tesla-coil
download delapouite/binoculars
download lorc/crossed-axes

# ── Archetype icons — Cyberpunk ───────────
download lorc/katana
download lorc/brain-stem
download delapouite/briefcase
download delapouite/delivery-drone
download lorc/scalpel
download lorc/crowned-skull

# ── Archetype icons — Mythology ───────────
download lorc/crystal-ball
download lorc/fox-head
download lorc/wolf-howl
download lorc/ankh
download lorc/spartan-helmet
download lorc/swap
download lorc/giant

# ── Archetype icons — Fairy Tale ──────────
download lorc/fairy-wand
download lorc/wood-axe
download lorc/cauldron
download lorc/crown

# ── Archetype icons — Ninja/Samurai ───────
download lorc/concentration-orb
download lorc/snatch
download delapouite/asian-lantern
download lorc/drama-masks

# ── Archetype icons — Historical ──────────
download lorc/roman-shield
download lorc/alchemy-jugs
download lorc/cloak-and-dagger
download lorc/skull-staff
download lorc/battle-axe

# ── Sidebar / game UI icons ───────────────
download lorc/floppy-disk
download lorc/cloud-upload
download lorc/open-book
download lorc/character-sheet
download lorc/magnifying-glass
download lorc/film-strip
download lorc/paper-arrow

echo ""
echo "=== Done. Now push to deploy: ==="
echo "git add -A && git commit -m 'feat: add all missing game icons' && git push"
