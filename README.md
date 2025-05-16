# React based webapp

## To recreate froms scratch

#### Dependencies

`npm install -S autoprefixer axios copy-webpack-plugin exif-js piexif-ts postcss ramda react react-dom react-images-uploading react-router react-router-dom source-map-support typescript-optional`

npm install -S typescript-optional

#### DevDependencies

`npm install -D @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript @types/bootstrap @types/jest @types/react @types/react-dom babel-loader css-loader eslint file-loader html-webpack-plugin jest mini-css-extract-plugin postcss-loader sass sass-loader string-replace-loader style-loader stylelint stylelint-config-standard-scss stylelint-config-tailwindcss tailwindcss @tailwindcss/postcss ts-jest ts-loader typescript url-loader webpack webpack-cli webpack-dev-server`

npm install -D @tailwindcss/postcss

`tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `npm install -D @tailwindcss/postcss` and update your PostCSS configuration.




### OS/Special Files ###
.DS_Store
.DS_Store?
*.swp
*.swo
*~
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
*.lnk

### Build/Dependency Artifacts ###
/target/
**/target/
**/build/
**/out/
**/dist/
**/.gradle/
**/.mvn/
**/.npm/
**/.terraform/
**/.serverless/
**/.aws-sam/
**/cdk.out/

### IDE/Editor ###
.idea/
.vscode/
*.iml
*.ipr
*.iws

### Node ###
node_modules/
**/node_modules/
npm-debug.log*
yarn-error.log
.yarn-integrity
.pnp.js

### Logs/Cache ###
*.log
*.log*
logs/
**/logs/
.npm
.cache/
.parcel-cache
.nyc_output/
coverage/

### Environment ###
.env
.env*.local
.env.development.local
.env.production.local
.secrets
.terraform.tfstate*
terraform.tfstate*

### Negations (Keep these files) ###
!gradle/wrapper/gradle-wrapper.jar
!.mvn/wrapper/maven-wrapper.jar
!assets/
