#!/usr/bin/env bash
#
# CRX packer based on http://www.adambarth.com/experimental/crx/docs/crx.html
#

if test $# -ne 3; then
  echo "Usage: crxmake.sh <file.zip> <key.pem> <output.crx>"
  exit 1
fi

zip=$1
key=$2
crx=$3
pub="$$.pub"
sig="$$.sig"
trap 'rm -f "$pub" "$sig"' EXIT

# signature
openssl sha1 -sha1 -binary -sign "$key" < "$zip" > "$sig"

# public key
openssl rsa -pubout -outform DER < "$key" > "$pub" 2>/dev/null

byte_swap () {
  # Take "abcdefgh" and return it as "ghefcdab"
  echo "${1:6:2}${1:4:2}${1:2:2}${1:0:2}"
}

crmagic_hex="43723234" # Cr24
version_hex="02000000" # 2
pub_len_hex=$(byte_swap $(printf '%08x\n' $(wc -c "${pub}" | awk '{print $1}')))
sig_len_hex=$(byte_swap $(printf '%08x\n' $(wc -c "${sig}" | awk '{print $1}')))
(
  echo "$crmagic_hex $version_hex $pub_len_hex $sig_len_hex" | xxd -r -p
  cat "$pub" "$sig" "$zip"
) > "$crx"
