<#assign portlet_display = portletDisplay />

<#assign portlet_content_css_class = "portlet-content" />
<#assign portlet_id = htmlUtil.escapeAttribute(portlet_display.getId()) />

<section class="portlet" id="portlet_${portlet_id}">
  <div class="${portlet_content_css_class}">
    ${portlet_display.writeContent(writer)}
  </div>
</section>
