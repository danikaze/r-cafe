#!/usr/bin/env bash

PWD=`pwd`
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"/..
APP="${DIR}/app"
CRX="${DIR}/scripts/build-crx.sh"
WEBPACK="${DIR}/node_modules/.bin/webpack"
PACKAGE_JSON="${DIR}/package.json"
MANIFEST_JSON="${DIR}/manifest.json"
PACKAGE_NAME="r-cafe"
PACKAGE_VERSION=$(cat "${PACKAGE_JSON}" \
  | grep '"version"' \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
MANIFEST_VERSION=$(cat "${MANIFEST_JSON}" \
  | grep '"version"' \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
TARGET_DIR="${DIR}/bin"
TARGET_CRX="${TARGET_DIR}/${PACKAGE_NAME}-${PACKAGE_VERSION}.crx"
TARGET_ZIP="${TARGET_DIR}/${PACKAGE_NAME}-${PACKAGE_VERSION}.zip"
PEM_KEY="${DIR}/${PACKAGE_NAME}.pem"

if [ $PACKAGE_VERSION != $MANIFEST_VERSION ]; then
  echo "! package.json version ($PACKAGE_VERSION) is different from manifest.json version ($MANIFEST_VERSION)"
  exit 1;
fi

mkdir -p "${TARGET_DIR}"

# Generate built files in the `app` folder
echo "* Building ${PACKAGE_NAME}-${PACKAGE_VERSION}"
cd "${DIR}"
$WEBPACK --config webpack.config.js --env=production

# Generate the zip file (for the Chrome store)
echo "* Creating $(basename ${TARGET_ZIP})"
cd "${APP}"
zip -r -9 -q ${TARGET_ZIP} *

# Generate the .crx (for the github release attachment)
# TODO: Fix this issue: https://gist.github.com/paddycarver/820351#gistcomment-2896887
#echo "* Creating $(basename ${TARGET_CRX})"
#$CRX "$TARGET_ZIP" "$PEM_KEY" "$TARGET_CRX"

# Restore the working directory
cd "$PWD"
