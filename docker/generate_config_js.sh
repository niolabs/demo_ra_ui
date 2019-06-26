#!/bin/sh -eu
cat <<EOF
window.PK_HOST='$PK_HOST';
window.PK_PORT=$PK_PORT;
window.PK_SECURE=$PK_SECURE;
window.PK_JWT='$PK_JWT';
window.WS_HOST='$WS_HOST';
window.WS_PORT=$WS_PORT;
window.WS_SECURE=$WS_SECURE;
window.ISDEV=$ISDEV;
EOF
