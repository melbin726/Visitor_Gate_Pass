const EmailTemplateModel = require('../pre_approval_models/EmailTemplate')
async function getEmailTemplate() {
  // Fetch the email template from the database using the ID
  const templateId = 1; // Replace with the actual ID of the template you want to use
  const template = await EmailTemplateModel.findOne({
    templateId: templateId,
  });

  return template;
}

module.exports = getEmailTemplate;
