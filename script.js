// HTTP Status Codes - Only 6 lines (most common ones)
const statusCodes = [
    { code: '200', description: 'OK' },
    { code: '201', description: 'Created' },
    { code: '400', description: 'Bad Request' },
    { code: '401', description: 'Unauthorized' },
    { code: '404', description: 'Not Found' },
    { code: '500', description: 'Internal Server Error' }
];

// Populate the status codes
function populateStatusCodes() {
    const container = document.getElementById('statusCodes');
    
    statusCodes.forEach(status => {
        const statusItem = document.createElement('div');
        statusItem.className = 'status-item';
        statusItem.innerHTML = `
            <span class="status-code">${status.code}</span>
            <span class="status-description">${status.description}</span>
        `;
        container.appendChild(statusItem);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', populateStatusCodes);
