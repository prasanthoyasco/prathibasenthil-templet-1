/**
 * Prathiba Senthil - Global Configuration File
 * Centralized settings for contact information, WhatsApp numbers, 
 * pre-filled messages, emails, social links, and brand metadata.
 * 
 * Update any value here to automatically reflect across the entire website!
 */

const SOULVERSE_CONFIG = {
  // Brand Identity
  brand: {
    name: "Prathiba Senthil",
    symbol: "✦",
    tagline: "Manifest A Brighter You",
    subtitle: "Your Thoughts Shape Your Reality",
    established: "2024",
    location: "Global Digital Sanctuary"
  },

  // Contact Information
  contact: {
    // WhatsApp contact number (digits only without '+' or spaces for wa.me link)
    whatsappNumber: "919876543210",
    
    // Display formatted WhatsApp phone number for human reading
    whatsappDisplay: "+91 98765 43210",

    // General official inquiry email
    email: "connect@prathibasenthil.com",
    
    // Support & student desk email
    supportEmail: "support@prathibasenthil.com",
    
    // Optional official calling line
    phoneDisplay: "+1 (800) 555-SOUL",
    phoneTel: "+18005557685"
  },

  // Pre-configured WhatsApp Messages for Conversions
  whatsappMessages: {
    // Default general greeting
    general: "Hello Prathiba Senthil, I would like to learn more about your cosmic manifestation journeys.",

    // Job / Money Manifestation Course pre-filled message
    jobMoneyCourse: "Hello Prathiba Senthil, I would like to enquire about enrolling in the Job / Money Manifestation Video Course. Please share the details.",

    // The Supernatural 6-Month Mentorship pre-filled message
    supernaturalCourse: "Hello Prathiba Senthil, I would like to enquire about applying for The Supernatural 6-Month Personal Mentorship Course. Please guide me on the application process.",

    // Post-enquiry follow-up message
    enquiryFollowup: "Hello Prathiba Senthil, I just submitted an enquiry on your website and would love to connect directly regarding my manifestation goals."
  },

  // Official Social Media Channels
  socials: {
    instagram: "https://instagram.com/Prathibasenthil.official",
    youtube: "https://youtube.com/@Prathibasenthil",
    twitter: "https://twitter.com/Prathibasenthil",
    linkedin: "https://linkedin.com/company/Prathibasenthil",
    spotify: "https://spotify.com/show/Prathibasenthil-meditations"
  },

  // Course Pricing & Metadata
  courses: {
    jobMoney: {
      id: "job-money-manifestation",
      title: "Job / Money Manifestation Course",
      badge: "VIDEO COURSE",
      priceDisplay: "₹2,999",
      originalPriceDisplay: "₹4970",
      duration: "Self-Paced · 8 Modules · Lifetime Access",
      url: "course-job-money.html"
    },
    supernatural: {
      id: "the-supernatural-mentorship",
      title: "The Supernatural",
      badge: "6 MONTH PERSONAL COURSE",
      priceDisplay: "By Application",
      duration: "6 Months · Bespoke 1-on-1 Mentorship",
      url: "course-supernatural.html"
    }
  },

  // Helper function to build dynamic WhatsApp redirection URLs
  getWhatsAppUrl: function(type = "general", customParam = "") {
    const baseUrl = "https://wa.me/" + this.contact.whatsappNumber;
    let message = this.whatsappMessages[type] || this.whatsappMessages.general;
    
    if (customParam) {
      message += " (" + customParam + ")";
    }

    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
};

// Freeze to prevent unintended modifications at runtime
Object.freeze(SOULVERSE_CONFIG);

// Export for ES modules or attach to window for standard scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SOULVERSE_CONFIG;
} else {
  window.SOULVERSE_CONFIG = SOULVERSE_CONFIG;
}
