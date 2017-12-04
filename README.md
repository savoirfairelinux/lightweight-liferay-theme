# Lightweight Liferay Theme

![Liferay Lightweight logo](https://gitlab.savoirfairelinux.com/liferay-devel/lightweight-liferay-theme/raw/master/Logo.svg)

## Instalation

### Configure

This repo architecture is for a maven project, but you can easily change that.

Important conf, on the gulpfile you will see this object:

```js
var CONFIG = {
    url: 'lightweight.vm',
    warFolder: './target/',
    installedFolder: '/mnt/deploy-themes/',
    localDeployPath: '../vagrant/deploy-themes/', // If your liferay server is on your machine (not on a VM), should be same as CONFIG.installedFolder
    themeName: 'lightweight-theme'
};
```

This config can work with a liferay instance on your localhost, or on a virtual machine

* **Url**: The url of your liferay instance
* **warFolder**: The path where found the war file (compiled by maven, ant, etc...)
* **installedFolder**: A path for liferay
* **localDeployPath**:  A path for you local machine (can be same as the path for liferay if your are not with a virtualised env)
* **themeName**: Your theme name

### Requierments:

* NodeJs, version **6.9.1** (v6 minimum).
* **Tips:** use **nvm** (node verison manager)
* yarn **>0.16.1** (`npm install -g yarn`)

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
