// services/ImageService.js
import { GALLERY_CONFIG } from '../constants.js';

export class ImageService {
    async fetchImages() {
        try {
            // Get the list of files from your assets/img directory
            const response = await fetch(`/${GALLERY_CONFIG.repoDetails.repo}/assets/img/`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Parse the directory listing HTML
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Get all image file links
            const imageFiles = Array.from(doc.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => /\.(jpg|jpeg)$/i.test(href))
                .map(href => href.split('/').pop())
                .sort((a, b) => {
                    const timeA = a.split('_')[0];
                    const timeB = b.split('_')[0];
                    return timeA.localeCompare(timeB);
                });

            return imageFiles;

        } catch (error) {
            console.error('Error fetching images:', error);
            throw new Error('Failed to fetch images: ' + error.message);
        }
    }
}