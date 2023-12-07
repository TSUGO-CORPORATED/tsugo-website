import React from 'react';
import { useTheme, useMediaQuery, IconButton, Typography } from '@mui/material';


const Disclaimer: React.FC= ({ }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <div>
      <div className="modal" style={{ width: '100%', margin: '0' }}>
        <div className="modal-content" style={{ padding: '1px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
       
          </div>
  
          <Typography variant="h2" sx={{ fontSize: isMobile ? '16px' : '24px' }}>
            Terms and Conditions Agreements
          </Typography>
  
          <Typography variant="h3" sx={{ fontSize: isMobile ? '14px' : '20px' }}>
          1. Scope of Service
          </Typography>
          <Typography sx={{ fontSize: isMobile ? '12px' : '16px' }}>
            Our site provides a platform for matching requesters with volunteer
            interpreters. We do not conduct interpretation services ourselves.
            The matching process facilitated through our site is intended solely
            for initiating initial contact between requesters and interpreters.
            Furthermore, any financial transactions made through our site are
            prohibited, and we bear no responsibility for such transactions.
          </Typography>
  
          <Typography variant="h3" sx={{ fontSize: isMobile ? '14px' : '20px' }}>
            2. Terms of Use</Typography>
          <Typography variant="h4" sx={{ fontSize: isMobile ? '10px' : '14px' }}>
            Account Usage</Typography>
          <Typography sx={{ fontSize: isMobile ? '10px' : '16px' }}>
            Users must use their own accounts responsibly and are prohibited
            from allowing others to use their account.
          </Typography>
          <Typography variant="h4" sx={{ fontSize: isMobile ? '12px' : '18px' }}>
            Behavioral Standards</Typography>
          <Typography sx={{ fontSize: isMobile ? '10px' : '14px' }}>
            Users must act courteously towards other users and third parties,
            avoiding any behavior that may cause discomfort.
          </Typography>
          <Typography variant="h4" sx={{ fontSize: isMobile ? '12px' : '18px' }}>Purpose of Service</Typography>
          <Typography sx={{ fontSize: isMobile ? '10px' : '14px' }}>
            Users agree to use our site legally and solely for its intended
            purpose.
          </Typography>
          <Typography variant="h4" sx={{ fontSize: isMobile ? '12px' : '18px' }}>Prohibited Activities</Typography>
          <Typography sx={{ fontSize: isMobile ? '10px' : '14px' }}>
            Any form of harassment, fraud, threats, copyright infringement, or
            other illegal or inappropriate activities are strictly prohibited.
          </Typography>
          <Typography variant="h4" sx={{ fontSize: isMobile ? '12px' : '18px' }}>Accuracy of Information</Typography>
          <Typography sx={{ fontSize: isMobile ? '10px' : '14px' }}>
            Users are obligated to provide true and up-to-date information, and
            the provision of false information is prohibited.
          </Typography>
          <Typography variant="h4" sx={{ fontSize: isMobile ? '12px' : '18px' }}>Site Usage Restrictions</Typography>
          <Typography sx={{ fontSize: isMobile ? '10px' : '14px' }}>
            The site administrators reserve the right to temporarily or
            permanently suspend accounts in case of violations of the terms or
            improper use.
          </Typography>
  
          <Typography variant="h4" sx={{ fontSize: isMobile ? '12px' : '18px' }}>3. Limitation of Liability</Typography>
          <Typography variant="h5" sx={{ fontSize: isMobile ? '10px' : '16px' }}>Interpretation Services</Typography>
          <Typography sx={{ fontSize: isMobile ? '10px' : '14px' }}>
            Our site only provides a platform for matching interpreters and
            requesters, and does not offer interpretation services itself.
            Therefore, we are not liable for any direct or indirect damages
            arising from errors, misunderstandings, or other issues related to
            the interpretation services.
          </Typography>
          <Typography variant="h5" sx={{ fontSize: isMobile ? '10px' : '16px' }}>Appointment (Request) Liability</Typography>
          <Typography sx={{ fontSize: isMobile ? '10px' : '14px' }}>
            We are not responsible for the establishment or execution of
            appointments or reservations for interpretation services. We bear no
            responsibility for any troubles related to appointments or failures
            to establish a reservation.
          </Typography>
  
          <Typography variant="h4" sx={{ fontSize: isMobile ? '12px' : '18px' }}>4. Prohibited Conduct</Typography>
          <Typography sx={{ fontSize: isMobile ? '10px' : '14px' }}>
            Our site strictly prohibits the following behaviors:
            <br />
            ・Harassment: Any form of harassment or threats against other users
            or third parties.
            <br />
            ・Fraud: Providing false information or deceiving others.
            <br />
            ・Threats: Threatening other users or third parties.
            <br />
            ・Copyright Infringement: Unauthorized use of someone else's
            copyrighted work.
            <br />
            ・Other Illegal or Inappropriate Activities: Any actions that
            violate the law or hinder the operation of our site.
            <br />
            These prohibitions apply to both online behavior and actual conduct
            through interpretation services. Violations may result in temporary
            suspension or permanent expulsion from the site.
          </Typography>
  
          <Typography variant="h4" sx={{ fontSize: isMobile ? '12px' : '18px' }}>5. Accuracy of Information</Typography>
          <Typography sx={{ fontSize: isMobile ? '10px' : '14px' }}>
            Users must provide accurate and up-to-date information and are
            prohibited from providing false information.
          </Typography>
  
          <Typography variant="h4" sx={{ fontSize: isMobile ? '12px' : '18px' }}>6. Site Usage Restrictions</Typography>
          <Typography sx={{ fontSize: isMobile ? '10px' : '14px' }}>
            The site administrators have the right to temporarily or permanently
            suspend accounts if violations of terms or improper use are
            discovered.
          </Typography>
  
          <Typography variant="h4" sx={{ fontSize: isMobile ? '12px' : '18px' }}>7. Changes and Updates</Typography>
          <Typography sx={{ fontSize: isMobile ? '10px' : '14px' }}>
            These terms of use are subject to change without notice, and users
            are required to regularly review and comply with the updated terms.
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;