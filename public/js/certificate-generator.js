// Certificate Generator for Browser
class CertificateGenerator {
    constructor() {
        this.canvas = null;
        this.ctx = null;
    }

    // Generate certificate image in browser
    async generateCertificate(certificateData) {
        const { userName, courseName, issueDate, certificateId, shareLink } = certificateData;
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = 900;
        this.canvas.height = 600;
        this.ctx = this.canvas.getContext('2d');

        // Create gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 900, 600);
        gradient.addColorStop(0, '#1e3a8a');
        gradient.addColorStop(1, '#1d4ed8');
        
        // Fill background
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, 900, 600);

        // Add border
        this.ctx.strokeStyle = '#3b82f6';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(3, 3, 894, 594);

        // Load and draw logo
        await this.drawLogo();

        // Draw text content
        this.drawText(userName, courseName, issueDate, shareLink);

        // Convert to blob and save to localStorage
        return new Promise((resolve) => {
            this.canvas.toBlob((blob) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = reader.result;
                    // Save to localStorage temporarily
                    localStorage.setItem(`certificate_${certificateId}`, base64);
                    localStorage.setItem(`certificate_${certificateId}_data`, JSON.stringify(certificateData));
                    resolve(base64);
                };
                reader.readAsDataURL(blob);
            }, 'image/png');
        });
    }

    // Draw academy logo
    async drawLogo() {
        return new Promise((resolve) => {
            const logo = new Image();
            logo.crossOrigin = 'anonymous';
            logo.onload = () => {
                this.ctx.drawImage(logo, 740, 20, 110, 110);
                resolve();
            };
            logo.onerror = () => {
                // If logo fails to load, continue without it
                resolve();
            };
            logo.src = 'https://i.ibb.co/x8sYjYyK/out.png';
        });
    }

    // Draw certificate text
    drawText(userName, courseName, issueDate, shareLink) {
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Header
        this.ctx.fillStyle = '#a5b4fc';
        this.ctx.font = 'bold 40px Arial';
        this.ctx.fillText('شهادة إتمام', 50, 80);

        // Main content
        this.ctx.fillStyle = '#e0e7ff';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('تشهد أكاديمية العرب التقنية بأن', 450, 200);

        // Student name
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 45px Arial';
        this.ctx.fillText(userName, 450, 280);

        // Course completion text
        this.ctx.fillStyle = '#e0e7ff';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('قد أتم بنجاح متطلبات', 450, 320);

        // Course name
        this.ctx.fillStyle = '#bfdbfe';
        this.ctx.font = 'bold 26px Arial';
        this.ctx.fillText(courseName, 450, 360);

        // Description
        this.ctx.fillStyle = '#e0e7ff';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('وهي مبادرة تعليمية تهدف إلى تطوير المهارات التقنية في العالم العربي.', 450, 400);

        // Verification info
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = '#93c5fd';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('رقم التحقق:', 50, 480);
        this.ctx.font = '14px Arial';
        this.ctx.fillText(issueDate, 50, 500);

        // Signature
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('محمد ال عبية', 650, 480);
        this.ctx.fillStyle = '#bfdbfe';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('مشرف البرنامج', 650, 500);

        // Verification URL
        this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`للتحقق من صحة هذه الشهادة: ${shareLink}`, 600, 550);
    }

    // Upload certificate to server
    async uploadCertificate(certificateId) {
        const base64 = localStorage.getItem(`certificate_${certificateId}`);
        if (!base64) {
            throw new Error('Certificate not found in localStorage');
        }

        // Convert base64 to blob
        const response = await fetch(base64);
        const blob = await response.blob();

        // Create form data
        const formData = new FormData();
        formData.append('certificate', blob, `certificate-${certificateId}.png`);
        formData.append('certificateId', certificateId);

        // Upload to server
        const uploadResponse = await fetch('/api/certificate/upload', {
            method: 'POST',
            body: formData
        });

        if (!uploadResponse.ok) {
            throw new Error('Failed to upload certificate');
        }

        const result = await uploadResponse.json();
        
        // Clean up localStorage after successful upload
        localStorage.removeItem(`certificate_${certificateId}`);
        localStorage.removeItem(`certificate_${certificateId}_data`);
        
        return result;
    }

    // Download certificate as PDF
    async downloadAsPDF(certificateId) {
        const base64 = localStorage.getItem(`certificate_${certificateId}`);
        if (!base64) {
            throw new Error('Certificate not found in localStorage');
        }

        // Create PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Add image to PDF
        pdf.addImage(base64, 'PNG', 0, 0, 297, 210); // A4 landscape dimensions

        // Download PDF
        pdf.save(`certificate-${certificateId}.pdf`);
    }

    // Get certificate from localStorage
    getCertificate(certificateId) {
        const base64 = localStorage.getItem(`certificate_${certificateId}`);
        const data = localStorage.getItem(`certificate_${certificateId}_data`);
        
        if (base64 && data) {
            return {
                image: base64,
                data: JSON.parse(data)
            };
        }
        return null;
    }

    // List all certificates in localStorage
    listCertificates() {
        const certificates = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('certificate_') && !key.endsWith('_data')) {
                const certificateId = key.replace('certificate_', '');
                const certificate = this.getCertificate(certificateId);
                if (certificate) {
                    certificates.push({
                        id: certificateId,
                        ...certificate.data
                    });
                }
            }
        }
        return certificates;
    }
}

// Global instance
window.certificateGenerator = new CertificateGenerator();
