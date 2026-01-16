#!/bin/bash

# Ensure build is fresh
pnpm run build

# Prompt for OTP
echo "Enter your NPM 2FA/OTP code:"
read otp

# Publish with OTP
pnpm publish --otp=$otp --access public --no-git-checks
