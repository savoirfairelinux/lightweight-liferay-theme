<#if layout?? >
  <#assign group = layout.getGroup() >
  <#assign groupTypeSettings = group.getTypeSettingsProperties() >

  <#if groupTypeSettings.getProperty("googleAnalyticsId")?? >
    <#assign googleAnalyticsId = groupTypeSettings.getProperty("googleAnalyticsId") >
    <script>
        window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;
        ga('create','${htmlUtil.escapeJS(googleAnalyticsId)}','auto');ga('send','pageview')
    </script>
    <script src="https://www.google-analytics.com/analytics.js" async defer></script>
  </#if>
</#if>

