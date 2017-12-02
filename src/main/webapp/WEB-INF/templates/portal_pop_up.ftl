<!DOCTYPE html>
<#include init />
<html class="${root_css_class}" dir="<@liferay.language key='lang.dir' />" lang="${w3c_language_id}">
  <head>
    <title>${the_title} - ${company_name}</title>

    <#include "${full_templates_path}/head/meta_tags.ftl" />

    <link rel="stylesheet" href="${css_folder}/main.min.css" charset="utf-8">
    <link href='${images_folder}/favicon/favicon.ico' rel="Shortcut Icon" />
  </head>

  <body class="${css_class}">

    <!-- Messages liferay -->
    <@liferay_util["include"] page="${dir_include}/common/themes/top_messages.jsp" />

    <main class="" id="main-content">
      <#if selectable>
        <@liferay_util["include"] page=content_include />
        <#else>
          ${portletDisplay.recycle()} ${portletDisplay.setTitle(the_title)}

          <@liferay_theme["wrap-portlet"] page="portlet.ftl">
            <@liferay_util["include"] page=content_include />
          </@>
      </#if>
    </main>

    <script src="${javascript_folder}/footer.js" charset="utf-8"></script>
  </body>
</html>
