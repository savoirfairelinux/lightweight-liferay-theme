<ul class="languageMenu">
  <#list availableMenuLanguages as menuLanguage>
    <#if menuLanguage == locale >
      <li class="languageMenu__item"><span class="languageMenu__link languageMenu__link--active">${menuLanguage.getLanguage()?upper_case}</span></li>
    <#else>
      <#assign langSwitcherUrl = theme_display.getPathMain() + "/portal/update_language?p_l_id=" + theme_display.getPlid() + "&amp;redirect=" + htmlUtil.escapeAttribute(portalUtil.getCurrentURL(request)) + "&amp;languageId=" + menuLanguage />
      <li class="languageMenu__item"><a href="${langSwitcherUrl}" class="languageMenu__link">${menuLanguage.getLanguage()?upper_case}</a></li>
    </#if>
  </#list>
</ul>
