export const environment = {
  production: false,
  
  // Configurare EmailJS
  emailjs: {
    serviceId: 'your_service_id', // Înlocuiește cu Service ID-ul tău de pe EmailJS
    templateId: 'your_template_id', // Înlocuiește cu Template ID-ul tău
    publicKey: 'your_public_key', // Înlocuiește cu Public Key-ul tău
    adminTemplateId: 'admin_template_id' // Template pentru email-uri către admin
  },
  
  // Email-uri pentru aplicație
  emails: {
    admin: 'il.alexandru@yahoo.com', // Email-ul administratorului
    from: 'noreply@productsite.com' // Email-ul de la care se trimit mesajele
  },
  
  // Configurare aplicație
  app: {
    name: 'ProductSite',
    version: '1.0.0'
  }
};
