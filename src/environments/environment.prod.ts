export const environment = {
  production: true,
  
  // Configurare EmailJS pentru producție
  emailjs: {
    serviceId: 'your_prod_service_id',
    templateId: 'your_prod_template_id', 
    publicKey: 'your_prod_public_key',
    adminTemplateId: 'your_prod_admin_template_id'
  },
  
  // Email-uri pentru producție
  emails: {
    admin: 'il.alexandru@yahoo.com',
    from: 'noreply@productsite.com'
  },
  
  // Configurare aplicație
  app: {
    name: 'ProductSite',
    version: '1.0.0'
  }
};
