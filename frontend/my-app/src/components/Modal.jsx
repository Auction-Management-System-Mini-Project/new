import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Terms of Service</h3>
          <button className="close-button" onClick={onClose}>Close</button>
        </div>
        <div className="modal-body">
       <p>
Welcome to AuctionEase!<br/>
These terms of service ("Terms") govern your use of our online auction management system and any related services provided by us (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
<br /><br />1.Account Registration <br />
You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account, and you agree to accept responsibility for all activities that occur under your account.
<br /><br />2.Use of the Service <br />
You agree to use the Service only for lawful purposes and in compliance with all applicable laws and regulations.
You agree not to use the Service in any way that could damage, disable, overburden, or impair the Service or interfere with any other party's use of the Service.
<br /><br />3.Intellectual Property <br />
The Service and its original content, features, and functionality are and will remain the exclusive property of AuctionEase and its licensors.
<br /><br />4.Termination <br />

We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
<br /><br />5.Changes <br />
We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
<br /><br />6.Contact Us <br />
If you have any questions about these Terms, please contact us at auctioneaseplatform@gmail.com
</p><br />
<h3>Privacy Policy</h3>
Your privacy is important to us. It is AuctionEase's policy to respect your privacy regarding any information we may collect from you across our website and other sites we own and operate.
<br /><br />1.Information We Collect <br />
We may collect personal information such as your name, email address, and other information when you register for an account or make a purchase on our platform.
<br /><br />2. How We Use Your Information <br />
We may use the information we collect for various purposes, including to provide, maintain, and improve our Service, to process transactions, to send you updates and notifications, and to comply with legal requirements.
<br /><br />3.Sharing Your Information <br />
We may share your information with third-party service providers who help us provide and improve our Service. We do not sell your personal information to third parties.
<br /><br />4.Security <br />
We value your trust in providing us your personal information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
<br /><br />5.Changes to This Privacy Policy <br />
We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.
<br /><br />6.Contact Us <br />
If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at auctioneaseplatform@gmail.com


          
        </div>
      </div>
    </div>
  );
};

export default Modal;