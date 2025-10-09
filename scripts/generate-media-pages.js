const fs = require('fs');
const path = require('path');

const mediaItems = {
    news: [
        {
            title: 'SALi Launches New Liver Health Initiative',
            image: '../assets/images/gallery/1.jpg',
            url: '#'
        },
        {
            title: 'Dr. Tom Cherian Speaks at International Conference',
            image: '../assets/images/gallery/2.jpg',
            url: '#'
        }
    ],
    videos: [
        {
            title: 'Understanding Fatty Liver Disease',
            image: '../assets/images/gallery/3.jpg',
            url: 'https://www.youtube.com/watch?v=video_id'
        },
        {
            title: 'Patient Testimonial: A New Lease on Life',
            image: '../assets/images/gallery/4.jpg',
            url: 'https://www.youtube.com/watch?v=video_id'
        }
    ]
};

const layoutFilePath = path.join(__dirname, '..', 'src', 'components', 'media-page-layout.html');
const outputDir = path.join(__dirname, '..', 'public', 'media');

function generateMediaPage(page, items, layout) {
    let mediaEntries = '';
    items.forEach(item => {
        mediaEntries += `
            <div class="col-sm-6 col-md-6 col-lg-4">
                <div class="gallery-item">
                    <a href="${item.url}" ${page === 'videos' ? 'class="popup-video"' : ''}>
                        <img src="${item.image}" alt="${item.title}">
                    </a>
                </div>
            </div>`;
    });
    const output = layout.replace('{{MEDIA_ITEMS}}', mediaEntries);
    fs.writeFile(path.join(outputDir, `${page}.html`), output, 'utf8', err => {
        if (err) console.error(err);
        else console.log(`Successfully created ${page}.html`);
    });
}

fs.readFile(layoutFilePath, 'utf8', (err, layout) => {
    if (err) return console.error(err);
    generateMediaPage('index', mediaItems.news, layout);
    generateMediaPage('videos', mediaItems.videos, layout);
});
