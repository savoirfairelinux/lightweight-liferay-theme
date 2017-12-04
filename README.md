# Lightweight Liferay Theme

![Liferay Lightweight logo](https://gitlab.savoirfairelinux.com/liferay-devel/lightweight-liferay-theme/raw/master/Logo.png)

## Instalation

### Configure

The actual repo architecture is for a maven project, but you can easily change that.

An important conf, on the gulpfile:

```js
var CONFIG = {
    url: 'lightweight.vm',
    outputFolder: './src/main/webapp/',
    distFolder: './target/',
    installedFolder: '/mnt/deploy-themes/',
    localDeployPath: '../vagrant/deploy-themes/', // If your liferay server is on your machine (not on a VM), should be same as CONFIG.installedFolder
    themeName: 'lightweight-theme'
```

This config exemple is for a liferay instance on a virtual machine, but you can edit this to use your localhost liferay server.

* **Url**: The url of your liferay instance (localhost, app.dev, etc...)
* **outputFolder**: The folder of the "pré-compiled" theme, that will be transform to a .war file
* **distFolder**: The path where the the war file is created
* **installedFolder**: A path to let liferay (Osgi) find the theme.
* **localDeployPath**:  A path for you local machine (can be same as **installedFolder** if your using on a localhost liferay)
* **themeName**: Your theme name

### Requierments:

* NodeJs, version **6.9.1** (v6 minimum).
* **Tips:** use **nvm** (node verison manager)
* yarn **>=0.17.10** (`npm install -g yarn`)

### Install:

Install dependencies:

```sh
yarn install
```

## Develop


Build the theme:

```sh
gulp build
```

Deploy for your local environement

```sh
gulp deployLocal
```

Auto-compile and sync files on your local environement (only after a gulp deployLocal)

```sh
gulp watch
```


## Liferay layout exemples

* **IMPORTANT** Layout should have the "main-content" id

```html
<div class="" id="main-content">
  <div class="portlet-layout">
    <div class="portlet-column portlet-column-only" id="column-1">
      $processor.processColumn("column-1", "portlet-column-content portlet-column-content-only")
    </div>
  </div>
</div>
```
